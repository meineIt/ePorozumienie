'use client';

import { useRouter } from 'next/navigation';

interface SettlementStatusCardProps {
  proposal?: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
  affairId: string;
  onFeedbackClick: () => void;
  onRefresh: () => void;
}

export default function SettlementStatusCard({
  proposal,
  affairId,
  onFeedbackClick,
  onRefresh,
}: SettlementStatusCardProps) {
  const router = useRouter();

  if (!proposal) {
    return null;
  }

  const handleAccept = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/affairs/${affairId}/settlement/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        onRefresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Wystąpił błąd podczas akceptacji porozumienia');
      }
    } catch (error) {
      alert('Wystąpił błąd podczas akceptacji porozumienia');
    }
  };

  if (proposal.status === 'awaiting-you') {
    return (
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
        <button
          onClick={onFeedbackClick}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base bg-white text-[#0A2463] border-2 border-[#0A2463] hover:bg-[#0A2463] hover:text-white hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
          <span>Proponuję zmiany</span>
        </button>
        <button
          onClick={handleAccept}
          className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <span>Akceptuję porozumienie</span>
        </button>
      </div>
    );
  }

  return (
    <div className="shrink-0 min-w-[280px] sm:min-w-[320px]">
      {proposal.status === 'accepted-you' && (
        <div className="p-4 sm:p-5 bg-blue-50 border-2 border-blue-300 rounded-xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-blue-900 mb-1">
                Zaakceptowane przez Ciebie
              </p>
              <p className="text-sm sm:text-base text-blue-800">
                Oczekiwanie na akceptację drugiej strony.
              </p>
            </div>
          </div>
        </div>
      )}

      {proposal.status === 'accepted-all' && (
        <div className="p-4 sm:p-5 bg-green-50 border-2 border-green-300 rounded-xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-green-900 mb-1">
                Porozumienie zawarte!
              </p>
              <p className="text-sm sm:text-base text-green-800">
                Obie strony zaakceptowały propozycję porozumienia.
              </p>
            </div>
          </div>
        </div>
      )}

      {proposal.status === 'awaiting-other' && (
        <div className="p-4 sm:p-5 bg-yellow-50 border-2 border-yellow-300 rounded-xl shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-yellow-500 flex items-center justify-center shrink-0 mt-0.5">
              <svg width="14" height="14" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-yellow-900 mb-1">
                Oczekiwanie na reakcję
              </p>
              <p className="text-sm sm:text-base text-yellow-800">
                Oczekiwanie na reakcję drugiej strony.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
