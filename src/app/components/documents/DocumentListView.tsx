'use client';

import DocumentRow from './DocumentRow';
import { DocumentWithAffair } from '@/lib/types';

interface DocumentListViewProps {
  documents: DocumentWithAffair[];
  onDocumentClick: (doc: DocumentWithAffair) => void;
}

export default function DocumentListView({ documents, onDocumentClick }: DocumentListViewProps) {
  return (
    <div className="divide-y divide-gray-200">
      {documents.map((doc, index) => (
        <DocumentRow
          key={`${doc.id}-${doc.affairId}-${index}`}
          document={doc}
          onClick={onDocumentClick}
        />
      ))}
    </div>
  );
}

