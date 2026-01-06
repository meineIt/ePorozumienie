'use client';

import { formatFileSize, formatDate, getFileExtension } from '@/lib/utils/format';
import { getCategoryColor } from '@/lib/utils/constants';
import { DocumentWithAffair } from '@/lib/types';

interface DocumentRowProps {
  document: DocumentWithAffair;
  onClick: (doc: DocumentWithAffair) => void;
  getDocumentIcon: (category: string, type: string) => React.ReactNode;
}

export default function DocumentRow({ document, onClick, getDocumentIcon }: DocumentRowProps) {
  return (
    <div
      onClick={() => onClick(document)}
      className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors flex items-center gap-2 sm:gap-4 cursor-pointer"
    >
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${getCategoryColor(document.category)} flex items-center justify-center shrink-0`}>
        {getDocumentIcon(document.category, document.type)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 truncate">{document.name}</h3>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {formatDate(document.affairCreatedAt)}
          </span>
          <span className="flex items-center gap-1">
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="4 20 10 14 14 18 20 12" />
              <rect width="20" height="16" x="2" y="4" rx="2" />
            </svg>
            {formatFileSize(document.size)}
          </span>
          <span className="flex items-center gap-1 min-w-0">
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect width="8" height="4" x="8" y="2" rx="1" />
            </svg>
            <span className="truncate">{document.affairTitle}</span>
          </span>
        </div>
      </div>
      <div className="px-2 sm:px-3 py-1 bg-gray-100 rounded text-xs font-semibold text-gray-700 shrink-0">
        {getFileExtension(document.name)}
      </div>
    </div>
  );
}

