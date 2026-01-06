'use client';

import { formatDate } from '@/lib/utils/format';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'creation' | 'party-added' | 'party-joined' | 'analysis' | 'proposal' | 'acceptance';
}

interface AffairTimelineProps {
  events: TimelineEvent[];
}

export default function AffairTimeline({ events }: AffairTimelineProps) {
  const getEventIcon = (type: TimelineEvent['type']) => {
    const iconClass = "w-5 h-5";
    switch (type) {
      case 'creation':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
          </svg>
        );
      case 'party-added':
      case 'party-joined':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'analysis':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"></path>
          </svg>
        );
      case 'proposal':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
          </svg>
        );
      case 'acceptance':
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        );
      default:
        return (
          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        );
    }
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(33,150,243,0.1)] flex items-center justify-center text-[#2196F3]">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[#212121]">Brak historii</h3>
        <p className="text-[#616161] max-w-md mx-auto">
          Historia wydarzeń sprawy będzie wyświetlana tutaj.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-[#212121] mb-6 pb-4 border-b border-gray-200">
        Historia sprawy
      </h3>
      <div className="relative pl-8">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex gap-4">
              {/* Timeline marker */}
              <div className="absolute left-0 w-8 h-8 rounded-full bg-[#3E5C95] border-4 border-white flex items-center justify-center z-10">
                <div className="text-white">
                  {getEventIcon(event.type)}
                </div>
              </div>
              
              {/* Event content */}
              <div className="flex-1 pl-4 pb-6">
                <div className="bg-[#FAFAFA] border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-[#212121]">{event.title}</h4>
                    <span className="text-xs text-[#616161] whitespace-nowrap ml-4">
                      {formatDate(event.date, { includeYear: true })}
                    </span>
                  </div>
                  <p className="text-sm text-[#616161] leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

