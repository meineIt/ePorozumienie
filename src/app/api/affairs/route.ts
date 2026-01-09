import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import { sendAffairInviteEmail } from '@/lib/utils/email'
import { getAuthUser } from '@/lib/auth/middleware'
import { isValidEmail } from '@/lib/api/validation'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
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

        const body = await request.json()
        const {
            title,
            category, 
            description, 
            disputeValue, 
            documents,
            otherPartyEmail,
            otherPartyType,
            otherPartyPerson,
            otherPartyCompany
        } = body

        // Walidacja
        if (!title || !otherPartyEmail) {
            return NextResponse.json(
            { error: 'Tytuł i email drugiej strony są wymagane' },
            { status: 400 }
            )
        }

        // Walidacja email
        if (!isValidEmail(otherPartyEmail)) {
            return NextResponse.json(
                { error: 'Nieprawidłowy format email drugiej strony' },
                { status: 400 }
            )
        }

        const creatorId = authUser.userId

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
                        status: 'WAITING',
                        description: description || null,
                        files: filesData
                    } as any
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
                        status: 'WAITING',
                        description: description || null,
                        files: filesData
                    } as any
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

        // Usunięto endpoint checkEmail - email enumeration vulnerability
        // Jeśli potrzebujesz sprawdzić czy email istnieje, użyj innego bezpiecznego mechanizmu

        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status');

        // Pobierz wszystkie sprawy użytkownika
        const affairs = await prisma.affair.findMany({
            where: {
                OR: [
                    { creatorId: authUser.userId },
                    { involvedUserId: authUser.userId}
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
                        userId: authUser.userId
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