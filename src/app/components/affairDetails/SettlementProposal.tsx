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

  const statusConfig = {
    'awaiting-you': {
      label: 'Oczekuje na Twoją odpowiedź',
      className: 'bg-[rgba(156,39,176,0.1)] text-[#9C27B0]',
    },
    'awaiting-other': {
      label: 'Oczekuje na odpowiedź drugiej strony',
      className: 'bg-[rgba(255,152,0,0.1)] text-[#FF9800]',
    },
    'accepted-you': {
      label: 'Zaakceptowana przez Ciebie',
      className: 'bg-[rgba(76,175,80,0.1)] text-[#4CAF50]',
    },
    'accepted-all': {
      label: 'Zaakceptowana przez obie strony',
      className: 'bg-[rgba(33,150,243,0.1)] text-[#2196F3]',
    },
  };

  const currentStatus = proposal?.status || 'awaiting-you';
  const statusInfo = statusConfig[currentStatus];

  if (!proposal) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(33,150,243,0.1)] flex items-center justify-center text-[#2196F3]">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
            <line x1="10" x2="8" y1="9" y2="9"></line>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#212121]">Brak propozycji ugody</h3>
        <p className="text-[#616161] max-w-md mx-auto">
          Propozycja ugody będzie wyświetlana tutaj po przygotowaniu przez asystenta AI.
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0A2463] flex items-center justify-center text-white">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" x2="8" y1="13" y2="13"></line>
              <line x1="16" x2="8" y1="17" y2="17"></line>
              <line x1="10" x2="8" y1="9" y2="9"></line>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-[#212121]">Propozycja ugody</h3>
        </div>
        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusInfo.className}`}>
          {statusInfo.label}
        </span>
      </div>

      <div className="bg-[#FAFAFA] border border-gray-200 rounded-lg p-6 mb-6">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-[#616161] leading-relaxed">
            {proposal.content}
          </div>
        </div>
      </div>

      {currentStatus === 'awaiting-you' && (
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setShowFeedbackForm(!showFeedbackForm)}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm border-2 border-[#3E5C95] text-[#0A2463] hover:bg-[#3E5C95] hover:text-white transition-all duration-200"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            Proponuję zmiany
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-br from-[#0A2463] to-[#3E5C95] text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Akceptuję ugodę
          </button>
        </div>
      )}

      {showFeedbackForm && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-semibold text-[#212121] mb-3">Proponowane zmiany do ugody</h4>
          <p className="text-sm text-[#616161] mb-4">
            Opisz, jakie zmiany chciałbyś wprowadzić do propozycji ugody. Asystent AI uwzględni Twoje sugestie przy przygotowaniu nowej wersji.
          </p>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder="Np. Proponuję zmianę proporcji kosztów naprawy na 50/50 oraz wydłużenie terminu naprawy do 30.04.2025..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-vertical min-h-[120px] font-sans text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2463] focus:border-transparent"
          />
          <div className="flex gap-4 justify-end mt-4">
            <button
              onClick={() => {
                setShowFeedbackForm(false);
                setFeedbackText('');
              }}
              className="px-6 py-3 rounded-full font-semibold text-sm border-2 border-[#3E5C95] text-[#0A2463] hover:bg-[#3E5C95] hover:text-white transition-all duration-200"
            >
              Anuluj
            </button>
            <button
              onClick={handleSubmitFeedback}
              className="flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm bg-gradient-to-br from-[#0A2463] to-[#3E5C95] text-white hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

