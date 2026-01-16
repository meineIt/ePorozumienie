'use client';

import DocumentCard from './DocumentCard';
import { DocumentGridProps } from '@/lib/types';

export default function DocumentGrid({ documents, onDocumentClick }: DocumentGridProps) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {documents.map((doc, index) => (
        <DocumentCard
          key={`${doc.id}-${doc.affairId}-${index}`}
          document={doc}
          onClick={onDocumentClick}
        />
      ))}
    </div>
  );
}

