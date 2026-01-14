'use client';

import { formatDate } from '@/lib/utils/format';
import TimelineIcon, { TimelineEventType } from '../shared/icons/TimelineIcon';
import { Affair } from '@/lib/types';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TimelineEventType;
}

interface AffairWithAnalysis extends Affair {
  aiAnalysis?: string | null;
  aiAnalysisGeneratedAt?: string | null;
}

interface AffairTimelineProps {
  affair: AffairWithAnalysis | null;
  currentUserId: string | null;
  settlementProposalStatus?: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  modificationRequestDate?: string | null; // Data prośby o modyfikację (gdy funkcja będzie zaimplementowana)
}

export default function AffairTimeline({ affair, currentUserId, settlementProposalStatus, modificationRequestDate }: AffairTimelineProps) {
  if (!affair) {
    return null;
  }

  const events: TimelineEvent[] = [];
  
  // Znajdź uczestników
  const creatorParticipant = affair.participants?.find(p => p.userId === affair.creator.id);
  const involvedParticipant = affair.involvedUser 
    ? affair.participants?.find(p => p.userId === affair.involvedUser?.id) 
    : null;

  const creatorHasPosition = creatorParticipant && (creatorParticipant.description || creatorParticipant.files);
  const involvedHasPosition = involvedParticipant && (involvedParticipant.description || involvedParticipant.files);

  // 1. Sprawa utworzona ze stanowiskiem pierwszej strony
  if (affair.createdAt) {
    events.push({
      id: '1',
      title: 'Sprawa utworzona ze stanowiskiem pierwszej strony',
      description: creatorHasPosition 
        ? `Sprawa została utworzona przez ${affair.creator.firstName} ${affair.creator.lastName} wraz ze stanowiskiem pierwszej strony.`
        : `Sprawa została utworzona przez ${affair.creator.firstName} ${affair.creator.lastName}.`,
      date: affair.createdAt,
      type: 'creation',
    });
  }

  // 2. Oczekujemy na stanowisko drugiej strony
  if (affair.involvedUser && !involvedHasPosition) {
    const waitingDate = involvedParticipant?.createdAt || affair.updatedAt || affair.createdAt;
    if (waitingDate) {
      events.push({
        id: '2',
        title: 'Oczekujemy na stanowisko drugiej strony',
        description: `Oczekujemy na wprowadzenie stanowiska przez ${affair.involvedUser.firstName} ${affair.involvedUser.lastName}.`,
        date: waitingDate,
        type: 'party-joined',
      });
    }
  }

  // 3. Druga strona wprowadziła swoje stanowisko
  if (involvedHasPosition && involvedParticipant) {
    const positionDate = involvedParticipant.updatedAt || involvedParticipant.createdAt || affair.updatedAt || affair.createdAt;
    if (positionDate) {
      events.push({
        id: '3',
        title: 'Druga strona wprowadziła swoje stanowisko',
        description: `${affair.involvedUser?.firstName} ${affair.involvedUser?.lastName} wprowadził(a) swoje stanowisko w sprawie.`,
        date: positionDate,
        type: 'party-added',
      });
    }
  }

  // 4. Wygenerowano propozycję porozumienia
  if (affair.aiAnalysis) {
    const analysisDate = affair.aiAnalysisGeneratedAt || affair.updatedAt || affair.createdAt;
    if (analysisDate) {
      events.push({
        id: '4',
        title: 'Wygenerowano propozycję porozumienia',
        description: 'Asystent AI przeanalizował stanowiska obu stron i wygenerował propozycję porozumienia.',
        date: analysisDate,
        type: 'proposal',
      });
    }
  }

  // 5. Prośba o modyfikację porozumienia
  if (modificationRequestDate && affair.aiAnalysis) {
    // Sprawdź która strona poprosiła o modyfikację
    const requestedBy = currentUserId === affair.creator.id 
      ? `${affair.creator.firstName} ${affair.creator.lastName}`
      : affair.involvedUser 
        ? `${affair.involvedUser.firstName} ${affair.involvedUser.lastName}`
        : 'jedna ze stron';
    
    events.push({
      id: '5',
      title: 'Prośba o modyfikację porozumienia',
      description: `${requestedBy} poprosił(a) o modyfikację propozycji porozumienia.`,
      date: modificationRequestDate,
      type: 'modification',
    });
  }

  // 6. Strona A zaakceptowała porozumienie (tylko jeśli nie wszystkie strony zaakceptowały)
  if (settlementProposalStatus === 'accepted-you') {
    // Sprawdź która strona zaakceptowała
    const acceptedBy = currentUserId === affair.creator.id 
      ? `${affair.creator.firstName} ${affair.creator.lastName}`
      : affair.involvedUser 
        ? `${affair.involvedUser.firstName} ${affair.involvedUser.lastName}`
        : 'jedna ze stron';
    
    const isCreator = acceptedBy === `${affair.creator.firstName} ${affair.creator.lastName}`;
    const acceptanceDate = affair.updatedAt || affair.createdAt;
    
    if (acceptanceDate) {
      events.push({
        id: '6',
        title: `${isCreator ? 'Strona A' : 'Strona B'} zaakceptowała porozumienie`,
        description: `${acceptedBy} zaakceptował(a) propozycję porozumienia.`,
        date: acceptanceDate,
        type: 'acceptance',
      });
    }
  }

  // 7. Zawarto porozumienie (obie strony zaakceptowały)
  if (settlementProposalStatus === 'accepted-all') {
    const settlementDate = affair.updatedAt || affair.createdAt;
    if (settlementDate) {
      events.push({
        id: '7',
        title: 'Zawarto porozumienie',
        description: 'Obie strony zaakceptowały propozycję porozumienia. Sprawa została zakończona.',
        date: settlementDate,
        type: 'acceptance',
      });
    }
  }

  // Sortuj wydarzenia chronologicznie
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (events.length === 0) {
    return null;
  }

  return (
    <div className="card card-padding">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200/60">
        <h3 className="heading-section text-base" style={{ fontSize: '1rem' }}>
          Historia sprawy
        </h3>
      </div>
      <div className="relative pl-8 sm:pl-10">
        {/* Timeline line */}
        <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3E5C95] via-[#3E5C95] to-transparent opacity-40"></div>
        
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-3 sm:gap-4">
              {/* Ikona SVG na linii osi czasu */}
              <div className="absolute -left-4 sm:-left-5 flex items-center justify-center z-10" style={{ 
                transform: 'translateX(-50%)'
              }}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#3E5C95] shadow-md flex items-center justify-center">
                  <div className="text-[#3E5C95] scale-75 sm:scale-90">
                    <TimelineIcon type={event.type} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
              
              {/* Event content */}
              <div className="flex-1 pl-2 sm:pl-3 pb-3 sm:pb-4">
                <div className="bg-gradient-to-br from-[#F5F5F7] to-white border border-gray-200/50 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-[#3E5C95]/30 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-1.5">
                    <h4 className="font-bold text-[#212121] pr-2" style={{ fontSize: '0.875rem', lineHeight: '1.25' }}>{event.title}</h4>
                    <span className="text-xs text-[#616161] whitespace-nowrap shrink-0 font-medium">
                      {formatDate(event.date, { includeYear: true })}
                    </span>
                  </div>
                  <p className="text-xs text-[#616161] leading-relaxed">{event.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

