'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AffairTabs from '@/app/components/affairDetails/AffairTabs';
import AnalysisPoints from '@/app/components/affairDetails/AnalysisPoints';
import SettlementProposal from '@/app/components/affairDetails/SettlementProposal';
import AffairTimeline from '@/app/components/affairDetails/AffairTimeline';
import PartyPositionForm from '@/app/components/affairDetails/PartyPositionForm';
import { Affair } from '@/lib/types';
import { escapeHtml } from '@/lib/utils/escapeHtml';

interface AnalysisPoint {
  referencja: string;
  podsumowanie: string;
  uzasadnienie: string;
}

interface AIAnalysis {
  punkty_zgodne: AnalysisPoint[];
  punkty_do_negocjacji: AnalysisPoint[];
  punkty_sporne: AnalysisPoint[];
  propozycja_porozumienia: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
}

type TabType = 'agreements' | 'negotiations' | 'disagreements';

export default function AffairDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const affairId = params.id as string;
  
  const [affair, setAffair] = useState<Affair | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('agreements');
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPositionExpanded, setIsPositionExpanded] = useState(false);
  const [isOtherPartyPositionExpanded, setIsOtherPartyPositionExpanded] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } catch {
        }
      }
    }
  }, []);

  useEffect(() => {
    const fetchAffair = async () => {
      if (!affairId) return;

      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch(`/api/affairs/${affairId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setAffair(data.affair);
        } else if (response.status === 401) {
          router.push('/login');
        } else if (response.status === 404) {
          router.push('/dashboard');
        } else if (response.status === 403) {
          router.push('/dashboard');
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchAffair();
  }, [affairId, router, refreshKey]);

  const handlePositionSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const parseAIAnalysis = (): {
    analysisData: {
      agreements: Array<{ id: string; title: string; description: string }>;
      negotiations: Array<{ id: string; title: string; description: string }>;
      disagreements: Array<{ id: string; title: string; description: string }>;
    };
    settlementProposal: { content: string; status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all' } | undefined;
    isAnalyzing: boolean;
  } => {
    if (!affair) {
      return {
        analysisData: { agreements: [], negotiations: [], disagreements: [] },
        settlementProposal: undefined,
        isAnalyzing: false,
      };
    }

    const creatorParticipant = affair.participants?.find(p => p.userId === affair.creator.id);
    const involvedParticipant = affair.involvedUser ? affair.participants?.find(p => p.userId === affair.involvedUser?.id) : null;
    
    const bothHavePositions = creatorParticipant && involvedParticipant &&
      ((creatorParticipant.description || creatorParticipant.files) &&
       (involvedParticipant.description || involvedParticipant.files));

    const isAnalyzing = !!(bothHavePositions && !affair.aiAnalysis);

    if (!affair.aiAnalysis) {
      return {
        analysisData: { agreements: [], negotiations: [], disagreements: [] },
        settlementProposal: undefined,
        isAnalyzing,
      };
    }

    try {
      const analysis: AIAnalysis = JSON.parse(affair.aiAnalysis);
      
      // Mapuj dane z AI do formatu komponentów
      const mapToComponentFormat = (points: AnalysisPoint[]) => 
        points.map((point, index) => ({
          id: `point-${index}`,
          title: point.referencja.replace(/^\[|\]$/g, ''), // Usuń nawiasy kwadratowe z początku i końca
          description: `${point.podsumowanie}\n\nUzasadnienie: ${point.uzasadnienie}`,
        }));

      let proposalStatus: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all' = 'awaiting-you';
      
      if (affair.settlementProposalStatus) {
        const currentUserParticipant = affair.participants?.find(p => p.userId === userId);
        const isCreator = userId === affair.creator.id;
        
        switch (affair.settlementProposalStatus) {
          case 'awaiting-both':
            proposalStatus = 'awaiting-you';
            break;
          case 'awaiting-creator':
            proposalStatus = isCreator ? 'awaiting-you' : 'awaiting-other';
            break;
          case 'awaiting-involved':
            proposalStatus = isCreator ? 'awaiting-other' : 'awaiting-you';
            break;
          case 'accepted-all':
            proposalStatus = 'accepted-all';
            break;
          case 'modification-requested':
            const hasModificationRequest = currentUserParticipant?.settlementModificationRequestedAt !== null;
            proposalStatus = hasModificationRequest ? 'awaiting-other' : 'awaiting-you';
            break;
          default:
            proposalStatus = analysis.propozycja_porozumienia?.status || 'awaiting-you';
        }
      } else if (analysis.propozycja_porozumienia) {
        proposalStatus = analysis.propozycja_porozumienia.status;
      }

      return {
        analysisData: {
          agreements: mapToComponentFormat(analysis.punkty_zgodne || []),
          negotiations: mapToComponentFormat(analysis.punkty_do_negocjacji || []),
          disagreements: mapToComponentFormat(analysis.punkty_sporne || []),
        },
        settlementProposal: analysis.propozycja_porozumienia ? {
          ...analysis.propozycja_porozumienia,
          status: proposalStatus
        } : undefined,
        isAnalyzing: false,
      };
    } catch (error) {
      return {
        analysisData: { agreements: [], negotiations: [], disagreements: [] },
        settlementProposal: undefined,
        isAnalyzing: false,
      };
    }
  };

  const { analysisData, settlementProposal, isAnalyzing } = parseAIAnalysis();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#616161]">Ładowanie sprawy...</p>
        </div>
      </div>
    );
  }

  if (!affair) {
    return null;
  }

  const currentUserParticipant = affair.participants?.find(p => p.userId === userId);
  
  const otherPartyParticipant = affair.participants?.find(p => p.userId !== userId);
  const otherPartyUser = otherPartyParticipant?.user;
  
  const currentUserHasPosition = currentUserParticipant && (currentUserParticipant.description || currentUserParticipant.files);
  const otherPartyHasPosition = otherPartyParticipant && (otherPartyParticipant.description || otherPartyParticipant.files);
  const bothHavePositions = currentUserHasPosition && otherPartyHasPosition;

  const showPositionForm = currentUserParticipant?.status === 'REACTION_NEEDED' && 
    (!currentUserParticipant.description && !currentUserParticipant.files);

  const parseDocuments = (filesString: string | null | undefined): Array<{ id: string; name: string; size: number; type: string; category: string; path: string }> => {
    if (!filesString) return [];
    try {
      const parsed = JSON.parse(filesString);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - zgodny ze stylem innych stron dashboardu */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            {escapeHtml(affair.title)}
          </h1>
        </div>

        {/* Compact Header */}
        <div className="card card-padding card-margin overflow-hidden relative">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            {/* Center: Parties Info */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 lg:mx-4 shrink-0">
              <div className="text-left">
                <div className="text-xs text-[#616161] mb-1">Strona A</div>
                <div className="font-semibold text-[#212121] text-sm">
                  {escapeHtml(affair.creator.firstName)} {escapeHtml(affair.creator.lastName)}
                </div>
                <div className="text-xs text-[#616161] mt-0.5">
                  {affair.creator.email}
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs text-[#616161] mb-1">Strona B</div>
                {affair.involvedUser ? (
                  <>
                    <div className="font-semibold text-[#212121] text-sm">
                      {escapeHtml(affair.involvedUser.firstName)} {escapeHtml(affair.involvedUser.lastName)}
                    </div>
                    <div className="text-xs text-[#616161] mt-0.5">
                      {affair.involvedUser.email}
                    </div>
                  </>
                ) : (
                  <div className="text-xs text-[#616161]">Oczekiwanie...</div>
                )}
              </div>
            </div>

            {/* Right: Action Buttons or Status */}
            {settlementProposal?.status === 'awaiting-you' ? (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => {
                    setShowFeedbackForm(!showFeedbackForm);
                    if (showFeedbackForm) {
                      setFeedbackText('');
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base bg-white text-[#0A2463] border-2 border-[#0A2463] hover:bg-[#0A2463] hover:text-white hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Proponuję zmiany</span>
                </button>
                <button
                  onClick={async () => {
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
                        setRefreshKey(prev => prev + 1);
                      } else {
                        const error = await response.json();
                        alert(error.error || 'Wystąpił błąd podczas akceptacji porozumienia');
                      }
                    } catch (error) {
                      alert('Wystąpił błąd podczas akceptacji porozumienia');
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Akceptuję porozumienie</span>
                </button>
              </div>
            ) : settlementProposal && (
              <div className="shrink-0 min-w-[280px] sm:min-w-[320px]">
                {settlementProposal.status === 'accepted-you' && (
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

                {settlementProposal.status === 'accepted-all' && (
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

                {settlementProposal.status === 'awaiting-other' && (
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
            )}
          </div>
        </div>

        {/* Formularz propozycji zmian - pokazuje się po kliknięciu "Proponuję zmiany" */}
        {showFeedbackForm && settlementProposal?.status === 'awaiting-you' && (
          <div className="card card-padding card-margin">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
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
                onClick={() => {
                  setShowFeedbackForm(false);
                  setFeedbackText('');
                }}
                className="px-4 py-2 rounded-lg font-semibold text-sm border-2 border-[#3E5C95] text-[#0A2463] hover:bg-[#3E5C95] hover:text-white active:bg-[#3E5C95] active:text-white transition-all duration-200 touch-target"
              >
                Anuluj
              </button>
              <button
                onClick={async () => {
                  if (!feedbackText.trim()) {
                    alert('Proszę wprowadzić propozycję zmian');
                    return;
                  }

                  try {
                    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
                    if (!token) {
                      router.push('/login');
                      return;
                    }

                    const response = await fetch(`/api/affairs/${affairId}/settlement/modify`, {
                      method: 'POST',
                      headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify({ feedback: feedbackText }),
                    });

                    if (response.ok) {
                      setShowFeedbackForm(false);
                      setFeedbackText('');
                      setRefreshKey(prev => prev + 1);
                    } else {
                      const error = await response.json();
                      alert(error.error || 'Wystąpił błąd podczas wysyłania propozycji zmian');
                    }
                  } catch (error) {
                    alert('Wystąpił błąd podczas wysyłania propozycji zmian');
                  }
                }}
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

        {/* Main Content Layout - Two Columns on Large Screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-3">
            {/* Formularz stanowiska strony B */}
            {showPositionForm && (
              <PartyPositionForm affairId={affairId} onSave={handlePositionSaved} />
            )}

            {/* Settlement Proposal - NAJWAŻNIEJSZE - na górze */}
            <SettlementProposal proposal={settlementProposal} />

            {/* Analysis Section - DRUGIE NAJWAŻNIEJSZE - ukryj jeśli brak propozycji porozumienia */}
            {settlementProposal && (
            <div className="card card-padding overflow-hidden">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200/60">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                  </svg>
                </div>
                <h2 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Analiza punktów</h2>
              </div>
              
              <AffairTabs activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="mt-4">
                {isAnalyzing ? (
                  <div className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br from-[rgba(33,150,243,0.15)] to-[rgba(33,150,243,0.05)] flex items-center justify-center text-[#2196F3]">
                      <div className="w-8 h-8 border-4 border-[#2196F3] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-[#212121]">Analiza w toku</h3>
                    <p className="text-sm text-[#616161] max-w-md mx-auto">
                      Asystent AI analizuje stanowiska obu stron. Wyniki pojawią się tutaj za chwilę.
                    </p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'agreements' && (
                      <AnalysisPoints type="agreements" points={analysisData.agreements} />
                    )}
                    {activeTab === 'negotiations' && (
                      <AnalysisPoints type="negotiations" points={analysisData.negotiations} />
                    )}
                    {activeTab === 'disagreements' && (
                      <AnalysisPoints type="disagreements" points={analysisData.disagreements} />
                    )}
                  </>
                )}
              </div>
            </div>
            )}

            {/* Stanowiska stron - NAJMNIEJ ISTOTNE - na dole, collapsible */}
            {currentUserParticipant && (currentUserParticipant.description || currentUserParticipant.files) && (
              <div className="card card-padding overflow-hidden">
                <button
                  onClick={() => setIsPositionExpanded(!isPositionExpanded)}
                  className="w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors touch-target -m-2 p-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M12 11v6"></path>
                        <path d="M9 14h6"></path>
                      </svg>
                    </div>
                    <h2 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Twoje stanowisko</h2>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isPositionExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isPositionExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-4">
                    {currentUserParticipant && (currentUserParticipant.description || currentUserParticipant.files) && (
                      <div className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-lg p-4 border border-gray-200/50">
                        <div className="flex items-center gap-2 mb-3">
                        </div>
                        
                        {currentUserParticipant.description && (
                          <div className="mb-4">
                            <div className="bg-white rounded-lg p-3 border border-gray-200/50">
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{escapeHtml(currentUserParticipant.description)}</p>
                            </div>
                          </div>
                        )}
                        
                        {currentUserParticipant.files && parseDocuments(currentUserParticipant.files).length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {parseDocuments(currentUserParticipant.files).map((doc) => (
                              <a
                                key={doc.id}
                                href={`/api/files${doc.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200/50 hover:border-[#3E5C95] hover:shadow-sm transition-all text-sm"
                              >
                                <svg className="w-4 h-4 text-[#3E5C95] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="text-gray-700 truncate">{doc.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Komunikat o oczekiwaniu na stanowisko drugiej strony */}
            {currentUserHasPosition && !otherPartyHasPosition && otherPartyUser && (
              <div className="card card-padding overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-sm">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h2 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Oczekiwanie na stanowisko drugiej strony</h2>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Przedstawiłeś swoje stanowisko. Stanowisko drugiej strony ({escapeHtml(otherPartyUser.firstName)} {escapeHtml(otherPartyUser.lastName)}) 
                    zostanie ujawnione, gdy również przedstawi swoje stanowisko w sprawie.
                  </p>
                </div>
              </div>
            )}

            {/* Stanowisko drugiej strony - widoczne tylko gdy obie strony mają stanowiska */}
            {bothHavePositions && otherPartyParticipant && otherPartyUser && (
              <div className="card card-padding overflow-hidden">
                <button
                  onClick={() => setIsOtherPartyPositionExpanded(!isOtherPartyPositionExpanded)}
                  className="w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors touch-target -m-2 p-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <path d="M12 11v6"></path>
                        <path d="M9 14h6"></path>
                      </svg>
                    </div>
                    <div>
                      <h2 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Stanowisko drugiej strony</h2>
                    </div>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isOtherPartyPositionExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOtherPartyPositionExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-[#F5F5F7] to-white rounded-lg p-4 border border-gray-200/50">
                      {otherPartyParticipant.description && (
                        <div className="mb-4">
                          <div className="bg-white rounded-lg p-3 border border-gray-200/50">
                            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{escapeHtml(otherPartyParticipant.description)}</p>
                          </div>
                        </div>
                      )}
                      
                      {otherPartyParticipant.files && parseDocuments(otherPartyParticipant.files).length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {parseDocuments(otherPartyParticipant.files).map((doc) => (
                            <a
                              key={doc.id}
                              href={`/api/files${doc.path}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200/50 hover:border-[#3E5C95] hover:shadow-sm transition-all text-sm"
                            >
                              <svg className="w-4 h-4 text-[#3E5C95] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-gray-700 truncate">{doc.name}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-[90px]">
              <AffairTimeline 
                affair={affair} 
                currentUserId={userId}
                settlementProposalStatus={settlementProposal?.status}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

