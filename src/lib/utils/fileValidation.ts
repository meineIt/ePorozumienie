/**
 * Walidacja plików przy uploadzie
 */

// Dozwolone typy MIME
const ALLOWED_MIME_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
];

// Dozwolone rozszerzenia
const ALLOWED_EXTENSIONS = [
    'pdf',
    'jpg',
    'jpeg',
    'png',
];

// Maksymalny rozmiar pliku: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Maksymalna liczba plików na request
const MAX_FILES = 6;

export interface FileValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Sprawdza czy typ MIME jest dozwolony
 */
export function isValidMimeType(mimeType: string): boolean {
    return ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase());
}

/**
 * Sprawdza czy rozszerzenie jest dozwolone
 */
export function isValidExtension(filename: string): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (!extension) return false;
    return ALLOWED_EXTENSIONS.includes(extension);
}

/**
 * Waliduje plik przed uploadem
 */
export function validateFile(file: File): FileValidationResult {
    // Sprawdź rozmiar
    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: `Plik "${file.name}" jest zbyt duży. Maksymalny rozmiar: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    if (file.size === 0) {
        return {
            isValid: false,
            error: `Plik "${file.name}" jest pusty`,
        };
    }

    // Sprawdź rozszerzenie
    if (!isValidExtension(file.name)) {
        return {
            isValid: false,
            error: `Nieprawidłowy typ pliku "${file.name}". Dozwolone typy: ${ALLOWED_EXTENSIONS.join(', ')}`,
        };
    }

    // Sprawdź typ MIME (jeśli dostępny)
    if (file.type && !isValidMimeType(file.type)) {
        return {
            isValid: false,
            error: `Nieprawidłowy typ MIME dla pliku "${file.name}"`,
        };
    }

    return { isValid: true };
}

/**
 * Sprawdza magic bytes (pierwsze bajty pliku) aby zweryfikować rzeczywisty typ
 * To dodatkowa warstwa bezpieczeństwa przed fałszywymi rozszerzeniami
 */
export async function validateFileMagicBytes(buffer: Buffer, expectedExtension: string): Promise<boolean> {
    const extension = expectedExtension.toLowerCase();
    
    // Sprawdź magic bytes dla różnych typów plików
    if (extension === 'pdf') {
        // PDF zaczyna się od %PDF
        return buffer.slice(0, 4).toString() === '%PDF';
    }
    
    if (extension === 'jpg' || extension === 'jpeg') {
        // JPEG zaczyna się od FF D8 FF
        const header = buffer.slice(0, 3);
        return header[0] === 0xFF && header[1] === 0xD8 && header[2] === 0xFF;
    }
    
    if (extension === 'png') {
        // PNG zaczyna się od 89 50 4E 47
        const header = buffer.slice(0, 4);
        return header[0] === 0x89 && header[1] === 0x50 && header[2] === 0x4E && header[3] === 0x47;
    }
    return true;
}

export { MAX_FILE_SIZE, MAX_FILES, ALLOWED_EXTENSIONS, ALLOWED_MIME_TYPES };


