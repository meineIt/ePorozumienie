'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  firstName: string;
}

interface DashboardNavbarProps extends User {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function DashboardNavbar({ firstName, sidebarOpen, setSidebarOpen }: DashboardNavbarProps) {
    const pathname = usePathname();
    
    // Ukryj przycisk "Nowa sprawa" gdy:
    // 1. Tworzymy nową sprawę (/dashboard/affairs/new)
    // 2. Jesteśmy w konkretnej sprawie (/dashboard/affairs/[id])
    const shouldHideNewAffairButton = 
      pathname === '/dashboard/affairs/new' ||
      (pathname.startsWith('/dashboard/affairs/') && pathname !== '/dashboard/affairs');
    
    return (
      <header className="h-[70px] bg-[#0A2463] backdrop-blur-md border-b border-[#0A2463]/30 flex items-center justify-between px-4 lg:px-8 fixed top-0 left-0 right-0 z-50 shadow-sm transition-all duration-300 overflow-hidden">
        {/* Pattern with pluses */}
        <div 
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"), radial-gradient(circle at 30% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`
          }}
        />
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
            e-<span className="font-normal">Porozumienie</span>
          </Link>
        </div>
      
        {/* Right side - New Affair button */}
        {!shouldHideNewAffairButton && (
          <div className="flex items-center gap-4 relative z-10">
            <Link
              href="/dashboard/affairs/new"
              className="bg-gradient-to-br from-white to-gray-100 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 text-gray-900 py-2.5 px-4 lg:px-5 rounded-full font-semibold transition-all duration-300 text-sm flex items-center gap-2 touch-target"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
              <span className="hidden sm:inline">Nowe porozumienie</span>
              <span className="sm:hidden">Nowa</span>
            </Link>
          </div>
        )}
      </header>
    );
}