import { DocumentWithAffair } from '@/lib/types';
import DocumentIcon from '../shared/icons/DocumentIcon';
import type { ReactNode } from 'react';

/**
 * Funkcje pomocnicze dla komponentów dokumentów
 */

/**
 * Pobiera ikonę dokumentu na podstawie kategorii i typu
 * @deprecated Użyj komponentu DocumentIcon bezpośrednio
 */
export function getDocumentIcon(category: string, type: string): ReactNode {
  return <DocumentIcon category={category} type={type} />;
}

/**
 * Pobiera URL dokumentu z ścieżki
 */
export function getDocumentUrl(path: string): string {
  // Jeśli path zaczyna się od /uploads, użyj API endpoint
  if (path.startsWith('/uploads/')) {
    const fileName = path.replace('/uploads/', '');
    return `/api/files/${fileName}`;
  }
  return path;
}

/**
 * Filtruje dokumenty na podstawie zapytania wyszukiwania i kategorii
 */
export function filterDocuments(
  documents: DocumentWithAffair[],
  searchQuery: string,
  selectedCategory: string
): DocumentWithAffair[] {
  return documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.affairTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}

/**
 * Sortuje dokumenty według wybranego kryterium
 */
export function sortDocuments(documents: DocumentWithAffair[], sortBy: string): DocumentWithAffair[] {
  const sorted = [...documents];
  sorted.sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.affairCreatedAt).getTime() - new Date(a.affairCreatedAt).getTime();
      case 'oldest':
        return new Date(a.affairCreatedAt).getTime() - new Date(b.affairCreatedAt).getTime();
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'size-asc':
        return a.size - b.size;
      case 'size-desc':
        return b.size - a.size;
      default:
        return 0;
    }
  });
  return sorted;
}

