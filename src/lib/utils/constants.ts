/**
 * Kategorie dokumentów dostępne w systemie
 */
export const DOCUMENT_CATEGORIES = ['Wszystkie', 'Umowy', 'Faktury', 'Zdjęcia', 'Inne'] as const;

export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number];

/**
 * Limity długości tokenów - ochrona przed atakami DoS
 */
export const TOKEN_LENGTH_LIMITS = {
  JWT: 2048, // Standardowy limit dla JWT tokenów
  INVITE_TOKEN: 256, // inviteToken jest base64url z 32 bajtów (~43 znaki), limit dla bezpieczeństwa
  CSRF_TOKEN: 128, // CSRF token to hex hash (64 znaki), limit dla bezpieczeństwa
} as const;

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

export const DOCUMENT_LIMITS = {
  AFFAIR_CREATION: 3,
  PARTY_POSITION: 3,
} as const;