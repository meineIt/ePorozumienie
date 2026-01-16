import { NextRequest } from 'next/server';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok, notFound, badRequest } from '@/lib/api/response';
import { validateBody, profileUpdateSchema } from '@/lib/api/validators';
import { withRateLimit, withCSRF, withContentLength } from '@/lib/api/proxy';
import { getUserProfile, updateUserProfile } from '@/lib/services/userService';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    // Rate limiting
    const rateLimitConfig = getRateLimit('profile-get');
    const rateLimitMiddleware = withRateLimit(
      rateLimitConfig.limit,
      rateLimitConfig.interval,
      authUser.userId,
      { headers: request.headers, url: request.url }
    );
    
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // Pobierz dane użytkownika
    const user = await getUserProfile(authUser.userId);

    if (!user) {
      return notFound('Użytkownik nie został znaleziony');
    }

    return ok({ user });
  });
}

export async function PATCH(request: NextRequest) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    // Rate limiting
    const rateLimitConfig = getRateLimit('profile-update');
    const rateLimitMiddleware = withRateLimit(
      rateLimitConfig.limit,
      rateLimitConfig.interval,
      authUser.userId,
      { headers: request.headers, url: request.url }
    );
    
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }

    // CSRF protection
    const csrfResult = await withCSRF(request);
    if (csrfResult) {
      return csrfResult;
    }

    // Content length check
    const contentLengthResult = await withContentLength(10 * 1024)(request);
    if (contentLengthResult) {
      return contentLengthResult;
    }

    // Walidacja body
    const bodyResult = await validateBody(profileUpdateSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }
    const { firstName, lastName } = bodyResult;

    // Walidacja - sprawdź czy nie są puste po trim
    if (firstName.trim().length === 0 || lastName.trim().length === 0) {
      return badRequest('Imię i nazwisko nie mogą być puste');
    }

    // Aktualizuj profil
    const updatedUser = await updateUserProfile(authUser.userId, {
      firstName,
      lastName
    });

    return ok({
      message: 'Profil został zaktualizowany',
      user: updatedUser
    });
  });
}
