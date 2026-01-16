'use client';

import { useState } from 'react';
import { PartyPositionSectionProps } from '@/lib/types';
import { parseDocuments } from '@/lib/utils/affairHelpers';
import { escapeHtml } from '@/lib/utils/escapeHtml';

export default function PartyPositionSection({
  participant,
  title,
  defaultExpanded = false,
}: PartyPositionSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const documents = parseDocuments(participant.files);

  return (
    <div className="card card-padding overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors touch-target -m-2 p-2 rounded-lg"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#0A2463] to-[#3E5C95] flex items-center justify-center text-white shadow-sm">
            <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
              <path d="M12 11v6"></path>
              <path d="M9 14h6"></path>
            </svg>
          </div>
          <h2 className="heading-section text-lg" style={{ fontSize: '1.25rem' }}>{title}</h2>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="space-y-4">
          <div className="bg-linear-to-br from-[#F5F5F7] to-white rounded-lg p-4 border border-gray-200/50">
            {participant.description && (
              <div className="mb-4">
                <div className="bg-white rounded-lg p-3 border border-gray-200/50">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {escapeHtml(participant.description)}
                  </p>
                </div>
              </div>
            )}
            
            {documents.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {documents.map((doc) => (
                  <a
                    key={doc.id}
                    href={`/api/files${doc.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200/50 hover:border-[#3E5C95] hover:shadow-sm transition-all text-sm"
                  >
                    <svg className="w-4 h-4 text-[#3E5C95] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-gray-700 truncate">{doc.name}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
