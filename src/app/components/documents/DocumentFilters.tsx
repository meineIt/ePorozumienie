'use client';

import { DOCUMENT_CATEGORIES } from '@/lib/utils/constants';

interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function DocumentFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
}: DocumentFiltersProps) {
  return (
    <>
      {/* Search and Filters */}
      <div className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200 space-y-3 sm:space-y-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Szukaj dokumentów..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm sm:text-base border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full sm:w-auto">
            {DOCUMENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryChange(cat === 'Wszystkie' ? 'all' : cat)}
                className={`px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  (cat === 'Wszystkie' && selectedCategory === 'all') || selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-gray-700 hidden sm:inline">Sortuj:</span>
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 sm:px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors w-full sm:w-auto"
              >
                <option value="newest">Najnowsze</option>
                <option value="oldest">Najstarsze</option>
                <option value="name-asc">Nazwa (A-Z)</option>
                <option value="name-desc">Nazwa (Z-A)</option>
                <option value="size-asc">Rozmiar (rosnąco)</option>
                <option value="size-desc">Rozmiar (malejąco)</option>
              </select>
            </div>
            <div className="flex gap-1 rounded-lg p-1">
              <button
                onClick={() => onViewModeChange('grid')}
                className={`p-1.5 sm:p-2 rounded transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Widok siatki"
              >
                <svg width="18" height="18" className="sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </button>
              <button
                onClick={() => onViewModeChange('list')}
                className={`p-1.5 sm:p-2 rounded transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                aria-label="Widok listy"
              >
                <svg width="18" height="18" className="sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

