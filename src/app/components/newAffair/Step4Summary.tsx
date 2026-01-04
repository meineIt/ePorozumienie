'use client';

import { useState } from 'react';
import { AffairFormData, User } from '@/lib/types';

interface Step4SummaryProps {
  formData: AffairFormData;
  user: User;
  onPrev: () => void;
  onCreateAffair: () => void;
}

export default function Step4Summary({
  formData,
  user,
  onPrev,
  onCreateAffair,
}: Step4SummaryProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!termsAccepted) {
      alert('Aby utworzyć sprawę, musisz zaakceptować regulamin i politykę prywatności.');
      return;
    }

    setIsCreating(true);
    setError(null);
    
    try {
      const otherPartyEmail = formData.otherPartyType === 'person'
        ? formData.otherPartyPerson?.email
        : formData.otherPartyCompany?.email

      if (!otherPartyEmail) {
        throw new Error('Email drugiej strony jest wymagany');
      }

      const response = await fetch('/api/affairs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          description: formData.description,
          disputeValue: formData.disputeValue,
          documents: formData.documents,
          creatorId: user.id,
          otherPartyEmail,
          otherPartyType: formData.otherPartyType,
          otherPartyPerson: formData.otherPartyPerson,
          otherPartyCompany: formData.otherPartyCompany,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd podczas tworzenia sprawy' )
      }

      setIsCreating(false)
      setIsSuccess(true)
      onCreateAffair();
    } catch (err) {
      console.error('Error creating affair:', err);
      setIsCreating(false);
      setError(err instanceof Error ? err.message : 'Wystąpił błąd podczas tworzenia sprawy');
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Sprawa została utworzona!</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Druga strona otrzyma powiadomienie o chęci zawarcia ugody. Po dołączeniu do sprawy, system AI przeanalizuje dokumenty i przedstawi propozycję ugody.
        </p>
        <a
          href="/dashboard"
          className="inline-block px-6 py-2 bg-white border-2 border-blue-300 text-blue-700 rounded-full font-semibold hover:bg-blue-50 transition-colors"
        >
          Przejdź do pulpitu
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-gray-900">Krok 4: Podsumowanie i utworzenie sprawy</h2>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-700 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Błąd</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Info box */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-700 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 mb-1">Co dalej?</h4>
            <p className="text-sm text-gray-700">
              Po utworzeniu sprawy, druga strona otrzyma powiadomienie z zaproszeniem do mediacji. Po dołączeniu obu stron, system AI przeanalizuje dokumenty i stanowiska, a następnie przedstawi propozycję ugody.
            </p>
          </div>
        </div>
      </div>

      {/* Podsumowanie */}
      <div className="space-y-6 mb-8">
        {/* Informacje podstawowe */}
        <div className="pb-6 border-b">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-700">Informacje podstawowe</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex">
              <span className="font-medium text-gray-600 w-48">Tytuł sprawy:</span>
              <span className="text-gray-900">{formData.title || '—'}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-48">Kategoria:</span>
              <span className="text-gray-900">{formData.category || '—'}</span>
            </div>
            <div className="flex">
              <span className="font-medium text-gray-600 w-48">Wartość przedmiotu sporu:</span>
              <span className="text-gray-900">{formData.disputeValue ? `${formData.disputeValue} PLN` : '—'}</span>
            </div>
          </div>
        </div>

        {/* Dokumenty */}
        <div className="pb-6 border-b">
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-700">Dokumenty</h3>
          </div>
          <div className="flex items-center">
            <span className="font-medium text-gray-600 w-48">Liczba dokumentów:</span>
            <span className="text-gray-900">{formData.documents?.length || 0}</span>
          </div>
        </div>

        {/* Koszty */}
        <div>
          <div className="flex items-center mb-4">
            <svg className="w-5 h-5 text-blue-700 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-blue-700">Koszty mediacji</h3>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Utworzenie sprawy</span>
              <span className="font-semibold text-gray-900">49 PLN</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Analiza dokumentów przez AI</span>
              <span className="font-semibold text-gray-900">30 PLN</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Propozycja ugody</span>
              <span className="font-semibold text-gray-900">20 PLN</span>
            </div>
            <div className="border-t pt-3 flex justify-between">
              <span className="font-semibold text-blue-700">Razem</span>
              <span className="font-bold text-lg text-blue-700">99 PLN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regulamin */}
      <div className="mb-8">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
          />
          <span className="ml-3 text-sm text-gray-600">
            Akceptuję <a href="#" className="text-blue-700 hover:underline">Regulamin</a> platformy e-Porozumienie oraz wyrażam zgodę na przetwarzanie moich danych osobowych zgodnie z <a href="#" className="text-blue-700 hover:underline">Polityką Prywatności</a>.
          </span>
        </label>
      </div>

      {/* Akcje */}
      <div className="flex justify-between pt-6 border-t">
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
          onClick={handleCreate}
          disabled={isCreating}
          className="px-6 py-2 gradient-bg hover:shadow-lg hover:-translate-y-0.5 text-white rounded-full font-semibold transition-all duration-300 flex items-center"
        >
          {isCreating ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Tworzenie...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Utwórz sprawę (99 PLN)
            </>
          )}
        </button>
      </div>
    </div>
  );
}