'use client';

import { formatDate } from '@/lib/utils/format';
import TimelineIcon from '../shared/icons/TimelineIcon';
import { escapeHtml } from '@/lib/utils/escapeHtml';
import { TimelineEvent, AffairTimelineProps } from '@/lib/types';

export default function AffairTimeline({ affair, settlementProposalStatus }: AffairTimelineProps) {
  if (!affair) {
    return null;
  }

  const events: TimelineEvent[] = [];
  
  const creatorParticipant = affair.participants?.find(p => p.userId === affair.creator.id);
  const involvedParticipant = affair.involvedUser 
    ? affair.participants?.find(p => p.userId === affair.involvedUser?.id) 
    : null;

  const creatorHasPosition = creatorParticipant && (creatorParticipant.description || creatorParticipant.files);
  const involvedHasPosition = involvedParticipant && (involvedParticipant.description || involvedParticipant.files);
  if (affair.createdAt && new Date(affair.createdAt).getTime()) {
    events.push({
      id: '1',
      title: 'Sprawa utworzona ze stanowiskiem pierwszej strony',
      description: creatorHasPosition 
        ? `Sprawa została utworzona przez ${escapeHtml(affair.creator.firstName)} ${escapeHtml(affair.creator.lastName)} wraz ze stanowiskiem pierwszej strony.`
        : `Sprawa została utworzona przez ${escapeHtml(affair.creator.firstName)} ${escapeHtml(affair.creator.lastName)}.`,
      date: affair.createdAt,
      type: 'creation',
    });
  }

  if (affair.involvedUser && !involvedHasPosition) {
    const waitingDate = involvedParticipant?.createdAt || affair.updatedAt;
    if (waitingDate && new Date(waitingDate).getTime()) {
      events.push({
        id: '2',
        title: 'Oczekujemy na stanowisko drugiej strony',
        description: `Oczekujemy na wprowadzenie stanowiska przez ${escapeHtml(affair.involvedUser.firstName)} ${escapeHtml(affair.involvedUser.lastName)}.`,
        date: waitingDate,
        type: 'party-joined',
      });
    }
  }

  if (involvedHasPosition && involvedParticipant) {
    const positionDate = involvedParticipant.updatedAt || involvedParticipant.createdAt;
    if (positionDate && new Date(positionDate).getTime()) {
      events.push({
        id: '3',
        title: 'Druga strona wprowadziła swoje stanowisko',
        description: `${escapeHtml(affair.involvedUser?.firstName || '')} ${escapeHtml(affair.involvedUser?.lastName || '')} wprowadził(a) swoje stanowisko w sprawie.`,
        date: positionDate,
        type: 'party-added',
      });
    }
  }

  if (affair.aiAnalysis && affair.aiAnalysisGeneratedAt) {
    if (new Date(affair.aiAnalysisGeneratedAt).getTime()) {
      events.push({
        id: '4',
        title: 'Wygenerowano propozycję porozumienia',
        description: 'Asystent AI przeanalizował stanowiska obu stron i wygenerował propozycję porozumienia.',
        date: affair.aiAnalysisGeneratedAt,
        type: 'proposal',
      });
    }
  }

  if (affair.aiAnalysis) {
    if (creatorParticipant?.settlementModificationRequestedAt && new Date(creatorParticipant.settlementModificationRequestedAt).getTime()) {
      events.push({
        id: '5a',
        title: 'Strona A poprosiła o modyfikację porozumienia',
        description: `${escapeHtml(affair.creator.firstName)} ${escapeHtml(affair.creator.lastName)} poprosił(a) o modyfikację propozycji porozumienia.`,
        date: creatorParticipant.settlementModificationRequestedAt,
        type: 'modification',
      });
    }
    
    if (involvedParticipant?.settlementModificationRequestedAt && new Date(involvedParticipant.settlementModificationRequestedAt).getTime()) {
      events.push({
        id: '5b',
        title: 'Strona B poprosiła o modyfikację porozumienia',
        description: `${escapeHtml(affair.involvedUser?.firstName || '')} ${escapeHtml(affair.involvedUser?.lastName || '')} poprosił(a) o modyfikację propozycji porozumienia.`,
        date: involvedParticipant.settlementModificationRequestedAt,
        type: 'modification',
      });
    }
  }

  if (affair.aiAnalysis) {
    if (creatorParticipant?.settlementAcceptedAt && new Date(creatorParticipant.settlementAcceptedAt).getTime()) {
      events.push({
        id: '6a',
        title: 'Strona A zaakceptowała porozumienie',
        description: `${escapeHtml(affair.creator.firstName)} ${escapeHtml(affair.creator.lastName)} zaakceptował(a) propozycję porozumienia.`,
        date: creatorParticipant.settlementAcceptedAt,
        type: 'acceptance',
      });
    }
    
    if (involvedParticipant?.settlementAcceptedAt && new Date(involvedParticipant.settlementAcceptedAt).getTime()) {
      events.push({
        id: '6b',
        title: 'Strona B zaakceptowała porozumienie',
        description: `${escapeHtml(affair.involvedUser?.firstName || '')} ${escapeHtml(affair.involvedUser?.lastName || '')} zaakceptował(a) propozycję porozumienia.`,
        date: involvedParticipant.settlementAcceptedAt,
        type: 'acceptance',
      });
    }
  }

  if (settlementProposalStatus === 'accepted-all') {
    const lastAcceptanceDate = creatorParticipant?.settlementAcceptedAt && involvedParticipant?.settlementAcceptedAt
      ? new Date(creatorParticipant.settlementAcceptedAt) > new Date(involvedParticipant.settlementAcceptedAt)
        ? creatorParticipant.settlementAcceptedAt
        : involvedParticipant.settlementAcceptedAt
      : creatorParticipant?.settlementAcceptedAt || involvedParticipant?.settlementAcceptedAt;
    
    if (lastAcceptanceDate && new Date(lastAcceptanceDate).getTime()) {
      events.push({
        id: '7',
        title: 'Zawarto porozumienie',
        description: 'Obie strony zaakceptowały propozycję porozumienia. Sprawa została zakończona.',
        date: lastAcceptanceDate,
        type: 'acceptance',
      });
    }
  }

  events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
        <div className="absolute left-4 sm:left-5 top-0 bottom-0 w-0.5 bg-linear-to-b from-[#3E5C95] via-[#3E5C95] to-transparent opacity-40"></div>
        
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="relative flex gap-3 sm:gap-4">
              <div className="absolute -left-4 sm:-left-5 flex items-center justify-center z-10" style={{ 
                transform: 'translateX(-50%)'
              }}>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white border-2 border-[#3E5C95] shadow-md flex items-center justify-center">
                  <div className="text-[#3E5C95] scale-75 sm:scale-90">
                    <TimelineIcon type={event.type} className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                </div>
              </div>
              
              <div className="flex-1 pl-2 sm:pl-3 pb-3 sm:pb-4">
                <div className="bg-linear-to-br from-[#F5F5F7] to-white border border-gray-200/50 rounded-lg p-3 shadow-sm hover:shadow-md hover:border-[#3E5C95]/30 transition-all duration-300">
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

