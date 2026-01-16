import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prismaWithTimeout } from '@/lib/prisma';
import { generateToken } from '@/lib/auth/jwt';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok, unauthorized } from '@/lib/api/response';
import { validateBody, loginSchema } from '@/lib/api/validators';
import { withRateLimit } from '@/lib/api/proxy';

export async function POST(request: NextRequest): Promise<NextResponse> {
  return withErrorHandling(async (): Promise<NextResponse> => {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const rateLimitConfig = getRateLimit('login');
    const rateLimitMiddleware = withRateLimit(
      rateLimitConfig.limit,
      rateLimitConfig.interval,
      ip,
      { headers: request.headers, url: request.url }
    );
    
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult instanceof NextResponse) {
      return rateLimitResult;
    }

    // Walidacja body
    const bodyResult = await validateBody(loginSchema, request);
    if (bodyResult instanceof NextResponse) {
      return bodyResult;
    }
    const { email, password } = bodyResult;

    // Znajdź użytkownika
    const user = await prismaWithTimeout(async (client) => {
      return client.user.findUnique({
        where: { email }
      });
    }, 30000);

    if (!user) {
      return unauthorized('Nieprawidłowy email lub hasło');
    }

    // Sprawdź hasło
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return unauthorized('Nieprawidłowy email lub hasło');
    }

    // Generuj JWT token
    const token = await generateToken({
      userId: user.id,
      email: user.email,
    });

    // Sukces - zwróć dane użytkownika i token
    const response = ok({
      message: 'Logowanie pomyślne',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    }, 200);

    console.log('x-forwarded-proto:', request.headers.get('x-forwarded-proto'));
    console.log('request.url:', request.url);
    console.log('secure będzie:', request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https://'));

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
