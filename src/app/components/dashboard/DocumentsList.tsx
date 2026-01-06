'use client';

import { useState, useEffect, useMemo } from 'react';
import DocumentFilters from '../documents/DocumentFilters';
import DocumentGrid from '../documents/DocumentGrid';
import DocumentListView from '../documents/DocumentListView';
import DocumentViewer from '../documents/DocumentViewer';
import { getDocumentIcon, getDocumentUrl, filterDocuments, sortDocuments } from '../documents/documentUtils';

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

interface DocumentsListProps {
  userId: string;
}

export default function DocumentsList({ userId }: DocumentsListProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`/api/documents?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchDocuments();
    }
  }, [userId]);

  // Filtrowanie i sortowanie dokumentów
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = filterDocuments(documents, searchQuery, selectedCategory);
    return sortDocuments(filtered, sortBy);
  }, [documents, searchQuery, selectedCategory, sortBy]);

  const handleDocumentClick = (doc: Document) => {
    if (doc.path) {
      setSelectedDocument(doc);
      setIsViewerOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-gray-600">Ładowanie dokumentów...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="w-full max-w-7xl mx-auto ml-[230px] p-6">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

        <DocumentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          // documentCount={filteredAndSortedDocuments.length}
        />

        {/* Documents Grid/List */}
        {filteredAndSortedDocuments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all'
                ? 'Nie znaleziono dokumentów'
                : 'Brak dokumentów. Dodaj dokumenty do spraw!'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <DocumentGrid
            documents={filteredAndSortedDocuments}
            onDocumentClick={handleDocumentClick}
            getDocumentIcon={getDocumentIcon}
          />
        ) : (
          <DocumentListView
            documents={filteredAndSortedDocuments}
            onDocumentClick={handleDocumentClick}
            getDocumentIcon={getDocumentIcon}
          />
        )}
        </div>

        <DocumentViewer
          document={selectedDocument}
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          getDocumentUrl={getDocumentUrl}
        />
      </div>
    </div>
  );
}
