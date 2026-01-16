import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prismaWithTimeout } from '@/lib/prisma';
import { generateToken, getAuthenticatedUser } from '@/lib/auth/jwt';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok, badRequest } from '@/lib/api/response';
import { validateBody, registerSchema } from '@/lib/api/validators';
import { withRateLimit, withContentLength } from '@/lib/api/proxy';
import { TOKEN_LENGTH_LIMITS } from '@/lib/utils/constants';
import { sanitizeName } from '@/lib/utils/sanitize';

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    // Przekierowanie jeśli user zalogowany 
    const authenticatedUser = await getAuthenticatedUser(request);
    if (authenticatedUser) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    
    const rateLimitConfig = getRateLimit('register');
    const rateLimitMiddleware = withRateLimit(
      rateLimitConfig.limit,
      rateLimitConfig.interval,
      ip,
      { headers: request.headers, url: request.url }
    );
    
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Content length check
    const contentLengthResult = await withContentLength(10 * 1024)(request);
    if (contentLengthResult) {
      return contentLengthResult;
    }

    // Walidacja body
    const bodyResult = await validateBody(registerSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }
    const { firstName, lastName, email, password, inviteToken } = bodyResult;

    // Walidacja długości inviteToken
    if (inviteToken && inviteToken.length > TOKEN_LENGTH_LIMITS.INVITE_TOKEN) {
      return badRequest('Token zaproszenia jest nieprawidłowy');
    }

    // Sprawdź czy użytkownik już istnieje
    const existingUser = await prismaWithTimeout(async (client) => {
      return client.user.findUnique({
        where: { email }
      });
    }, 30000);

    if (existingUser) {
      return badRequest('Użytkownik o tym adresie email już istnieje');
    }

    // Jeśli podano token, sprawdź czy jest ważny
    let affair = null;
    if (inviteToken) {
      affair = await prismaWithTimeout(async (client) => {
        return client.affair.findUnique({
          where: { inviteToken },
          select: {
            id: true,
            inviteTokenUsed: true,
            title: true
          }
        });
      }, 30000);

      if (!affair) {
        return badRequest('Nieprawidłowy lub nieważny token zaproszenia');
      }

      if (affair.inviteTokenUsed) {
        return badRequest('Token zaproszenia został już wykorzystany');
      }
    }

    // Sanityzacja danych przed zapisem
    const sanitizedFirstName = sanitizeName(firstName);
    const sanitizedLastName = sanitizeName(lastName);

    // Hashuj hasło
    const hashedPassword = await bcrypt.hash(password, 10);

    // Utwórz użytkownika
    const user = await prismaWithTimeout(async (client) => {
      return client.user.create({
        data: {
          firstName: sanitizedFirstName,
          lastName: sanitizedLastName,
          email,
          password: hashedPassword
        }
      });
    }, 30000);

    // Jeśli rejestracja przez token, przypisz sprawę do użytkownika
    if (inviteToken && affair) {
      await prismaWithTimeout(async (client) => {
        return client.$transaction(async (tx) => {
          // Zaktualizuj sprawę
          await tx.affair.update({
            where: { id: affair.id },
            data: {
              involvedUserId: user.id,
              inviteTokenUsed: true,
              inviteToken: null
            }
          });

          // Utwórz rekord uczestnika dla nowego użytkownika ze statusem REACTION_NEEDED
          await tx.affairParticipant.create({
            data: {
              userId: user.id,
              affairId: affair.id,
              status: 'REACTION_NEEDED'
            }
          });
        });
      }, 30000);
    }

    // Generuj JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // Zwróć sukces (bez hasła!)
    const response = ok({
      message: 'Rejestracja zakończona pomyślnie',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token,
      ...(affair && { affairTitle: affair.title })
    }, 201);

    // Ustaw httpOnly cookie z tokenem
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://'),
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dni
      path: '/',
    });

    return response;
  });
}
