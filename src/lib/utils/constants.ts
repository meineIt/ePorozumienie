/**
 * Kategorie dokumentów dostępne w systemie
 */
export const DOCUMENT_CATEGORIES = ['Wszystkie', 'Umowy', 'Faktury', 'Zdjęcia', 'Inne'] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];

/**
 * Mapowanie kolorów dla kategorii dokumentów
 */
export const CATEGORY_COLORS: Record<string, string> = {
  'Umowy': 'bg-indigo-100 text-indigo-700',
  'Faktury': 'bg-orange-100 text-orange-700',
  'Zdjęcia': 'bg-teal-100 text-teal-700',
  'Inne': 'bg-gray-100 text-gray-700',
};

/**
 * Pobiera klasę CSS dla kategorii dokumentu
 * @param category - Kategoria dokumentu
 * @returns Klasa CSS dla kategorii
 */
export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS['Inne'];
}

