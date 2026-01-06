import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth/middleware'

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
            include: {
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
                    where: {
                        userId: authUser.userId
                    },
                    select: {
                        status: true
                    }
                }
            }
        });

        if (!affair) {
            return NextResponse.json(
                { error: 'Sprawa nie została znaleziona' },
                { status: 404 }
            );
        }

        // Walidacja uprawnień - sprawdzenie czy użytkownik jest zaangażowany w sprawę
        if (affair.creatorId !== authUser.userId && affair.involvedUserId !== authUser.userId) {
            return NextResponse.json(
                { error: 'Brak uprawnień do przeglądania tej sprawy' },
                { status: 403 }
            );
        }

        // Dodaj status użytkownika do odpowiedzi
        const participant = affair.participants[0];
        const affairWithStatus = {
            ...affair,
            status: participant?.status || null,
            participants: undefined // Usuń z odpowiedzi
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
        const body = await request.json();
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

