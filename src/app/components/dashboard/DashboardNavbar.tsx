'use client';

import Link from 'next/link';

export default function DashboardNavbar() {
    return (
        <header className="h-[70px] bg-white border-b border-gray-200 flex items-center px-8 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-[#212121]">Pulpit</h2>
          </div>
          <div className="ml-auto flex items-center gap-4">
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