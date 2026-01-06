import { NextRequest, NextResponse } from "next/server";
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        const { path } = await params;
        const filePath = path.join('/');
        
        // Zabezpieczenie przed path traversal
        if (filePath.includes('..') || filePath.includes('/')) {
            return NextResponse.json(
                { error: 'Nieprawidłowa ścieżka' },
                { status: 400 }
            );
        }

        const fullPath = join(process.cwd(), 'public', 'uploads', filePath);
        
        const fileBuffer = await readFile(fullPath);
        
        // Określ content-type na podstawie rozszerzenia
        const extension = filePath.split('.').pop()?.toLowerCase();
        const contentType = getContentType(extension || '');

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filePath.split('/').pop()}"`,
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