'use client';

import { formatDate } from '@/lib/utils/format';
import TimelineIcon, { TimelineEventType } from '../shared/icons/TimelineIcon';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TimelineEventType;
}

interface AffairTimelineProps {
  events: TimelineEvent[];
}

export default function AffairTimeline({ events }: AffairTimelineProps) {

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
                  <TimelineIcon type={event.type} />
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

