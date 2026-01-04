import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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

        let involvedUser = await prisma.user.findUnique({
            where: { email: otherPartyEmail }
        })

        if (!involvedUser) {
            const firstName = otherPartyType === 'person'
            ? otherPartyPerson?.firstName || 'Uzytkownik'
            : otherPartyCompany?.contactPerson?.split(' ')[0] || 'Uzytkownik'

            const lastName = otherPartyType === 'person'
            ? otherPartyPerson?.lastName || 'Nieznany'
            : otherPartyCompany?.contactPerson?.split(' ').slice(1).join(' ') || 'Nieznany'

            const tempPassword = await bcrypt.hash(Math.random().toString(36), 10)

            involvedUser = await prisma.user.create({
                data: {
                    email: otherPartyEmail,
                    firstName,
                    lastName,
                    password: tempPassword
                }
            })
        }

        const filesData = documents && documents.length > 0
            ? JSON.stringify(documents)
            : null

        // Utwórz sprawę
        const affair = await prisma.affair.create({
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

        if (!userId) {
            return NextResponse.json(
                {error: 'ID uzytkownika jest wymagane' }, 
                { status: 400 }
            );
        }

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
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json( { affairs }, { status: 200 });
    } catch (error) {
        console.error('Error fetching affairs:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas pobierania spraw' },
            { status: 500 }
        );
    }
}