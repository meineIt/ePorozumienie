'use client';

import { useState, useRef } from 'react';
import { Document, Step2DocumentsProps } from '@/lib/types';
import { formatFileSize } from '@/lib/utils/format';
import DocumentIcon from '../shared/icons/DocumentIcon';
import { apiUpload } from '@/lib/api/client';

export default function Step2Documents({
    formData,
    updateFormData,
    onNext,
    onPrev,
  }: Step2DocumentsProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    interface UploadedFile {
        id: string;
        name: string;
        size: number;
        type: string;
        path: string;
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      setUploading(true);
      
      try {
          const uploadFormData = new FormData();
          Array.from(files).forEach(file => {
              uploadFormData.append('files', file);
          });

          const data = await apiUpload<{ files: UploadedFile[] }>('/api/upload', uploadFormData);
          
          // Dodaj przesłane pliki do formData
          const newDocuments: Document[] = data.files.map((file: UploadedFile) => ({
              id: file.id,
              name: file.name,
              size: file.size,
              type: file.type,
              category: 'Inne',
              path: file.path, // Dodaj ścieżkę do pliku
          }));

          updateFormData({ 
              documents: [...formData.documents, ...newDocuments] 
          });
      } catch {
          alert('Wystąpił błąd podczas przesyłania plików. Spróbuj ponownie.');
      } finally {
          setUploading(false);
          // Reset input
          if (fileInputRef.current) {
              fileInputRef.current.value = '';
          }
      }
    };

    const handleRemoveDocument = (id: string) => {
        updateFormData({
            documents: formData.documents.filter((doc) => doc.id != id)
        });
    };


    const handleCategoryChange = (docId: string, category: string) => {
        updateFormData({
        documents: formData.documents.map((doc) =>
            doc.id === docId ? { ...doc, category } : doc
        ),
        });
    };

    return (
        <div>
    
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-blue-700">Dokumenty związane ze sprawą</h3>
            </div>
    
            <p className="text-gray-600 mb-4">
              Dodaj dokumenty związane ze sprawą, które pomogą w procesie mediacji i wypracowaniu porozumienia.
            </p>
    
            {/* Dropzone */}
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
                uploading 
                  ? 'border-blue-500 bg-blue-50 cursor-wait' 
                  : 'border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Przesyłanie plików...</h4>
                  <p className="text-gray-500 mb-4">Proszę czekać</p>
                </>
              ) : (
                <>
                  <svg className="w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Przeciągnij i upuść pliki tutaj</h4>
                  <p className="text-gray-500 mb-4">lub kliknij, aby wybrać pliki z dysku</p>
                  <button
                    type="button"
                    className="px-6 py-2 border-2 border-blue-300 text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Wybierz pliki
                  </button>
                </>
              )}
            </div>
    
            {/* Lista dokumentów */}
            {formData.documents.length > 0 && (
              <div>    
                <div className="space-y-3">
                  {formData.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white mr-4">
                        <DocumentIcon category={doc.category} type={doc.type} className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{doc.name}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{formatFileSize(doc.size)}</span>
                          <span className="px-2 py-1 bg-gray-200 rounded-full text-xs font-semibold uppercase">
                            {doc.type.split('/')[1] || 'FILE'}
                          </span>
                        </div>
                      </div>
                      <select
                        value={doc.category}
                        onChange={(e) => handleCategoryChange(doc.id, e.target.value)}
                        className="mx-4 px-3 py-1 border-[1.5px] border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#0A2463] focus:ring-0 focus:shadow-[0_0_0_3px_rgba(10,36,99,0.25)]"
                      >
                        <option>Umowy</option>
                        <option>Faktury</option>
                        <option>Zdjęcia</option>
                        <option>Inne</option>
                      </select>
                      <button
                        onClick={() => handleRemoveDocument(doc.id)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
    
          {/* Akcje */}
          <div className="flex justify-between pt-6">
            <button
              type="button"
              onClick={onPrev}
              className="px-6 py-2 border-2 border-blue-300 text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Wróć
            </button>
            <button
              type="button"
              onClick={onNext}
              className="px-6 py-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:-translate-y-0.5 text-white rounded-full font-semibold transition-all duration-300 flex items-center"
            >
              Dalej
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      );
  };