import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { sendAffairInviteEmail } from '@/lib/utils/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const {
            title,
            category, 
            description, 
            disputeValue, 
            documents,
            creatorId,
            otherPartyEmail,
            otherPartyType,
            otherPartyPerson,
            otherPartyCompany
        } = body

        // Walidacja
        if (!title || !creatorId || !otherPartyEmail) {
            return NextResponse.json(
            { error: 'Tytuł, ID twórcy i email drugiej strony są wymagane' },
            { status: 400 }
            )
        }

        const involvedUser = await prisma.user.findUnique({
            where: { email: otherPartyEmail }
        })

        const filesData = documents && documents.length > 0
            ? JSON.stringify(documents)
            : null

        let affair
        let inviteToken: string | null = null

        if (involvedUser) {
            // Użytkownik istnieje - przypisz sprawę bezpośrednio
            affair = await prisma.$transaction(async (tx) => {
                const createdAffair = await tx.affair.create({
                    data: {
                        title,
                        category: category || null,
                        description: description || null,
                        affairValue: disputeValue ? parseFloat(disputeValue.toString()) : null,
                        files: filesData,
                        creatorId,
                        involvedUserId: involvedUser.id
                    },
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
                        }
                    }
                })

                // Utwórz rekord uczestnika dla twórcy ze statusem WAITING
                await tx.affairParticipant.create({
                    data: {
                        userId: creatorId,
                        affairId: createdAffair.id,
                        status: 'WAITING'
                    }
                })

                // Utwórz rekord uczestnika dla drugiej strony ze statusem REACTION_NEEDED
                await tx.affairParticipant.create({
                    data: {
                        userId: involvedUser.id,
                        affairId: createdAffair.id,
                        status: 'REACTION_NEEDED'
                    }
                })

                return createdAffair
            })
        } else {
            // Użytkownik nie istnieje - wygeneruj token i wyślij email
            inviteToken = crypto.randomBytes(32).toString('base64url')
            
            affair = await prisma.$transaction(async (tx) => {
                const createdAffair = await tx.affair.create({
                    data: {
                        title,
                        category: category || null,
                        description: description || null,
                        affairValue: disputeValue ? parseFloat(disputeValue.toString()) : null,
                        files: filesData,
                        creatorId,
                        inviteToken,
                        inviteTokenUsed: false
                    },
                    include: {
                        creator: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true
                            }
                        }
                    }
                })

                // Utwórz rekord uczestnika dla twórcy ze statusem WAITING
                await tx.affairParticipant.create({
                    data: {
                        userId: creatorId,
                        affairId: createdAffair.id,
                        status: 'WAITING'
                    }
                })

                return createdAffair
            })

            // Wyślij email z zaproszeniem
            try {
                await sendAffairInviteEmail(otherPartyEmail, title, inviteToken)
            } catch (emailError) {
                console.error('Error sending invite email:', emailError)
                // Nie przerywamy procesu - sprawa została utworzona, email można wysłać później
            }
        }

        return NextResponse.json(
            {
                message: 'Sprawa zostałą utworzona pomyślnie',
                affair: {
                    id: affair.id,
                    title: affair.title,
                    category: affair.category,
                    createdAt: affair.createdAt
                }
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Affair creation error:', error)
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas tworzenia sprawy' },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        const checkEmail = searchParams.get('checkEmail');

        // Endpoint do sprawdzania czy użytkownik istnieje
        if (checkEmail) {
            const user = await prisma.user.findUnique({
                where: { email: checkEmail },
                select: { id: true }
            });

            return NextResponse.json(
                { exists: !!user },
                { status: 200 }
            );
        }

        if (!userId) {
            return NextResponse.json(
                {error: 'ID uzytkownika jest wymagane' }, 
                { status: 400 }
            );
        }

        const statusFilter = searchParams.get('status');

        // Pobierz wszystkie sprawy użytkownika
        const affairs = await prisma.affair.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { involvedUserId: userId}
                ]
            },
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
                        userId: userId
                    },
                    select: {
                        status: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Dodaj status do każdej sprawy i przefiltruj jeśli potrzeba
        const affairsWithStatus = affairs
            .map(affair => {
                const participant = affair.participants[0];
                return {
                    ...affair,
                    status: participant?.status || null,
                    participants: undefined // Usuń z odpowiedzi
                };
            })
            .filter(affair => {
                // Jeśli jest filtr statusu, przefiltruj sprawy
                if (statusFilter) {
                    return affair.status === statusFilter;
                }
                return true;
            });

        return NextResponse.json( { affairs: affairsWithStatus }, { status: 200 });
    } catch (error) {
        console.error('Error fetching affairs:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas pobierania spraw' },
            { status: 500 }
        );
    }
}