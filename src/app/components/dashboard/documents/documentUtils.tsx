import React from 'react';

/**
 * Funkcje pomocnicze dla komponentów dokumentów
 */

interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  affairId: string;
  affairTitle: string;
  affairCreatedAt: string;
  path?: string | null;
}

/**
 * Pobiera ikonę dokumentu na podstawie kategorii i typu
 */
export function getDocumentIcon(category: string, type: string): React.ReactNode {
  const iconClass = "w-6 h-6";
  
  if (type.startsWith('image/')) {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    );
  }
  
  if (category === 'Umowy' || category === 'Korespondencja') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="M8 15h8" />
      </svg>
    );
  }
  
  if (category === 'Faktury') {
    return (
      <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
      </svg>
    );
  }
  
  return (
    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="13 2 13 9 20 9" />
    </svg>
  );
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
  documents: Document[],
  searchQuery: string,
  selectedCategory: string
): Document[] {
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
export function sortDocuments(documents: Document[], sortBy: string): Document[] {
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

