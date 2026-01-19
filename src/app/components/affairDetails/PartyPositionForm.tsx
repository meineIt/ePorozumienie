'use client';

import { useState, useRef } from 'react';
import { Document } from '@/lib/types';
import { formatFileSize } from '@/lib/utils/format';
import DocumentIcon from '../shared/icons/DocumentIcon';
import { apiUpload, apiRequest, ApiClientError } from '@/lib/api/client';
import { PartyPositionFormProps } from '@/lib/types';
import { DOCUMENT_LIMITS } from '@/lib/utils/constants';
import { ALLOWED_EXTENSIONS } from '@/lib/utils/fileValidation';
import { validateFile } from '@/lib/utils/fileValidation';

export default function PartyPositionForm({ affairId, onSave }: PartyPositionFormProps) {
    const [description, setDescription] = useState('');
    const [documents, setDocuments] = useState<Document[]>([]);
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        // Sprawwdź limit plików
        const currentCount = documents.length;
        const newCount = currentCount + files.length;
        if (newCount > DOCUMENT_LIMITS.PARTY_POSITION) {
            alert(`Mozna dodać maksymalnie ${DOCUMENT_LIMITS.PARTY_POSITION} dokumentów.`)
            return;
        }

        // Sprawdź rozmiar i roszczerzenie pliku
        for (const file of files) {
            const validation = validateFile(file);
            if (!validation.isValid) {
            alert(validation.error);
            return;
            }
        }

        setUploading(true);
        setError(null);
        
        try {
            const uploadFormData = new FormData();
            Array.from(files).forEach(file => {
                uploadFormData.append('files', file);
            });

            // Użyj apiUpload() z automatycznym CSRF
            const data = await apiUpload<{ files: UploadedFile[] }>('/api/upload', uploadFormData);
            
            // Dodaj przesłane pliki do listy dokumentów
            const newDocuments: Document[] = data.files.map((file: UploadedFile) => ({
                id: file.id,
                name: file.name,
                size: file.size,
                type: file.type,
                category: 'Inne',
                path: file.path,
            }));

            setDocuments([...documents, ...newDocuments]);
        } catch (error) {
            console.error('Error uploading files:', error);

            // Wyświetl specyficzny komunikat błędu jeśli to błąd walidacji
            if (error instanceof ApiClientError) {
                setError(error.message);
            } else {
                setError('Wystąpił błąd podczas przesyłania plików. Spróbuj ponownie.');
            }
        } finally {
            setUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleRemoveDocument = (id: string) => {
        setDocuments(documents.filter((doc) => doc.id !== id));
    };

    const handleCategoryChange = (docId: string, category: string) => {
        setDocuments(
            documents.map((doc) =>
                doc.id === docId ? { ...doc, category } : doc
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            await apiRequest(`/api/affairs/${affairId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    description: description || null,
                    documents: documents
                }),
            });

            onSave();
        } catch (error) {
            console.error('Error saving position:', error);
            setError(error instanceof Error ? error.message : 'Wystąpił błąd podczas zapisywania stanowiska');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="mb-6">
                <h2 className="heading-section mb-2" style={{ fontSize: '1.25rem' }}>Dodaj swoje stanowisko</h2>
                <p className="text-gray-600">
                    Przedstaw swoje stanowisko w sprawie. Dodaj opis sytuacji z Twojej perspektywy oraz dokumenty, które mogą być pomocne.
                    <span className="block mt-2 text-sm text-blue-600 font-medium">
                        Limit dokumentów: maksymalnie {DOCUMENT_LIMITS.PARTY_POSITION}
                    </span>
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Opis sprawy */}
                <div className="mb-6">
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent resize-none"
                        placeholder="Opisz sytuację z Twojej perspektywy..."
                    />
                </div>

                {/* Upload dokumentów */}
                <div className="mb-6">
                    <div className="flex items-center mb-4">
                        <h3 className="text-lg font-semibold text-blue-700" style={{ fontSize: '1.5rem' }}>Dokumenty</h3>
                    </div>

                    {/* Dropzone */}
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
                            uploading 
                                ? 'border-[#0A2463] bg-[#0A2463]/10 cursor-wait' 
                                : 'border-gray-300 cursor-pointer hover:border-[#0A2463] hover:bg-[#0A2463]/10'
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
                                <div className="w-12 h-12 border-4 border-[#0A2463] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontSize: '1.5rem' }}>Przesyłanie plików...</h4>
                                <p className="text-gray-500 mb-4">Proszę czekać</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontSize: '1.5rem' }}>Upuść pliki tutaj</h4>
                                    <p className="text-gray-500 mb-4">
                                        Limit: {DOCUMENT_LIMITS.AFFAIR_CREATION} dokumenty <br />
                                        Dozwolone formaty: {ALLOWED_EXTENSIONS.join(', ').toUpperCase()}
                                    </p>
                                <button
                                    type="button"
                                    className="px-6 py-2 border-2 border-[#0A2463]/30 text-blue-700 rounded-full font-semibold hover:bg-[#0A2463]/10 transition-colors"
                                >
                                    Wybierz pliki
                                </button>
                            </>
                        )}
                    </div>

                    {/* Lista dokumentów */}
                    {documents.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-10 h-10 bg-[#0A2463] rounded flex items-center justify-center text-white mr-4">
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
                                        type="button"
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
                    )}
                </div>

                {/* Błąd */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}

                {/* Przyciski */}
                <div className="flex justify-end gap-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-lg hover:-translate-y-0.5 text-white rounded-full font-semibold transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Zapisywanie...
                            </>
                        ) : (
                            <>
                                Zapisz stanowisko
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
