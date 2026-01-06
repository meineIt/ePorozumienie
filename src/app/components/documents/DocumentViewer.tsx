'use client';

import { DocumentWithAffair } from '@/lib/types';

interface DocumentViewerProps {
  document: DocumentWithAffair | null;
  isOpen: boolean;
  onClose: () => void;
  getDocumentUrl: (path: string) => string;
}

export default function DocumentViewer({ document, isOpen, onClose, getDocumentUrl }: DocumentViewerProps) {
  if (!isOpen || !document || !document.path) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-2xl w-full h-full md:w-11/12 md:h-5/6 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {document.name}
              </h3>
              <p className="text-sm text-gray-500 truncate">{document.affairTitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={getDocumentUrl(document.path)}
              download={document.name}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Pobierz"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="m21 15-9 9-9-9" />
                <path d="M3 11V9a4 4 0 0 1 4-4h14" />
              </svg>
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zamknij"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50 p-4">
          {document.type.startsWith('image/') ? (
            <div className="flex items-center justify-center h-full">
              <img
                src={getDocumentUrl(document.path)}
                alt={document.name}
                className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
              />
            </div>
          ) : document.type === 'application/pdf' || document.name.endsWith('.pdf') ? (
            <iframe
              src={getDocumentUrl(document.path)}
              className="w-full h-full border-0 rounded-lg shadow-lg bg-white"
              title={document.name}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <svg className="w-20 h-20 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p className="mb-2 text-lg font-semibold">Ten typ pliku nie może być wyświetlony w przeglądarce</p>
              <p className="mb-4 text-sm">
                Typ: {document.type || 'nieznany'}
              </p>
              <a
                href={getDocumentUrl(document.path)}
                download={document.name}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="m21 15-9 9-9-9" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                </svg>
                Pobierz plik
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

