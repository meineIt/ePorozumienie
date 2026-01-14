import { NextRequest, NextResponse } from "next/server";
import { prisma, prismaWithTimeout } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { requireCSRF } from '@/lib/auth/csrf';
import { analyzeAffairPositions, bothPartiesHavePositions } from '@/lib/ai/analyzer';
import { rateLimit } from '@/lib/auth/rateLimit';
import { sanitizeText } from '@/lib/utils/sanitize';

// Rate limiting dla GET: 60 zapytań na 1 minutę na użytkownika
const affairsGetRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minuta
  uniqueTokenPerInterval: 500,
});

// Rate limiting dla PUT/PATCH: 20 zapytań na 1 minutę na użytkownika
const affairsModifyRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minuta
  uniqueTokenPerInterval: 500,
});

type AffairWithDetails = Prisma.AffairGetPayload<{
    select: {
      id: true;
      title: true;
      category: true;
      description: true;
      affairCreatedAt: true;
      affairValue: true;
      files: true;
      createdAt: true;
      updatedAt: true;
      creatorId: true;
      involvedUserId: true;
      inviteToken: true;
      inviteTokenUsed: true;
      aiAnalysis: true;
      aiAnalysisGeneratedAt: true;
      creator: {
        select: {
          id: true;
          email: true;
          firstName: true;
          lastName: true;
        };
      };
      involvedUser: {
        select: {
          id: true;
          email: true;
          firstName: true;
          lastName: true;
        };
      };
      participants: {
        select: {
          id: true;
          userId: true;
          status: true;
          description: true;
          files: true;
          user: {
            select: {
              id: true;
              firstName: true;
              lastName: true;
              email: true;
            };
          };
        };
      };
    };
  }>;

type AffairWithParticipants = Prisma.AffairGetPayload<{
    include: {
        participants: {
            select: {
                userId: true;
                description: true;
                files: true;
            };
        };
    };
}>;

interface PatchAffairBody {
    status: 'REACTION_NEEDED' | 'WAITING' | 'DONE';
}

interface PutAffairBody {
    description?: string;
    documents?: Array<{
        id: string;
        name: string;
        size: number;
        type: string;
        category: string;
        path?: string | null;
    }>;
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

        // Rate limiting
        try {
            await affairsGetRateLimit.check(60, authUser.userId, request);
        } catch {
            return NextResponse.json(
                { error: 'Zbyt wiele zapytań. Spróbuj ponownie za chwilę.' },
                { status: 429 }
            );
        }

        const { id } = await params;

        const affair = await prismaWithTimeout(async (client) => {
            return client.affair.findUnique({
                where: { id },
                select: {
                    id: true,
                    title: true,
                    category: true,
                    description: true,
                    affairCreatedAt: true,
                    affairValue: true,
                    files: true,
                    createdAt: true,
                    updatedAt: true,
                    creatorId: true,
                    involvedUserId: true,
                    inviteToken: true,
                    inviteTokenUsed: true,
                    aiAnalysis: true,
                    aiAnalysisGeneratedAt: true,
                    settlementProposalStatus: true,
                    settlementAcceptedBy: true,
                    settlementModificationRequests: true,
                    creator: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    involvedUser: {
                        select: {
                            id: true,
                            email: true,
                            firstName: true,
                            lastName: true
                        }
                    },
                    participants: {
                        select: {
                            id: true,
                            userId: true,
                            status: true,
                            description: true,
                            files: true,
                            settlementAcceptedAt: true,
                            settlementModificationRequestedAt: true,
                            user: {
                                select: {
                                    id: true,
                                    firstName: true,
                                    lastName: true,
                                    email: true
                                }
                            }
                        } as any
                    }
                } as any
            });
        }, 30000) as AffairWithDetails | null;

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

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

        return NextResponse.json({ affair: affairWithStatus }, { status: 200 });
    } catch (error) {
        console.error('Error fetching affair:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas pobierania sprawy' },
            { status: 500 }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

        // Rate limiting
        try {
            await affairsModifyRateLimit.check(20, authUser.userId, request);
        } catch {
            return NextResponse.json(
                { error: 'Zbyt wiele prób aktualizacji. Spróbuj ponownie za chwilę.' },
                { status: 429 }
            );
        }

        // CSRF protection
        const csrfError = requireCSRF(request)
        if (csrfError) {
            return csrfError
        }

        const contentLength = request.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > 10 * 1024) {
            return NextResponse.json(
                { error: 'Request zbyt duży' },
                { status: 413 }
            )
        }

        const { id } = await params;
        const body = await request.json() as PatchAffairBody;
        const { status } = body;

        if (!status || !['REACTION_NEEDED', 'WAITING', 'DONE'].includes(status)) {
            return NextResponse.json(
                { error: 'Nieprawidłowy status. Dozwolone wartości: REACTION_NEEDED, WAITING, DONE' },
                { status: 400 }
            );
        }

        const affair = await prismaWithTimeout(async (client) => {
            return client.affair.findUnique({
                where: { id },
                select: {
                    id: true,
                    creatorId: true,
                    involvedUserId: true
                }
            });
        }, 30000);

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

        // Walidacja uprawnień: sprawdź czy użytkownik jest uczestnikiem sprawy
        // Użytkownik może aktualizować tylko swój własny status uczestnika
        const participant = await prismaWithTimeout(async (client) => {
            return client.affairParticipant.findUnique({
                where: {
                    userId_affairId: {
                        userId: authUser.userId,
                        affairId: id
                    }
                }
            });
        }, 30000);

        if (!participant) {
            // Jeśli użytkownik nie jest jeszcze uczestnikiem, sprawdź czy ma uprawnienia do sprawy
            // (jest twórcą lub zaangażowanym użytkownikiem)
            if (affair.creatorId !== authUser.userId && affair.involvedUserId !== authUser.userId) {
                return NextResponse.json(
                    { error: 'Brak uprawnień: nie jesteś uczestnikiem tej sprawy' },
                    { status: 403 }
                );
            }
        }

        await prismaWithTimeout(async (client) => {
            return client.$transaction(async (tx) => {
                // Aktualizuj lub utwórz uczestnika - użytkownik może modyfikować tylko swój własny status
                if (participant) {
                    await tx.affairParticipant.update({
                        where: { id: participant.id },
                        data: { status }
                    });
                } else {
                    await tx.affairParticipant.create({
                        data: {
                            userId: authUser.userId,
                            affairId: id,
                            status
                        }
                    });
                }

            if (status === 'WAITING') {
                const otherUserId = affair.creatorId === authUser.userId 
                    ? affair.involvedUserId 
                    : affair.creatorId;

                if (otherUserId) {
                    const otherParticipant = await tx.affairParticipant.findUnique({
                        where: {
                            userId_affairId: {
                                userId: otherUserId,
                                affairId: id
                            }
                        }
                    });

                    if (otherParticipant) {
                        await tx.affairParticipant.update({
                            where: { id: otherParticipant.id },
                            data: { status: 'REACTION_NEEDED' }
                        });
                    } else {
                        await tx.affairParticipant.create({
                            data: {
                                userId: otherUserId,
                                affairId: id,
                                status: 'REACTION_NEEDED'
                            }
                        });
                    }
                }
            }
            })
        }, 30000);

        return NextResponse.json(
            { message: 'Status został zaktualizowany pomyślnie' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating affair status:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas aktualizacji statusu' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

        // Rate limiting
        try {
            await affairsModifyRateLimit.check(20, authUser.userId, request);
        } catch {
            return NextResponse.json(
                { error: 'Zbyt wiele prób aktualizacji. Spróbuj ponownie za chwilę.' },
                { status: 429 }
            );
        }

        // CSRF protection
        const csrfError = requireCSRF(request)
        if (csrfError) {
            return csrfError
        }

        const contentLength = request.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > 1024 * 1024) {
            return NextResponse.json(
                { error: 'Request zbyt duży' },
                { status: 413 }
            )
        }

        const { id } = await params;
        const body = await request.json() as PutAffairBody;
        const { description, documents } = body;

        // Walidacja typów i długości
        if (description !== undefined && description !== null) {
            if (typeof description !== 'string') {
                return NextResponse.json(
                    { error: 'Opis musi być ciągiem znaków' },
                    { status: 400 }
                );
            }
            if (description.length > 5000) {
                return NextResponse.json(
                    { error: 'Opis nie może być dłuższy niż 5000 znaków' },
                    { status: 400 }
                );
            }
        }

        if (documents !== undefined && documents !== null) {
            if (!Array.isArray(documents)) {
                return NextResponse.json(
                    { error: 'Dokumenty muszą być tablicą' },
                    { status: 400 }
                );
            }
            if (documents.length > 50) {
                return NextResponse.json(
                    { error: 'Maksymalna liczba dokumentów to 50' },
                    { status: 400 }
                );
            }
            // Walidacja każdego dokumentu
            for (const doc of documents) {
                if (!doc || typeof doc !== 'object') {
                    return NextResponse.json(
                        { error: 'Nieprawidłowy format dokumentu' },
                        { status: 400 }
                    );
                }
                if (doc.id && typeof doc.id !== 'string') {
                    return NextResponse.json(
                        { error: 'ID dokumentu musi być ciągiem znaków' },
                        { status: 400 }
                    );
                }
                if (doc.name && (typeof doc.name !== 'string' || doc.name.length > 255)) {
                    return NextResponse.json(
                        { error: 'Nazwa dokumentu nie może być dłuższa niż 255 znaków' },
                        { status: 400 }
                    );
                }
            }
        }

        const affair = await prismaWithTimeout(async (client) => {
            return client.affair.findUnique({
                where: { id },
                select: {
                    id: true,
                    creatorId: true,
                    involvedUserId: true
                }
            });
        }, 30000);

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

        // Walidacja uprawnień
        if (affair.creatorId !== authUser.userId && affair.involvedUserId !== authUser.userId) {
            return NextResponse.json(
                { error: 'Brak uprawnień do aktualizacji tej sprawy' },
                { status: 403 }
            );
        }

        const participant = await prismaWithTimeout(async (client) => {
            return client.affairParticipant.findUnique({
                where: {
                    userId_affairId: {
                        userId: authUser.userId,
                        affairId: id
                    }
                }
            });
        }, 30000);

        if (!participant) {
            return NextResponse.json(
                { error: 'Nie jesteś uczestnikiem tej sprawy' },
                { status: 403 }
            );
        }

        const filesData = documents && documents.length > 0
            ? JSON.stringify(documents)
            : null

        // Sanityzacja description przed zapisem
        const sanitizedDescription = description ? sanitizeText(description) : null

        const otherUserId = affair.creatorId === authUser.userId 
            ? affair.involvedUserId 
            : affair.creatorId;

        await prismaWithTimeout(async (client) => {
            return client.$transaction(async (tx) => {
                await tx.affairParticipant.update({
                    where: { id: participant.id },
                    data: {
                        description: sanitizedDescription,
                        files: filesData
                    }
                });

                let otherParticipant = null;
                if (otherUserId) {
                    otherParticipant = await tx.affairParticipant.findUnique({
                        where: {
                            userId_affairId: {
                                userId: otherUserId,
                                affairId: id
                            }
                        }
                    });
                }

                const otherHasPosition = otherParticipant && 
                    (otherParticipant.description || otherParticipant.files);

                if (otherHasPosition) {
                    await tx.affair.update({
                        where: { id },
                        data: {
                            settlementProposalStatus: 'awaiting-both'
                        } as any
                    });
                } else {
                    await tx.affairParticipant.update({
                        where: { id: participant.id },
                        data: { status: 'WAITING' }
                    });

                    if (otherUserId) {
                        if (otherParticipant) {
                            await tx.affairParticipant.update({
                                where: { id: otherParticipant.id },
                                data: { status: 'REACTION_NEEDED' }
                            });
                        } else {
                            await tx.affairParticipant.create({
                                data: {
                                    userId: otherUserId,
                                    affairId: id,
                                    status: 'REACTION_NEEDED'
                                }
                            });
                        }
                    }
                }
            });
        }, 30000);

        (async () => {
            try {
                const affairWithParticipants = await prismaWithTimeout(async (client) => {
                    return client.affair.findUnique({
                        where: { id },
                        include: {
                            participants: {
                                select: {
                                    userId: true,
                                    description: true,
                                    files: true,
                                },
                            },
                        },
                    });
                }, 30000) as AffairWithParticipants | null;

                if (affairWithParticipants && bothPartiesHavePositions(affairWithParticipants)) {
                    if (!affairWithParticipants.aiAnalysis) {
                        const analysis = await analyzeAffairPositions(id);
                        
                        await prismaWithTimeout(async (client) => {
                            return client.affair.update({
                                where: { id },
                                data: {
                                    aiAnalysis: JSON.stringify(analysis),
                                    aiAnalysisGeneratedAt: new Date(),
                                    settlementProposalStatus: 'awaiting-both'
                                } as any
                            });
                        }, 30000);

                        await prismaWithTimeout(async (client) => {
                            return client.affairParticipant.updateMany({
                                where: { affairId: id },
                                data: { status: 'REACTION_NEEDED' }
                            });
                        }, 30000);
                    }
                }
            } catch (error) {
                console.error('Error generating AI analysis:', error);
            }
        })();

        return NextResponse.json(
            { message: 'Stanowisko zostało zapisane pomyślnie' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating party position:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas zapisywania stanowiska' },
            { status: 500 }
        );
    }
}
