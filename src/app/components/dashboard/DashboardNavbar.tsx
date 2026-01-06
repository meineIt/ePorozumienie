'use client';

import Link from 'next/link';

interface User {
  firstName: string;
}

export default function DashboardNavbar({ firstName }: User) {

    return (
      <header className="h-[70px] bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm ml-[230px]">
        {/* Left side - Welcome message */}
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-[#212121] font-['Space_Grotesk']">
            Witaj, {firstName || 'Użytkowniku'}!
          </h1>
        </div>
      
        {/* Right side - New Affair button and Notifications */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/affairs/new"
            className="bg-gradient-to-br from-[#0A2463] to-[#3E5C95] hover:shadow-lg hover:-translate-y-0.5 text-white py-2.5 px-5 rounded-full font-semibold transition-all duration-300 text-sm flex items-center gap-2"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"></path>
            </svg>
            Nowa sprawa
          </Link>
          <div className="relative w-10 h-10 rounded-full bg-[#F5F5F5] flex items-center justify-center cursor-pointer transition-colors hover:bg-[#EEEEEE]">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#616161]">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F44336]"></span>
          </div>
        </div>
      </header>
    );
}