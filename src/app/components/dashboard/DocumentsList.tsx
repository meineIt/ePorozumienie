'use client';

import { useState, useEffect, useMemo } from 'react';
import DocumentFilters from './documents/DocumentFilters';
import DocumentGrid from './documents/DocumentGrid';
import DocumentListView from './documents/DocumentListView';
import DocumentViewer from './documents/DocumentViewer';
import { getDocumentIcon, getDocumentUrl, filterDocuments, sortDocuments } from './documents/documentUtils';

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
    <div className="w-full max-w-7xl mx-auto mt-20 ml-64 p-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Dokumenty</h2>
          </div>
        </div>

        <DocumentFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          documentCount={filteredAndSortedDocuments.length}
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
  );
}
