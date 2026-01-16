import { NextRequest } from 'next/server';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok } from '@/lib/api/response';
import { withRateLimit } from '@/lib/api/proxy';
import { getUserDocuments } from '@/lib/services/documentService';

export async function GET(request: NextRequest) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    // Rate limiting
    const rateLimitConfig = getRateLimit('documents-get');
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

    // Pobierz dokumenty użytkownika
    const documents = await getUserDocuments(authUser.userId);

    return ok({ documents });
  });
}
