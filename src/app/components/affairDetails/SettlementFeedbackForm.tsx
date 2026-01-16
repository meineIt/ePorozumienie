'use client';

import { useState } from 'react';
import { apiPost } from '@/lib/api/client';
import { SettlementFeedbackFormProps } from '@/lib/types';

export default function SettlementFeedbackForm({
  affairId,
  onClose,
  onSuccess,
}: SettlementFeedbackFormProps) {
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = async () => {
    if (!feedbackText.trim()) {
      alert('Proszę wprowadzić propozycję zmian');
      return;
    }

    try {
      await apiPost(`/api/affairs/${affairId}/settlement/modify`, {
        feedback: feedbackText,
      });

      setFeedbackText('');
      onClose();
      onSuccess();
    } catch (error) {
      console.error('Error submitting settlement feedback:', error);
      const errorMessage = error instanceof Error ? error.message : 'Wystąpił błąd podczas wysyłania propozycji zmian';
      alert(errorMessage);
    }
  };

  return (
    <div className="card card-padding card-margin">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </div>
        <h3 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Proponowane zmiany do porozumienia</h3>
      </div>
      <p className="text-sm text-[#616161] mb-3">
        Opisz, jakie zmiany chciałbyś wprowadzić do propozycji porozumienia. Asystent AI uwzględni Twoje sugestie przy przygotowaniu nowej wersji.
      </p>
      <textarea
        value={feedbackText}
        onChange={(e) => setFeedbackText(e.target.value)}
        placeholder="Np. Proponuję zmianę proporcji kosztów naprawy na 50/50 oraz wydłużenie terminu naprawy do 30.04.2025..."
        className="w-full p-3 border border-gray-200 rounded-lg resize-vertical min-h-[100px] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent transition-all duration-200 bg-white"
      />
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end mt-3">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg font-semibold text-sm border-2 border-[#3E5C95] text-[#0A2463] hover:bg-[#3E5C95] hover:text-white active:bg-[#3E5C95] active:text-white transition-all duration-200 touch-target"
        >
          Anuluj
        </button>
        <button
          onClick={handleSubmit}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-linear-to-br from-[#0A2463] to-[#3E5C95] text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 touch-target"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
          Wyślij propozycję zmian
        </button>
      </div>
    </div>
  );
}
