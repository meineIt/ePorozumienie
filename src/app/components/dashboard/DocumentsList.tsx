'use client';

import { useState, useEffect, useMemo } from 'react';
import DocumentFilters from '../documents/DocumentFilters';
import DocumentGrid from '../documents/DocumentGrid';
import DocumentListView from '../documents/DocumentListView';
import DocumentViewer from '../documents/DocumentViewer';
import { getDocumentUrl, filterDocuments, sortDocuments } from '../documents/documentUtils';
import { DocumentWithAffair } from '@/lib/types';

interface DocumentsListProps {
  userId: string;
}

export default function DocumentsList({ userId }: DocumentsListProps) {
  const [documents, setDocuments] = useState<DocumentWithAffair[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithAffair | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/documents`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setDocuments(data.documents || []);
        } else if (response.status === 401) {
          window.location.href = '/login';
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filtrowanie i sortowanie dokumentów
  const filteredAndSortedDocuments = useMemo(() => {
    const filtered = filterDocuments(documents, searchQuery, selectedCategory);
    return sortDocuments(filtered, sortBy);
  }, [documents, searchQuery, selectedCategory, sortBy]);

  const handleDocumentClick = (doc: DocumentWithAffair) => {
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
    <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - zgodny ze stylem innych stron dashboardu */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            Dokumenty
          </h1>
        </div>
        
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
        />

        {/* Documents Grid/List */}
        {filteredAndSortedDocuments.length === 0 ? (
          <div className="p-6 sm:p-12 text-center">
            <p className="text-gray-500">
              {searchQuery || selectedCategory !== 'all'
                ? 'Nie znaleziono dokumentów'
                : 'Tutaj będą wyświetlane dokumenty, które załączysz do spraw.'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <DocumentGrid
            documents={filteredAndSortedDocuments}
            onDocumentClick={handleDocumentClick}
          />
        ) : (
          <DocumentListView
            documents={filteredAndSortedDocuments}
            onDocumentClick={handleDocumentClick}
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
