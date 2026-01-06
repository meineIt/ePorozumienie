'use client';

import DocumentCard from './DocumentCard';
import { DocumentWithAffair } from '@/lib/types';

interface DocumentGridProps {
  documents: DocumentWithAffair[];
  onDocumentClick: (doc: DocumentWithAffair) => void;
  getDocumentIcon: (category: string, type: string) => React.ReactNode;
}

export default function DocumentGrid({ documents, onDocumentClick, getDocumentIcon }: DocumentGridProps) {
  return (
    <div className="p-3 sm:p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onClick={onDocumentClick}
          getDocumentIcon={getDocumentIcon}
        />
      ))}
    </div>
  );
}

