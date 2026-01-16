'use client';

import { AffairTabsProps } from '@/lib/types';

export default function AffairTabs({ activeTab, onTabChange }: AffairTabsProps) {
  const tabs = [
    {
      id: 'agreements' as const,
      label: 'Punkty zgodne',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
    {
      id: 'negotiations' as const,
      label: 'Punkty do negocjacji',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 8v4l3 3"></path>
        </svg>
      ),
    },
    {
      id: 'disagreements' as const,
      label: 'Rozbieżności',
      icon: (
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      ),
    },
  ];

  return (
    <div className="border-b border-gray-200/50 mb-4 sm:mb-6 overflow-x-auto">
      <div className="flex space-x-1 min-w-max sm:min-w-0">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm transition-all duration-200
                border-b-2 relative touch-target whitespace-nowrap
                ${isActive
                  ? 'text-[#0A2463] border-[#0A2463]'
                  : 'text-[#616161] border-transparent hover:text-[#0A2463] hover:border-gray-300 active:text-[#0A2463]'
                }
              `}
            >
              <span className={`shrink-0 ${isActive ? 'text-[#0A2463]' : 'text-[#616161]'}`}>
                {tab.icon}
              </span>
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

