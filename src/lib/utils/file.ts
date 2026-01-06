/**
 * Funkcje pomocnicze do obsługi plików
 */

/**
 * Pobiera rozszerzenie pliku z nazwy
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Sprawdza czy plik jest obrazem
 */
export function isImageFile(filename: string, mimeType?: string): boolean {
  if (mimeType) {
    return mimeType.startsWith('image/');
  }
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  return imageExtensions.includes(getFileExtension(filename));
}

/**
 * Sprawdza czy plik jest PDF
 */
export function isPdfFile(filename: string, mimeType?: string): boolean {
  if (mimeType) {
    return mimeType === 'application/pdf';
  }
  return getFileExtension(filename) === 'pdf';
}

/**
 * Generuje unikalną nazwę pliku
 */
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 15);
  const extension = getFileExtension(originalName);
  return `${timestamp}_${randomStr}.${extension}`;
}

/**
 * Waliduje rozmiar pliku
 */
export function validateFileSize(size: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return size <= maxSizeInBytes;
}

/**
 * Formatuje rozmiar pliku do czytelnej postaci
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

