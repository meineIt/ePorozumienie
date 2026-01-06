'use client';

import DocumentCard from './DocumentCard';

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

interface DocumentGridProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  getDocumentIcon: (category: string, type: string) => React.ReactNode;
}

export default function DocumentGrid({ documents, onDocumentClick, getDocumentIcon }: DocumentGridProps) {
  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

