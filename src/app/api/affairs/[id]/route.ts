import { NextRequest } from 'next/server';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { getRateLimit } from '@/lib/auth/rateLimitConfig';
import { withErrorHandling, ok, notFound, forbidden } from '@/lib/api/response';
import { validateBody, updateAffairStatusSchema, updatePartyPositionSchema } from '@/lib/api/validators';
import { withRateLimit, withCSRF, withContentLength } from '@/lib/api/proxy';
import { getAffairById } from '@/lib/services/affairCrudServices';
import { updateAffairStatus } from '@/lib/services/affairParticipantServices';
import { updatePartyPosition } from '@/lib/services/affairPositionServices';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    const rateLimitConfig = getRateLimit('affair-get');
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

    const { id } = await params;

    const affair = await getAffairById(id, authUser.userId);

    if (!affair) {
      return notFound('Sprawa nie została znaleziona');
    }

    // Filtruj uczestników - pokaż stanowiska tylko jeśli obie strony je mają
    const creatorParticipant = affair.participants.find(p => p.userId === affair.creatorId);
    const involvedParticipant = affair.involvedUserId
      ? affair.participants.find(p => p.userId === affair.involvedUserId)
      : null;

    const creatorHasPosition = creatorParticipant && (creatorParticipant.description || creatorParticipant.files);
    const involvedHasPosition = involvedParticipant && (involvedParticipant.description || involvedParticipant.files);
    const bothHavePositions = creatorHasPosition && involvedHasPosition;

    const filteredParticipants = affair.participants.map(participant => {
      const isCurrentUser = participant.userId === authUser.userId;

      if (isCurrentUser) {
        return participant;
      }

      if (bothHavePositions) {
        return participant;
      }

      return {
        ...participant,
        description: null,
        files: null
      };
    });

    const currentUserParticipant = filteredParticipants.find(p => p.userId === authUser.userId);
    const affairWithStatus = {
      ...affair,
      status: currentUserParticipant?.status || null,
      participants: filteredParticipants
    };

    return ok({ affair: affairWithStatus });
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    const rateLimitConfig = getRateLimit('affairs-modify');
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

    const contentLengthResult = await withContentLength(10 * 1024)(request);
    if (contentLengthResult) {
      return contentLengthResult;
    }

    const { id } = await params;

    const bodyResult = await validateBody(updateAffairStatusSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }
    const { status } = bodyResult;

    try {
      await updateAffairStatus(id, authUser.userId, status);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('nie została znaleziona')) {
          return notFound(error.message);
        }
        if (error.message.includes('Brak uprawnień')) {
          return forbidden(error.message);
        }
      }
      throw error;
    }

    return ok({ message: 'Status został zaktualizowany pomyślnie' });
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withErrorHandling(async () => {
    const authUser = getAuthUserFromHeaders(request);

    const rateLimitConfig = getRateLimit('affairs-modify');
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

    const { id } = await params;

    const bodyResult = await validateBody(updatePartyPositionSchema, request);
    if (bodyResult instanceof Response) {
      return bodyResult;
    }

    try {
      await updatePartyPosition(id, authUser.userId, bodyResult);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('nie została znaleziona')) {
          return notFound(error.message);
        }
        if (error.message.includes('Brak uprawnień') || error.message.includes('Nie jesteś uczestnikiem')) {
          return forbidden(error.message);
        }
      }
      throw error;
    }

    return ok({ message: 'Stanowisko zostało zapisane pomyślnie' });
  });
}
