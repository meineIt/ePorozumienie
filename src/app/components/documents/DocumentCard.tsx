'use client';

import { formatFileSize, formatDate, getFileExtension } from '@/lib/utils/format';
import { getCategoryColor } from '@/lib/utils/constants';
import { DocumentWithAffair } from '@/lib/types';

interface DocumentCardProps {
  document: DocumentWithAffair;
  onClick: (doc: DocumentWithAffair) => void;
  getDocumentIcon: (category: string, type: string) => React.ReactNode;
}

export default function DocumentCard({ document, onClick, getDocumentIcon }: DocumentCardProps) {
  return (
    <div
      onClick={() => onClick(document)}
      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="p-4 bg-gray-50 border-b border-gray-200 relative">
        <div className={`w-12 h-12 rounded-lg ${getCategoryColor(document.category)} flex items-center justify-center mb-2`}>
          {getDocumentIcon(document.category, document.type)}
        </div>
        <div className="absolute top-4 right-4 px-2 py-1 bg-white rounded text-xs font-semibold text-gray-700">
          {getFileExtension(document.name)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-2" title={document.name}>
          {document.name}
        </h3>
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex items-center gap-1">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="4 20 10 14 14 18 20 12" />
              <rect width="20" height="16" x="2" y="4" rx="2" />
            </svg>
            {formatFileSize(document.size)}
          </div>
          <div className="flex items-center gap-1">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            {formatDate(document.affairCreatedAt)}
          </div>
          <div className="flex items-center gap-1 pt-1 border-t border-gray-200">
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect width="8" height="4" x="8" y="2" rx="1" />
            </svg>
            <span className="truncate">{document.affairTitle}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

