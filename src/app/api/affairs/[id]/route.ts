import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'ID użytkownika jest wymagane' },
                { status: 400 }
            );
        }

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
        if (affair.creatorId !== userId && affair.involvedUserId !== userId) {
            return NextResponse.json(
                { error: 'Brak uprawnień do przeglądania tej sprawy' },
                { status: 403 }
            );
        }

        return NextResponse.json({ affair }, { status: 200 });
    } catch (error) {
        console.error('Error fetching affair:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas pobierania sprawy' },
            { status: 500 }
        );
    }
}

