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
      {documents.map((doc) => (
        <DocumentRow
          key={doc.id}
          document={doc}
          onClick={onDocumentClick}
          getDocumentIcon={getDocumentIcon}
        />
      ))}
    </div>
  );
}

