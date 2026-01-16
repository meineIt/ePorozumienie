'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import AffairTabs from '@/app/components/affairDetails/AffairTabs';
import AnalysisPoints from '@/app/components/affairDetails/AnalysisPoints';
import SettlementProposal from '@/app/components/affairDetails/SettlementProposal';
import AffairTimeline from '@/app/components/affairDetails/AffairTimeline';
import PartyPositionForm from '@/app/components/affairDetails/PartyPositionForm';
import SettlementStatusCard from '@/app/components/affairDetails/SettlementStatusCard';
import SettlementFeedbackForm from '@/app/components/affairDetails/SettlementFeedbackForm';
import PartyPositionSection from '@/app/components/affairDetails/PartyPositionSection';
import { escapeHtml } from '@/lib/utils/escapeHtml';
import { parseAIAnalysis } from '@/lib/utils/aiAnalysisParser';
import { getParticipant, getOtherPartyParticipant, hasPosition } from '@/lib/utils/affairHelpers';
import { Affair } from '@/lib/types';

type TabType = 'agreements' | 'negotiations' | 'disagreements';

export default function AffairDetailsPage() {
  const params = useParams();
  const affairId = params.id as string;
  
  const [affair, setAffair] = useState<Affair | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('agreements');
  const [userId, setUserId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUserId(user.id);
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
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
          window.location.href = '/login';
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
          window.location.href = '/login';
        } else if (response.status === 404 || response.status === 403) {
          window.location.href = '/dashboard';
        }
      } catch (error) {
        console.error('Error fetching affair:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAffair();
  }, [affairId, refreshKey]);

  const handlePositionSaved = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const { analysisData, settlementProposal, isAnalyzing } = parseAIAnalysis(affair, userId);

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

  const currentUserParticipant = getParticipant(affair, userId);
  const otherPartyParticipant = getOtherPartyParticipant(affair, userId);
  const otherPartyUser = otherPartyParticipant?.user;
  
  const currentUserHasPosition = hasPosition(currentUserParticipant);
  const otherPartyHasPosition = hasPosition(otherPartyParticipant);
  const bothHavePositions = currentUserHasPosition && otherPartyHasPosition;

  const showPositionForm = currentUserParticipant?.status === 'REACTION_NEEDED' && 
    !hasPosition(currentUserParticipant);

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
            <SettlementStatusCard
              proposal={settlementProposal}
              affairId={affairId}
              onFeedbackClick={() => setShowFeedbackForm(!showFeedbackForm)}
              onRefresh={handleRefresh}
            />
          </div>
        </div>

        {/* Formularz propozycji zmian - pokazuje się po kliknięciu "Proponuję zmiany" */}
        {showFeedbackForm && settlementProposal?.status === 'awaiting-you' && (
          <SettlementFeedbackForm
            affairId={affairId}
            onClose={() => setShowFeedbackForm(false)}
            onSuccess={handleRefresh}
          />
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
                <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
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
                  <div className="bg-linear-to-br from-[#F5F5F7] to-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-linear-to-br from-[rgba(33,150,243,0.15)] to-[rgba(33,150,243,0.05)] flex items-center justify-center text-[#2196F3]">
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
            {currentUserParticipant && hasPosition(currentUserParticipant) && (
              <PartyPositionSection
                participant={currentUserParticipant}
                title="Twoje stanowisko"
              />
            )}

            {/* Komunikat o oczekiwaniu na stanowisko drugiej strony */}
            {currentUserHasPosition && !otherPartyHasPosition && otherPartyUser && (
              <div className="card card-padding overflow-hidden">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-linear-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-sm">
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h2 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Oczekiwanie na stanowisko drugiej strony</h2>
                </div>
                <div className="bg-linear-to-br from-amber-50 to-white rounded-lg p-4 border border-amber-200/50">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Przedstawiłeś swoje stanowisko. Stanowisko drugiej strony ({escapeHtml(otherPartyUser.firstName)} {escapeHtml(otherPartyUser.lastName)}) 
                    zostanie ujawnione, gdy również przedstawi swoje stanowisko w sprawie.
                  </p>
                </div>
              </div>
            )}

            {/* Stanowisko drugiej strony - widoczne tylko gdy obie strony mają stanowiska */}
            {bothHavePositions && otherPartyParticipant && (
              <PartyPositionSection
                participant={otherPartyParticipant}
                title="Stanowisko drugiej strony"
              />
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

