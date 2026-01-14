'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AffairTabs from '@/app/components/affairDetails/AffairTabs';
import AnalysisPoints from '@/app/components/affairDetails/AnalysisPoints';
import SettlementProposal from '@/app/components/affairDetails/SettlementProposal';
import AffairTimeline from '@/app/components/affairDetails/AffairTimeline';
import PartyPositionForm from '@/app/components/affairDetails/PartyPositionForm';
import { Affair } from '@/lib/types';

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } catch (error) {
          console.error('Error parsing user data:', error);
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
        console.error('Error fetching affair:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffair();
  }, [affairId, router, refreshKey]);

  const handlePositionSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  // Parsuj dane analizy AI
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

    // Sprawdź czy obie strony mają stanowiska
    const creatorParticipant = affair.participants?.find(p => p.userId === affair.creator.id);
    const involvedParticipant = affair.involvedUser ? affair.participants?.find(p => p.userId === affair.involvedUser?.id) : null;
    
    const bothHavePositions = creatorParticipant && involvedParticipant &&
      ((creatorParticipant.description || creatorParticipant.files) &&
       (involvedParticipant.description || involvedParticipant.files));

    // Jeśli obie strony mają stanowiska ale nie ma analizy, oznacza to że analiza jest w toku
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

      return {
        analysisData: {
          agreements: mapToComponentFormat(analysis.punkty_zgodne || []),
          negotiations: mapToComponentFormat(analysis.punkty_do_negocjacji || []),
          disagreements: mapToComponentFormat(analysis.punkty_sporne || []),
        },
        settlementProposal: analysis.propozycja_porozumienia,
        isAnalyzing: false,
      };
    } catch (error) {
      console.error('Error parsing AI analysis:', error);
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
  const creatorParticipant = affair.participants?.find(p => p.userId === affair.creator.id);
  const involvedParticipant = affair.involvedUser ? affair.participants?.find(p => p.userId === affair.involvedUser?.id) : null;

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
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        {/* Title at the top left */}
        <div className="mb-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            Porozumienie dla {affair.title}
          </h1>
        </div>

        {/* Compact Header */}
        <div className="card card-padding card-margin overflow-hidden relative">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
            {/* Left: Settlement Proposal Status */}
            <div className="flex-1">
              {settlementProposal && (() => {
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
                    className: 'bg-green-50 text-green-600',
                  },
                  'accepted-all': {
                    label: 'Zaakceptowana przez obie strony',
                    className: 'bg-[rgba(33,150,243,0.1)] text-[#2196F3]',
                  },
                };
                const statusInfo = statusConfig[settlementProposal.status];
                return (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                );
              })()}
            </div>

            {/* Center: Parties Info */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 lg:mx-4 shrink-0">
              <div className="text-left">
                <div className="text-xs text-[#616161] mb-1">Strona A</div>
                <div className="font-semibold text-[#212121] text-sm">
                  {affair.creator.firstName} {affair.creator.lastName}
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
                      {affair.involvedUser.firstName} {affair.involvedUser.lastName}
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

            {/* Right: Action Buttons */}
            {settlementProposal?.status === 'awaiting-you' && (
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 shrink-0">
                <button
                  onClick={() => {
                    // TODO: Implementacja akceptacji porozumienia
                    console.log('Accept settlement');
                  }}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Akceptuję porozumienie</span>
                </button>
                <button
                  onClick={() => {
                    // TODO: Implementacja propozycji zmian
                    console.log('Propose changes');
                  }}
                  className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base bg-white text-[#0A2463] border-2 border-[#0A2463] hover:bg-[#0A2463] hover:text-white hover:scale-105 active:scale-100 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  <span>Proponuję zmiany</span>
                </button>
              </div>
            )}
          </div>
        </div>

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
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2196F3] to-[#0A2463] flex items-center justify-center text-white shadow-sm">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
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
            {(creatorParticipant?.description || creatorParticipant?.files || involvedParticipant?.description || involvedParticipant?.files) && (
              <div className="card card-padding overflow-hidden">
                <button
                  onClick={() => setIsPositionExpanded(!isPositionExpanded)}
                  className="w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors touch-target -m-2 p-2 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                      </svg>
                    </div>
                    <h2 className="heading-section text-base text-gray-600" style={{ fontSize: '1rem' }}>Twoje stanowisko</h2>
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
                              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{currentUserParticipant.description}</p>
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

