'use client';

import { useState } from 'react';

interface SettlementProposalProps {
  proposal?: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
}

export default function SettlementProposal({ proposal }: SettlementProposalProps) {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  if (!proposal) {
    return (
      <div className="card card-padding text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[rgba(33,150,243,0.15)] to-[rgba(33,150,243,0.05)] flex items-center justify-center text-[#2196F3] shadow-sm">
          <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
            <line x1="10" x2="8" y1="9" y2="9"></line>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#212121]">Brak propozycji porozumienia</h3>
        <p className="text-sm text-[#616161] max-w-md mx-auto leading-relaxed">
          Nasz asystent AI wygeneruje propozycję porozumienia, gdy druga strona przedstawi swoje stanowisko.
        </p>
      </div>
    );
  }

  const handleSubmitFeedback = () => {
    // TODO: Implementacja wysyłania propozycji zmian
    console.log('Feedback:', feedbackText);
    setShowFeedbackForm(false);
    setFeedbackText('');
  };

  return (
    <div className="card card-padding">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200/60">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
            <line x1="10" x2="8" y1="9" y2="9"></line>
          </svg>
        </div>
        <h3 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Propozycja porozumienia</h3>
      </div>

      <div className="bg-gradient-to-br from-[#F5F5F7] to-white border border-gray-200/50 rounded-lg p-4 mb-4 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm text-[#616161] leading-relaxed">
            {proposal.content}
          </div>
        </div>
      </div>

      {showFeedbackForm && (
        <div className="mt-4 pt-4 border-t border-gray-200/50">
          <h4 className="font-semibold text-base text-[#212121] mb-2">Proponowane zmiany do porozumienia</h4>
          <p className="text-xs text-[#616161] mb-3">
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
              onClick={() => {
                setShowFeedbackForm(false);
                setFeedbackText('');
              }}
              className="px-4 py-2 rounded-lg font-semibold text-sm border-2 border-[#3E5C95] text-[#0A2463] hover:bg-[#3E5C95] hover:text-white active:bg-[#3E5C95] active:text-white transition-all duration-200 touch-target"
            >
              Anuluj
            </button>
            <button
              onClick={handleSubmitFeedback}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm bg-gradient-to-br from-[#0A2463] to-[#3E5C95] text-white hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 touch-target"
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              Wyślij propozycję zmian
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

