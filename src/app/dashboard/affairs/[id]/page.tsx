'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AffairTabs from '@/app/components/affairDetails/AffairTabs';
import AnalysisPoints from '@/app/components/affairDetails/AnalysisPoints';
import SettlementProposal from '@/app/components/affairDetails/SettlementProposal';
import AffairTimeline from '@/app/components/affairDetails/AffairTimeline';

interface Affair {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  involvedUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
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
      if (!userId || !affairId) return;

      try {
        const response = await fetch(`/api/affairs/${affairId}?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setAffair(data.affair);
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

    if (userId) {
      fetchAffair();
    }
  }, [affairId, userId, router]);

  const getAffairInitials = (title: string) => {
    const words = title.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return title.substring(0, 2).toUpperCase();
  };

  // Placeholder data - będzie zastąpione danymi z AI
  const analysisData = {
    agreements: [],
    negotiations: [],
    disagreements: [],
  };

  const settlementProposal = undefined; // Placeholder - będzie z AI

  const timelineEvents: Array<{
    id: string;
    title: string;
    description: string;
    date: string;
    type: 'creation' | 'party-added' | 'party-joined' | 'analysis' | 'proposal' | 'acceptance';
  }> = affair ? [
    {
      id: '1',
      title: 'Utworzenie sprawy',
      description: 'Sprawa została utworzona i złożono dokumenty.',
      date: affair.createdAt,
      type: 'creation',
    },
  ] : [];

  if (loading) {
    return (
      <div className="ml-[230px] min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#616161]">Ładowanie sprawy...</p>
        </div>
      </div>
    );
  }

  if (!affair) {
    return null;
  }

  return (
    <div className="ml-[230px] min-h-screen bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#3E5C95] text-white flex items-center justify-center font-semibold text-lg">
                {getAffairInitials(affair.title)}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#212121] mb-1">{affair.title}</h1>
              </div>
            </div>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[rgba(76,175,80,0.1)] text-[#4CAF50] uppercase tracking-wide">
              W toku
            </span>
          </div>

          {/* Parties Info */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div>
              <div className="text-xs text-[#616161] mb-1">Strona A</div>
              <div className="font-semibold text-[#212121]">
                {affair.creator.firstName} {affair.creator.lastName}
              </div>
              <div className="text-sm text-[#616161]">{affair.creator.email}</div>
            </div>
            <div>
              <div className="text-xs text-[#616161] mb-1">Strona B</div>
              <div className="font-semibold text-[#212121]">
                {affair.involvedUser.firstName} {affair.involvedUser.lastName}
              </div>
              <div className="text-sm text-[#616161]">{affair.involvedUser.email}</div>
            </div>
          </div>
        </div>

        {/* Tabs and Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <AffairTabs activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="mt-6">
            {activeTab === 'agreements' && (
              <AnalysisPoints type="agreements" points={analysisData.agreements} />
            )}
            {activeTab === 'negotiations' && (
              <AnalysisPoints type="negotiations" points={analysisData.negotiations} />
            )}
            {activeTab === 'disagreements' && (
              <AnalysisPoints type="disagreements" points={analysisData.disagreements} />
            )}
          </div>
        </div>

        {/* Settlement Proposal */}
        <SettlementProposal proposal={settlementProposal} />

        {/* Timeline */}
        <AffairTimeline events={timelineEvents} />
      </div>
    </div>
  );
}

