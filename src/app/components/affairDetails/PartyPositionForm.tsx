'use client';

import { useState, useRef } from 'react';
import { Document } from '@/lib/types';
import { formatFileSize } from '@/lib/utils/format';
import { getDocumentIcon } from '../documents/documentUtils';

interface PartyPositionFormProps {
    affairId: string;
    onSave: () => void;
}

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

        setUploading(true);
        setError(null);
        
        try {
            const uploadFormData = new FormData();
            Array.from(files).forEach(file => {
                uploadFormData.append('files', file);
            });

            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
            const response = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: uploadFormData,
            });

            if (!response.ok) {
                throw new Error('Błąd podczas przesyłania plików');
            }

            const data = await response.json();
            
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
            console.error('Upload error:', error);
            setError('Wystąpił błąd podczas przesyłania plików. Spróbuj ponownie.');
        } finally {
            setUploading(false);
            // Reset input
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
            const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
            const response = await fetch(`/api/affairs/${affairId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                credentials: 'include',
                body: JSON.stringify({
                    description: description || null,
                    documents: documents.length > 0 ? documents : null
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Błąd podczas zapisywania stanowiska');
            }

            onSave();
        } catch (error) {
            console.error('Save error:', error);
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
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Opis sprawy */}
                <div className="mb-6">
                    <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                        Opis sprawy z Twojej perspektywy
                    </label>
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
                        <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-blue-700" style={{ fontSize: '1.5rem' }}>Dokumenty</h3>
                    </div>

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
                                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontSize: '1.5rem' }}>Przesyłanie plików...</h4>
                                <p className="text-gray-500 mb-4">Proszę czekać</p>
                            </>
                        ) : (
                            <>
                                <svg className="w-12 h-12 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <h4 className="text-lg font-semibold text-gray-900 mb-2" style={{ fontSize: '1.5rem' }}>Przeciągnij i upuść pliki tutaj</h4>
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
                    {documents.length > 0 && (
                        <div className="space-y-3 mb-6">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white mr-4">
                                        {getDocumentIcon(doc.category, doc.type)}
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
                        className="px-6 py-3 gradient-bg hover:shadow-lg hover:-translate-y-0.5 text-white rounded-full font-semibold transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Zapisywanie...
                            </>
                        ) : (
                            <>
                                Zapisz stanowisko
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
