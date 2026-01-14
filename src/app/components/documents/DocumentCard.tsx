'use client';

import { formatFileSize, formatDate, getFileExtension } from '@/lib/utils/format';
import { getCategoryColor } from '@/lib/utils/constants';
import { DocumentWithAffair } from '@/lib/types';
import DocumentIcon from '../shared/icons/DocumentIcon';

interface DocumentCardProps {
  document: DocumentWithAffair;
  onClick: (doc: DocumentWithAffair) => void;
}

export default function DocumentCard({ document, onClick }: DocumentCardProps) {
  return (
    <div
      onClick={() => onClick(document)}
      className="border border-gray-200/50 rounded-2xl overflow-hidden hover:shadow-lg active:shadow-md transition-all duration-300 cursor-pointer bg-white touch-target hover:-translate-y-1 active:translate-y-0"
    >
      <div className="p-3 sm:p-4 bg-gradient-to-br from-[#F5F5F7] to-white border-b border-gray-200/50 relative">
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${getCategoryColor(document.category)} flex items-center justify-center mb-2 shadow-sm`}>
          <DocumentIcon category={document.category} type={document.type} className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700 shadow-sm border border-gray-200/50">
          {getFileExtension(document.name)}
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 
          className="font-semibold text-gray-900 truncate mb-2" 
          style={{ fontSize: '0.875rem' }}
          title={document.name}
        >
          {document.name}
        </h3>
        <div className="text-xs text-gray-500 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="4 20 10 14 14 18 20 12" />
              <rect width="20" height="16" x="2" y="4" rx="2" />
            </svg>
            <span>{formatFileSize(document.size)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <line x1="16" x2="16" y1="2" y2="6" />
              <line x1="8" x2="8" y1="2" y2="6" />
              <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            <span>{formatDate(document.affairCreatedAt)}</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1.5 border-t border-gray-200/50">
            <svg width="12" height="12" className="sm:w-3.5 sm:h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

