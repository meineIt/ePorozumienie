import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'ID użytkownika jest wymagane' },
                { status: 400 }
            );
        }

        // Pobierz wszystkie sprawy użytkownika
        const affairs = await prisma.affair.findMany({
            where: {
                OR: [
                    { creatorId: userId },
                    { involvedUserId: userId }
                ]
            },
            select: {
                id: true,
                title: true,
                files: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Spłaszcz dokumenty z wszystkich spraw
        interface ParsedDocument {
            id?: string;
            name: string;
            size?: number;
            type?: string;
            category?: string;
            path?: string;
        }

        const allDocuments: Array<{
            id: string;
            name: string;
            size: number;
            type: string;
            category: string;
            path: string | null;
            affairId: string;
            affairTitle: string;
            affairCreatedAt: Date;
        }> = [];

        affairs.forEach((affair) => {
            if (affair.files) {
                try {
                    const documents = JSON.parse(affair.files);
                    if (Array.isArray(documents)) {
                        documents.forEach((doc: ParsedDocument) => {
                            allDocuments.push({
                                id: doc.id || Math.random().toString(36).substr(2, 9),
                                name: doc.name,
                                size: doc.size || 0,
                                type: doc.type || 'application/octet-stream',
                                category: doc.category || 'Inne',
                                path: doc.path || null,
                                affairId: affair.id,
                                affairTitle: affair.title,
                                affairCreatedAt: affair.createdAt
                            });
                        });
                    }
                } catch (error) {
                    console.error('Error parsing documents for affair:', affair.id, error);
                }
            }
        });
        return NextResponse.json({ documents: allDocuments }, { status: 200 });

    } catch (error) {
        console.error('Error fetching docs: ', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas pobierania dokumentów' },
            { status: 500 }
        );
    }
}