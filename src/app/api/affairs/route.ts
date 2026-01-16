import { NextRequest } from 'next/server';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok } from '@/lib/api/response';
import { validateBody, createAffairSchema } from '@/lib/api/validators';
import { withRateLimit, withCSRF, withContentLength } from '@/lib/api/proxy';
import { createAffair, getUserAffairs } from '@/lib/services/affairCrudServices';
import { CreateAffairRequest } from '@/lib/api/types';

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    const rateLimitConfig = getRateLimit('affairs-create');
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

    const csrfResult = await withCSRF(request);
    if (csrfResult) {
      return csrfResult;
    }

    const contentLengthResult = await withContentLength(1024 * 1024)(request);
    if (contentLengthResult) {
      return contentLengthResult;
    }

    const bodyResult = await validateBody(createAffairSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }

    const { affair } = await createAffair(bodyResult as CreateAffairRequest, authUser.userId);

    return ok({
      message: 'Sprawa zostałą utworzona pomyślnie',
      affair: {
        id: affair.id,
        title: affair.title,
        category: affair.category,
        createdAt: affair.createdAt
      }
    }, 201);
  });
}

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    // Rate limiting
    const rateLimitConfig = getRateLimit('affairs-get');
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

    // Pobierz parametry filtrowania
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || undefined;

    // Pobierz sprawy użytkownika
    const affairs = await getUserAffairs(authUser.userId, statusFilter);

    // Mapuj do formatu odpowiedzi
    const affairsWithStatus = affairs.map(affair => {
      const participant = affair.participants[0];
      return {
        ...affair,
        status: participant?.status || null,
        participants: undefined
      };
    });

    return ok({ affairs: affairsWithStatus });
  });
}
