'use client';

import { escapeHtml } from '@/lib/utils/escapeHtml';
import { SettlementProposalProps } from '@/lib/types';

export default function SettlementProposal({ proposal }: SettlementProposalProps) {
  if (!proposal) {
    return (
      <div className="card card-padding text-center">
        <h3 className="text-lg font-semibold mb-2 text-[#212121]">Brak propozycji porozumienia</h3>
        <p className="text-sm text-[#616161] max-w-md mx-auto leading-relaxed">
          Nasz asystent AI wygeneruje propozycję porozumienia, gdy druga strona przedstawi swoje stanowisko.
        </p>
      </div>
    );
  }

  return (
    <div className="card card-padding">
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200/60">
        <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" x2="8" y1="13" y2="13"></line>
            <line x1="16" x2="8" y1="17" y2="17"></line>
            <line x1="10" x2="8" y1="9" y2="9"></line>
          </svg>
        </div>
        <h3 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>Propozycja porozumienia</h3>
      </div>

      <div className="bg-linear-to-br from-[#F5F5F7] to-white border border-gray-200/50 rounded-lg p-4 mb-4 shadow-sm">
        <div className="prose prose-sm max-w-none">
          <div className="whitespace-pre-wrap text-sm text-[#616161] leading-relaxed">
            {escapeHtml(proposal.content)}
          </div>
        </div>
      </div>
    </div>
  );
}

