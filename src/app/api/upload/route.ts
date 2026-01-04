import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json(
                { error: 'Brak plików do przesłania' },
                { status: 400 }
            );
        }

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        
        // Utwórz folder uploads jeśli nie istnieje
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const uploadedFiles: Array<{
            id: string;
            name: string;
            size: number;
            type: string;
            path: string;
        }> = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generuj unikalną nazwę pliku
            const timestamp = Date.now();
            const randomStr = Math.random().toString(36).substring(2, 15);
            const originalName = file.name;
            const extension = originalName.split('.').pop();
            const fileName = `${timestamp}_${randomStr}.${extension}`;
            const filePath = join(uploadDir, fileName);

            // Zapisz plik
            await writeFile(filePath, buffer);

            uploadedFiles.push({
                id: Math.random().toString(36).substr(2, 9),
                name: originalName,
                size: file.size,
                type: file.type || 'application/octet-stream',
                path: `/uploads/${fileName}`
            });
        }

        return NextResponse.json(
            { files: uploadedFiles },
            { status: 200 }
        );

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Wystąpił błąd podczas przesyłania plików' },
            { status: 500 }
        );
    }
}