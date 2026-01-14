import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { getAuthUser } from '@/lib/auth/middleware';
import { analyzeAffairPositions, bothPartiesHavePositions } from '@/lib/ai/analyzer';

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
        // Autentykacja
        let authUser
        try {
            authUser = getAuthUser(request)
        } catch {
            return NextResponse.json(
                { error: 'Wymagana autentykacja' },
                { status: 401 }
            )
        }

        const { id } = await params;

        const affair = await prisma.affair.findUnique({
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
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true
                            }
                        }
                    }
                }
            }
        }) as AffairWithDetails | null;

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

        // Dodaj status użytkownika do odpowiedzi
        const participants = affair.participants;
        const currentUserParticipant = participants.find(p => p.userId === authUser.userId);
        const affairWithStatus = {
            ...affair,
            status: currentUserParticipant?.status || null,
            participants: participants // Zwróć pełne dane uczestników
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
        // Autentykacja
        let authUser
        try {
            authUser = getAuthUser(request)
        } catch {
            return NextResponse.json(
                { error: 'Wymagana autentykacja' },
                { status: 401 }
            )
        }

        // Walidacja rozmiaru requestu (max 10KB)
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

        // Sprawdź czy sprawa istnieje i użytkownik ma do niej dostęp
        const affair = await prisma.affair.findUnique({
            where: { id },
            select: {
                id: true,
                creatorId: true,
                involvedUserId: true
            }
        });

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

        // Aktualizuj status użytkownika i ewentualnie drugiej strony
        await prisma.$transaction(async (tx) => {
            // Znajdź lub utwórz rekord uczestnika
            const participant = await tx.affairParticipant.findUnique({
                where: {
                    userId_affairId: {
                        userId: authUser.userId,
                        affairId: id
                    }
                }
            });

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

            // Jeśli użytkownik zmienia status na WAITING, zmień status drugiej strony na REACTION_NEEDED
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
        });

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
        // Autentykacja
        let authUser
        try {
            authUser = getAuthUser(request)
        } catch {
            return NextResponse.json(
                { error: 'Wymagana autentykacja' },
                { status: 401 }
            )
        }

        // Walidacja rozmiaru requestu (max 1MB)
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

        // Sprawdź czy sprawa istnieje i użytkownik ma do niej dostęp
        const affair = await prisma.affair.findUnique({
            where: { id },
            select: {
                id: true,
                creatorId: true,
                involvedUserId: true
            }
        });

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

        // Sprawdź czy użytkownik jest uczestnikiem sprawy
        const participant = await prisma.affairParticipant.findUnique({
            where: {
                userId_affairId: {
                    userId: authUser.userId,
                    affairId: id
                }
            }
        });

        if (!participant) {
            return NextResponse.json(
                { error: 'Nie jesteś uczestnikiem tej sprawy' },
                { status: 403 }
            );
        }

        const filesData = documents && documents.length > 0
            ? JSON.stringify(documents)
            : null

        // Aktualizuj stanowisko uczestnika i zmień statusy
        await prisma.$transaction(async (tx) => {
            // Aktualizuj stanowisko uczestnika
            await tx.affairParticipant.update({
                where: { id: participant.id },
                data: {
                    description: description || null,
                    files: filesData
                }
            });

            // Zmień status użytkownika na WAITING
            await tx.affairParticipant.update({
                where: { id: participant.id },
                data: { status: 'WAITING' }
            });

            // Zmień status drugiej strony na REACTION_NEEDED
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
        });

        // Sprawdź czy obie strony mają stanowiska i automatycznie wywołaj analizę AI w tle
        // Nie czekamy na wynik - analiza wykonuje się asynchronicznie
        (async () => {
            try {
                const affairWithParticipants = await prisma.affair.findUnique({
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
                }) as AffairWithParticipants | null;

                if (affairWithParticipants && bothPartiesHavePositions(affairWithParticipants)) {
                    // Sprawdź czy analiza już istnieje - jeśli tak, nie generuj ponownie
                    if (!affairWithParticipants.aiAnalysis) {
                        const analysis = await analyzeAffairPositions(id);
                        
                        // Zapisz wyniki analizy w bazie
                        await prisma.affair.update({
                            where: { id },
                            data: {
                                aiAnalysis: JSON.stringify(analysis),
                                aiAnalysisGeneratedAt: new Date(),
                            }
                        });
                    }
                }
            } catch (error) {
                // Loguj błąd ale nie przerywaj procesu
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
