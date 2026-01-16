'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils/format';
import { Affair, AffairStatus } from '@/lib/types';
import { escapeHtml } from '@/lib/utils/escapeHtml';

export default function AffairsList() {
    const [affairs, setAffairs] = useState<Affair[]>([]);
    const [allAffairs, setAllAffairs] = useState<Affair[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<AffairStatus | null>(null);

    useEffect(() => {
        const fetchAffairs = async () => {
          try {
            const url = statusFilter 
              ? `/api/affairs?status=${statusFilter}`
              : `/api/affairs`;
            const response = await fetch(url, {
              credentials: 'include',
            });
            if (response.ok) {
              const data = await response.json();
              const fetchedAffairs = data.affairs || [];
              setAffairs(fetchedAffairs);
              // Pobierz wszystkie sprawy dla statystyk
              if (statusFilter) {
                const allResponse = await fetch(`/api/affairs`, {
                  credentials: 'include', // Włącz cookies
                });
                if (allResponse.ok) {
                  const allData = await allResponse.json();
                  setAllAffairs(allData.affairs || []);
                }
              } else {
                setAllAffairs(fetchedAffairs);
              }
            } else if (response.status === 401) {
              // Nieautoryzowany - wyczyść localStorage i przekieruj do logowania
              localStorage.removeItem('user');
              localStorage.removeItem('auth-token');
              window.location.href = '/login';
            }
          } catch (error) {
            console.error('Error fetching affairs:', error);
          } finally {
            setLoading(false);
          }
        };
    
        fetchAffairs();
      }, [statusFilter]);


    const filteredAffairs = affairs.filter(affair =>
        affair.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        affair.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
      reactionNeeded: allAffairs.filter(a => a.status === AffairStatus.REACTION_NEEDED).length,
      waiting: allAffairs.filter(a => a.status === AffairStatus.WAITING).length,
      done: allAffairs.filter(a => a.status === AffairStatus.DONE).length,
    };

    const getStatusLabel = (status: AffairStatus | null | undefined) => {
      switch (status) {
        case AffairStatus.REACTION_NEEDED:
          return 'Wymaga reakcji';
        case AffairStatus.WAITING:
          return 'Wysłane';
        case AffairStatus.DONE:
          return 'Zakończone';
        default:
          return 'W toku';
      }
    };

    const getStatusBadgeClass = (status: AffairStatus | null | undefined) => {
      switch (status) {
        case AffairStatus.REACTION_NEEDED:
          return 'bg-[rgba(255,152,0,0.1)] text-[#FF9800]';
        case AffairStatus.WAITING:
          return 'bg-green-50 text-green-600';
        case AffairStatus.DONE:
          return 'bg-[rgba(33,150,243,0.1)] text-[#2196F3]';
        default:
          return 'bg-green-50 text-green-600';
      }
    };

    const getDocumentCount = (affair: Affair): number => {
      if (!affair.files) {
        return 0;
      }
      try {
        const documents = JSON.parse(affair.files);
        return Array.isArray(documents) ? documents.length : 0;
        } catch {
        return 0;
      }
    };

    const getEmptyStateMessage = () => {
      if (searchQuery) {
        return {
          title: 'Nie znaleziono spraw',
          description: 'Spróbuj zmienić kryteria wyszukiwania lub wyczyść filtr.'
        };
      }

      if (statusFilter === AffairStatus.REACTION_NEEDED) {
        return {
          title: 'Brak spraw wymagających reakcji',
          description: 'Nie masz obecnie spraw, które wymagają Twojej reakcji. Wszystko jest na bieżąco!'
        };
      }

      if (statusFilter === AffairStatus.WAITING) {
        return {
          title: 'Brak spraw wysłanych',
          description: 'Nie masz obecnie spraw wysłanych. Sprawy pojawią się tutaj, gdy będą wymagały Twojej uwagi.'
        };
      }

      if (statusFilter === AffairStatus.DONE) {
        return {
          title: 'Brak zawartych porozumień',
          description: 'Nie masz jeszcze żadnych zawartych porozumień. Zakończone sprawy będą wyświetlane tutaj.'
        };
      }

      return {
        title: 'Brak spraw',
        description: 'Tutaj będą wyświetlane Twoje sprawy. Utwórz nową sprawę, aby rozpocząć!'
      };
    };

    if (loading) {
        return (
        <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px] flex items-center justify-center p-8">
            <p className="text-[#616161]">Ładowanie spraw...</p>
        </div>
        );
    }

  return (
    <div className="min-h-screen bg-[#F5F5F7] pt-[70px] lg:pl-[240px]">
      <div className="max-w-[1200px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header - zgodny ze stylem innych stron dashboardu */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#212121] leading-tight">
            Pulpit
          </h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          
          <button
            onClick={() => setStatusFilter(statusFilter === AffairStatus.REACTION_NEEDED ? null : AffairStatus.REACTION_NEEDED)}
            className={`bg-white p-4 sm:p-5 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 relative text-left touch-target ${
              statusFilter === AffairStatus.REACTION_NEEDED 
                ? 'border-[#FF9800] border-2 shadow-lg' 
                : 'border-gray-200/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#FF9800] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <span className="text-sm text-[#616161] font-medium ml-3 flex-1">Wymaga reakcji</span>
              <div className="text-3xl font-bold text-[#212121] font-['Space_Grotesk']">{stats.reactionNeeded}</div>
            </div>
          </button>
          
          <button
            onClick={() => setStatusFilter(statusFilter === AffairStatus.WAITING ? null : AffairStatus.WAITING)}
            className={`bg-white p-4 sm:p-5 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 relative text-left touch-target ${
              statusFilter === AffairStatus.WAITING 
                ? 'border-[#4CAF50] border-2 shadow-lg' 
                : 'border-gray-200/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-green-500 flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </div>
              <span className="text-sm text-[#616161] font-medium ml-3 flex-1">Wysłane</span>
              <div className="text-3xl font-bold text-[#212121] font-['Space_Grotesk']">{stats.waiting}</div>
            </div>
          </button>
          
          <button
            onClick={() => setStatusFilter(statusFilter === AffairStatus.DONE ? null : AffairStatus.DONE)}
            className={`bg-white p-4 sm:p-5 rounded-2xl shadow-md border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 relative text-left touch-target ${
              statusFilter === AffairStatus.DONE 
                ? 'border-[#2196F3] border-2 shadow-lg' 
                : 'border-gray-200/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-lg bg-[#2196F3] flex items-center justify-center text-white shrink-0">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <span className="text-sm text-[#616161] font-medium ml-3 flex-1">Zawarte porozumienia</span>
              <div className="text-3xl font-bold text-[#212121] font-['Space_Grotesk']">{stats.done}</div>
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="mb-6">
          <div className="flex border-b-2 border-gray-200 pb-1"></div>
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAffairs.length === 0 ? (
            <div className="col-span-full card card-padding text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center text-[#0A2463] text-4xl">
                <svg width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#212121]">{getEmptyStateMessage().title}</h3>
              <p className="text-[#616161] mb-6 max-w-md mx-auto">
                {getEmptyStateMessage().description}
              </p>
              {!searchQuery && !statusFilter && (
                <Link
                  href="/dashboard/affairs/new"
                  className="inline-flex items-center gap-2 bg-linear-to-br from-[#0A2463] to-[#3E5C95] hover:shadow-lg hover:-translate-y-0.5 text-white py-3 px-6 rounded-full font-semibold transition-all duration-300"
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
                className="card overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 active:translate-y-0 touch-target block"
              >
                <div className="p-4 sm:p-6 border-b border-gray-200/50 flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-base sm:text-lg text-[#212121] mb-1 truncate">{escapeHtml(affair.title)}</div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(affair.status)} uppercase tracking-wide shrink-0`}>
                    {getStatusLabel(affair.status)}
                  </span>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                    <div>
                      <div className="text-xs text-[#616161] mb-1">Strona A</div>
                      <div className="font-semibold text-sm sm:text-base text-[#212121] truncate">{escapeHtml(affair.creator?.firstName || '')} {escapeHtml(affair.creator?.lastName || '')}</div>
                    </div>
                    <div>
                      <div className="text-xs text-[#616161] mb-1">Strona B</div>
                      <div className="font-semibold text-sm sm:text-base text-[#212121] truncate">
                        {affair.involvedUser ? `${escapeHtml(affair.involvedUser.firstName)} ${escapeHtml(affair.involvedUser.lastName)}` : '—'}
                      </div>
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
                      <span>
                        {(() => {
                          const count = getDocumentCount(affair);
                          if (count === 0) return '0 dokumentów';
                          if (count === 1) return '1 dokument';
                          if (count >= 2 && count <= 4) return `${count} dokumenty`;
                          return `${count} dokumentów`;
                        })()}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-[#616161] mb-2">
                      <span>Postęp</span>
                      <span>75%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200/50 rounded-full overflow-hidden">
                      <div className="h-full bg-linear-to-r from-[#0A2463] to-[#3E5C95] rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
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