'use client';

import DocumentRow from './DocumentRow';
import { DocumentWithAffair } from '@/lib/types';

interface DocumentListViewProps {
  documents: DocumentWithAffair[];
  onDocumentClick: (doc: DocumentWithAffair) => void;
  getDocumentIcon: (category: string, type: string) => React.ReactNode;
}

export default function DocumentListView({ documents, onDocumentClick, getDocumentIcon }: DocumentListViewProps) {
  return (
    <div className="divide-y divide-gray-200">
      {documents.map((doc, index) => (
        <DocumentRow
          key={`${doc.id}-${doc.affairId}-${index}`}
          document={doc}
          onClick={onDocumentClick}
          getDocumentIcon={getDocumentIcon}
        />
      ))}
    </div>
  );
}

