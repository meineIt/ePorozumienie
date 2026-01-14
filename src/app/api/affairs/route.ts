import { NextRequest, NextResponse } from "next/server";
import { prisma, prismaWithTimeout } from '@/lib/prisma'
import { sendAffairInviteEmail } from '@/lib/utils/email'
import { getAuthUserFromHeaders } from '@/lib/auth/middleware'
import { isValidEmail } from '@/lib/api/validation'
import { requireCSRF } from '@/lib/auth/csrf'
import { sanitizeString, sanitizeText } from '@/lib/utils/sanitize'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
    try {
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

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

        if (!title || !otherPartyEmail) {
            return NextResponse.json(
            { error: 'Tytuł i email drugiej strony są wymagane' },
            { status: 400 }
            )
        }

        // Walidacja typów i długości
        if (typeof title !== 'string' || title.trim().length === 0) {
            return NextResponse.json(
                { error: 'Tytuł musi być niepustym ciągiem znaków' },
                { status: 400 }
            )
        }

        if (title.length > 200) {
            return NextResponse.json(
                { error: 'Tytuł nie może być dłuższy niż 200 znaków' },
                { status: 400 }
            )
        }

        if (typeof otherPartyEmail !== 'string') {
            return NextResponse.json(
                { error: 'Email drugiej strony musi być ciągiem znaków' },
                { status: 400 }
            )
        }

        if (!isValidEmail(otherPartyEmail)) {
            return NextResponse.json(
                { error: 'Nieprawidłowy format email drugiej strony' },
                { status: 400 }
            )
        }

        if (otherPartyEmail.length > 200) {
            return NextResponse.json(
                { error: 'Email nie może być dłuższy niż 200 znaków' },
                { status: 400 }
            )
        }

        if (category && (typeof category !== 'string' || category.length > 100)) {
            return NextResponse.json(
                { error: 'Kategoria nie może być dłuższa niż 100 znaków' },
                { status: 400 }
            )
        }

        if (description && (typeof description !== 'string' || description.length > 5000)) {
            return NextResponse.json(
                { error: 'Opis nie może być dłuższy niż 5000 znaków' },
                { status: 400 }
            )
        }

        if (disputeValue !== undefined && disputeValue !== null) {
            const value = typeof disputeValue === 'string' ? parseFloat(disputeValue) : disputeValue;
            if (isNaN(value) || value < 0 || value > 999999999) {
                return NextResponse.json(
                    { error: 'Wartość sprawy musi być liczbą między 0 a 999999999' },
                    { status: 400 }
                )
            }
        }

        if (documents && !Array.isArray(documents)) {
            return NextResponse.json(
                { error: 'Dokumenty muszą być tablicą' },
                { status: 400 }
            )
        }

        const creatorId = authUser.userId

        const involvedUser = await prismaWithTimeout(async (client) => {
            return client.user.findUnique({
                where: { email: otherPartyEmail }
            });
        }, 30000)

        const filesData = documents && documents.length > 0
            ? JSON.stringify(documents)
            : null

        // Sanityzacja danych przed zapisem
        const sanitizedTitle = sanitizeString(title)
        const sanitizedCategory = category ? sanitizeString(category) : null
        const sanitizedDescription = description ? sanitizeText(description) : null

        let affair
        let inviteToken: string | null = null

        if (involvedUser) {
            affair = await prismaWithTimeout(async (client) => {
                return client.$transaction(async (tx) => {
                const createdAffair = await tx.affair.create({
                    data: {
                        title: sanitizedTitle,
                        category: sanitizedCategory,
                        description: sanitizedDescription,
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
                        description: sanitizedDescription,
                        files: filesData
                    } as any
                })

                await tx.affairParticipant.create({
                    data: {
                        userId: involvedUser.id,
                        affairId: createdAffair.id,
                        status: 'REACTION_NEEDED'
                    }
                })

                return createdAffair
                })
            }, 30000)
        } else {
            inviteToken = crypto.randomBytes(32).toString('base64url')
            
            affair = await prismaWithTimeout(async (client) => {
                return client.$transaction(async (tx) => {
                const createdAffair = await tx.affair.create({
                    data: {
                        title: sanitizedTitle,
                        category: sanitizedCategory,
                        description: sanitizedDescription,
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
                        description: sanitizedDescription,
                        files: filesData
                    } as any
                })

                return createdAffair
                })
            }, 30000)

            try {
                await sendAffairInviteEmail(otherPartyEmail, sanitizedTitle, inviteToken)
            } catch (emailError) {
                console.error('Error sending invite email:', emailError)
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
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

        const { searchParams } = new URL(request.url);
        const statusFilter = searchParams.get('status');

        const affairs = await prismaWithTimeout(async (client) => {
            return client.affair.findMany({
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
        }, 30000);

        const affairsWithStatus = affairs
            .map(affair => {
                const participant = affair.participants[0];
                return {
                    ...affair,
                    status: participant?.status || null,
                    participants: undefined
                };
            })
            .filter(affair => {
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