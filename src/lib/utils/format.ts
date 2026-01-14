/**
 * Formatuje datę do formatu polskiego
 * @param dateString - String z datą w formacie ISO
 * @param options - Opcje formatowania (includeYear - czy zawierać rok)
 * @returns Sformatowana data np. "15 sty 2024" lub "15 sty"
 */
export function formatDate(dateString: string | null | undefined, options?: { includeYear?: boolean }): string {
  if (!dateString) {
    return 'Brak daty';
  }
  
  const date = new Date(dateString);
  
  // Sprawdź czy data jest prawidłowa
  if (isNaN(date.getTime())) {
    return 'Brak daty';
  }
  
  const day = date.getDate();
  const month = date.toLocaleDateString('pl-PL', { month: 'short' });
  
  if (options?.includeYear !== false) {
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }
  
  return `${day} ${month}`;
}

/**
 * Formatuje rozmiar pliku w bajtach do czytelnego formatu
 * @param bytes - Rozmiar w bajtach
 * @returns Sformatowany rozmiar np. "1.5 MB", "250 KB", "512 B"
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

/**
 * Pobiera rozszerzenie pliku z nazwy
 * @param filename - Nazwa pliku
 * @returns Rozszerzenie w formacie uppercase np. "PDF", "JPG"
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || 'FILE';
}

