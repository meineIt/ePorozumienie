'use client';

import DocumentRow from './DocumentRow';

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

interface DocumentListViewProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
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

