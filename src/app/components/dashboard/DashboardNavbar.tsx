'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DashboardNavbarProps  } from '@/lib/types';
import { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api/client';

export default function DashboardNavbar({ sidebarOpen, setSidebarOpen }: DashboardNavbarProps) {
    const pathname = usePathname();;
    const [userCreatedAffairsCount, setUserCreatedAffairsCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchUserAffairsCount = async () => {
        try {
          const data = await apiGet<{ count: number }>('/api/affairs/count');
          setUserCreatedAffairsCount(data.count);
        } catch (error) {
          console.error('Error fetching user affairs count:', error);
        } finally {
          setLoading(false)
        }
      };

      fetchUserAffairsCount();
    }, []);
    
    // Ukryj przycisk "Nowa sprawa" gdy:
    // 1. Tworzymy nową sprawę (/dashboard/affairs/new)
    // 2. Jesteśmy w konkretnej sprawie (/dashboard/affairs/[id])
    // 3. softlimiter - user utworzył juz 5 spraw
    const shouldHideNewAffairButton = 
      pathname === '/dashboard/affairs/new' ||
      (pathname.startsWith('/dashboard/affairs/') && pathname !== '/dashboard/affairs') ||
      userCreatedAffairsCount >= 5;

    const maxAffairsReached = userCreatedAffairsCount >= 5;
    
    return (
      <header className="h-[70px] bg-[#0A2463] backdrop-blur-md border-b border-[#0A2463]/30 flex items-center justify-between px-4 lg:px-8 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300 overflow-hidden">
        {/* Pattern with pluses */}
        <div className="absolute inset-0 opacity-60 bg-pattern-plus-radial" />
        {/* Left side - Hamburger menu + Welcome message + Logo */}
        <div className="flex items-center gap-4 relative z-10">
          {/* Hamburger menu button for mobile */}
          <button
            onClick={() => setSidebarOpen && setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-xl hover:bg-white/10 active:bg-white/20 transition-colors text-white touch-target"
            aria-label="Toggle menu"
          >
            <svg 
              width="24" 
              height="24" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {sidebarOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
          <Link 
            href="/dashboard" 
            className="text-xl lg:text-2xl font-bold text-white hover:text-gray-200 font-['Space_Grotesk'] transition-colors"
          >
            e-Porozumienie
          </Link>
        </div>
      
        {/* Right side - New Affair button */}
        {!shouldHideNewAffairButton && !loading && (
          <div className="flex items-center gap-4 relative z-10">
            <Link
              href="/dashboard/affairs/new"
              className="bg-linear-to-br from-white to-gray-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-gray-900 py-2.5 px-4 lg:px-5 rounded-full font-semibold transition-all duration-300 text-sm flex items-center gap-2 touch-target"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span className="hidden sm:inline">Nowe porozumienie</span>
              <span className="sm:hidden">Nowa</span>
            </Link>
          </div>
        )}
        {/* Limit reached message */}
        {maxAffairsReached && !loading && (
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-gray-100 text-gray-600 py-2.5 px-4 lg:px-5 rounded-full font-semibold text-sm flex items-center gap-2">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span className="hidden sm:inline">Limit 5 spraw osiągnięty</span>
              <span className="sm:hidden">Limit</span>
            </div>
          </div>
        )}
      </header>
    );
}

