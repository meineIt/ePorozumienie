'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';

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

interface AffairsListProps {
  userId: string;
}

export default function AffairsList({ userId }: AffairsListProps) {
    const [affairs, setAffairs] = useState<Affair[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchAffairs = async () => {
          try {
            const response = await fetch(`/api/affairs?userId=${userId}`);
            if (response.ok) {
              const data = await response.json();
              setAffairs(data.affairs || []);
            }
          } catch (error) {
            console.error('Error fetching affairs:', error);
          } finally {
            setLoading(false);
          }
        };
    
        if (userId) {
          fetchAffairs();
        }
      }, [userId]);


    const getAffairInitials = (title: string) => {
        const words = title.split(' ');
        if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
        }
        return title.substring(0, 2).toUpperCase();
    };

    const filteredAffairs = affairs.filter(affair =>
        affair.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affair.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
        <div className="flex items-center justify-center p-8">
            <p className="text-gray-600">Ładowanie spraw...</p>
        </div>
        );
    }

  return (
    <div className="ml-[230px] min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1200px] mx-auto p-8">

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#FF9800] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <span className="text-sm text-[#616161] font-medium ml-3 flex-1">Wymaga reakcji</span>
              <div className="text-3xl font-bold text-[#212121] font-['Space_Grotesk']">999</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#4CAF50] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <span className="text-sm text-[#616161] font-medium ml-3 flex-1">Oczekujące</span>
              <div className="text-3xl font-bold text-[#212121] font-['Space_Grotesk']">999</div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 hover:shadow-md hover:-translate-y-1 relative">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#2196F3] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="text-sm text-[#616161] font-medium ml-3 flex-1">Zawarte ugody</span>
              <div className="text-3xl font-bold text-[#212121] font-['Space_Grotesk']">999</div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mb-6">
          <div className="flex border-b-2 border-gray-200 pb-1"></div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAffairs.length === 0 ? (
            <div className="col-span-full bg-white p-12 rounded-xl shadow-sm border border-gray-200 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-[#0A2463] text-4xl">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212121]">Brak spraw</h3>
              <p className="text-[#616161] mb-6 max-w-md mx-auto">
                {searchQuery ? 'Nie znaleziono spraw' : 'Tutaj będą wyświetlane Twoje sprawy. Utwórz nową sprawę, aby rozpocząć!'}
              </p>
              {!searchQuery && (
                <Link
                  href="/dashboard/affairs/new"
                  className="inline-flex items-center gap-2 bg-gradient-to-br from-[#0A2463] to-[#3E5C95] hover:shadow-lg hover:-translate-y-0.5 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                  </svg>
                  Utwórz nową sprawę
                </Link>
              )}
            </div>
          ) : (
            filteredAffairs.map((affair) => (
              <Link
                key={affair.id}
                href={`/dashboard/affairs/${affair.id}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="p-6 border-b border-gray-200 flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-lg text-[#212121] mb-1">{affair.title}</div>
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[rgba(76,175,80,0.1)] text-[#4CAF50] uppercase tracking-wide">
                    W toku
                  </span>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[#616161] mb-1">Strona A</div>
                      <div className="font-semibold text-[#212121]">{affair.creator?.firstName} {affair.creator?.lastName}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#616161] mb-1">Strona B</div>
                      <div className="font-semibold text-[#212121]">{affair.involvedUser?.firstName} {affair.involvedUser?.lastName}</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-4 text-sm text-[#616161]">
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                        <line x1="16" x2="16" y1="2" y2="6"></line>
                        <line x1="8" x2="8" y1="2" y2="6"></line>
                        <line x1="3" x2="21" y1="10" y2="10"></line>
                      </svg>
                      <span>{formatDate(affair.createdAt, { includeYear: false })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" x2="8" y1="13" y2="13"></line>
                        <line x1="16" x2="8" y1="17" y2="17"></line>
                        <line x1="10" x2="8" y1="9" y2="9"></line>
                      </svg>
                      <span>999 dokumentów</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#616161] mb-2">
                      <span>Postęp</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#0A2463] rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}