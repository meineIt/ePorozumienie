import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from 'fs/promises';
import { resolve, normalize } from 'path';
import { getAuthUserFromHeaders } from '@/lib/auth/middleware';
import { prismaWithTimeout } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        // Autentykacja jest obsługiwana przez globalny middleware
        const authUser = getAuthUserFromHeaders(request)

        const { path: pathArray } = await params;
        const filePath = pathArray.join('/');
        
        // Zabezpieczenie przed path traversal - normalizuj ścieżkę i sprawdź czy nie wychodzi poza uploads
        const normalizedPath = normalize(filePath);
        if (normalizedPath.includes('..') || normalizedPath.startsWith('/')) {
            return NextResponse.json(
                { error: 'Nieprawidłowa ścieżka' },
                { status: 400 }
            );
        }

        // Resolve pełnej ścieżki
        const uploadsDir = resolve(process.cwd(), 'public', 'uploads');
        const fullPath = resolve(uploadsDir, normalizedPath);

        // Sprawdź czy plik jest w katalogu uploads (zabezpieczenie przed path traversal)
        if (!fullPath.startsWith(uploadsDir)) {
            return NextResponse.json(
                { error: 'Nieprawidłowa ścieżka' },
                { status: 400 }
            );
        }

        // Sprawdź czy plik istnieje i jest plikiem (nie katalogiem)
        try {
            const stats = await stat(fullPath);
            if (!stats.isFile()) {
                return NextResponse.json(
                    { error: 'Nieprawidłowa ścieżka' },
                    { status: 400 }
                );
            }
        } catch {
            return NextResponse.json(
                { error: 'Plik nie został znaleziony' },
                { status: 404 }
            );
        }

        // Sprawdź czy użytkownik ma dostęp do tego pliku
        // Plik musi być powiązany ze sprawą, do której użytkownik ma dostęp
        const fileName = normalizedPath.split('/').pop() || normalizedPath;
        
        // Znajdź sprawy użytkownika
        const userAffairs = await prismaWithTimeout(async (client) => {
            return client.affair.findMany({
                where: {
                    OR: [
                        { creatorId: authUser.userId },
                        { involvedUserId: authUser.userId }
                    ]
                },
                select: {
                    id: true,
                    files: true,
                    participants: {
                        select: {
                            files: true
                        }
                    }
                }
            });
        }, 30000);

        // Sprawdź czy plik jest w dokumentach użytkownika
        let hasAccess = false;
        for (const affair of userAffairs) {
            // Sprawdź pliki z Affair (dla kompatybilności wstecznej)
            if (affair.files) {
                try {
                    const documents = JSON.parse(affair.files);
                    if (Array.isArray(documents)) {
                        const fileInDocuments = documents.some((doc: any) => {
                            const docPath = doc.path || '';
                            return docPath.includes(fileName) || docPath.endsWith(fileName);
                        });
                        if (fileInDocuments) {
                            hasAccess = true;
                            break;
                        }
                    }
                } catch (error) {
                    console.error('Error parsing documents:', error);
                }
            }

            // Sprawdź pliki z AffairParticipant
            for (const participant of affair.participants) {
                if (participant.files) {
                    try {
                        const documents = JSON.parse(participant.files);
                        if (Array.isArray(documents)) {
                            const fileInDocuments = documents.some((doc: any) => {
                                const docPath = doc.path || '';
                                return docPath.includes(fileName) || docPath.endsWith(fileName);
                            });
                            if (fileInDocuments) {
                                hasAccess = true;
                                break;
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing participant documents:', error);
                    }
                }
            }
            if (hasAccess) break;
        }

        if (!hasAccess) {
            return NextResponse.json(
                { error: 'Brak uprawnień do tego pliku' },
                { status: 403 }
            );
        }
        
        const fileBuffer = await readFile(fullPath);
        
        // Określ content-type na podstawie rozszerzenia
        const extension = normalizedPath.split('.').pop()?.toLowerCase();
        const contentType = getContentType(extension || '');

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${fileName}"`,
                'X-Content-Type-Options': 'nosniff',
            },
        });
    } catch (error) {
        console.error('File serving error:', error);
        return NextResponse.json(
            { error: 'Nie można odczytać pliku' },
            { status: 404 }
        );
    }
}

function getContentType(extension: string): string {
    const types: Record<string, string> = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'txt': 'text/plain',
    };
    return types[extension] || 'application/octet-stream';
}