import { Affair, AnalysisPoint } from '@/lib/types';
import { bothPartiesHavePositions } from './affairHelpers';

interface AIAnalysisPoint {
  referencja: string;
  podsumowanie: string;
  uzasadnienie: string;
}

interface AIAnalysis {
  punkty_zgodne: AIAnalysisPoint[];
  punkty_do_negocjacji: AIAnalysisPoint[];
  punkty_sporne: AIAnalysisPoint[];
  propozycja_porozumienia: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
}

export interface ParsedAnalysisData {
  agreements: Array<{ id: string; title: string; description: string }>;
  negotiations: Array<{ id: string; title: string; description: string }>;
  disagreements: Array<{ id: string; title: string; description: string }>;
}

export interface ParsedAIAnalysis {
  analysisData: ParsedAnalysisData;
  settlementProposal: { content: string; status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all' } | undefined;
  isAnalyzing: boolean;
}

/**
 * Mapuje punkty analizy AI do formatu komponentów
 */
function mapToComponentFormat(points: AIAnalysisPoint[]): Array<{ id: string; title: string; description: string }> {
  return points.map((point, index) => ({
    id: `point-${index}`,
    title: point.referencja.replace(/^\[|\]$/g, ''), // Usuń nawiasy kwadratowe z początku i końca
    description: `${point.podsumowanie}\n\nUzasadnienie: ${point.uzasadnienie}`,
  }));
}

/**
 * Mapuje status propozycji porozumienia z bazy danych do formatu UI
 */
export function mapSettlementProposalStatus(
  affair: Affair,
  userId: string | null,
  analysis: AIAnalysis | null
): 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all' {
  if (!affair.settlementProposalStatus) {
    return analysis?.propozycja_porozumienia?.status || 'awaiting-you';
  }

  const currentUserParticipant = affair.participants?.find(p => p.userId === userId);
  const isCreator = userId === affair.creator.id;

  switch (affair.settlementProposalStatus) {
    case 'awaiting-both':
      return 'awaiting-you';
    case 'awaiting-creator':
      return isCreator ? 'awaiting-you' : 'awaiting-other';
    case 'awaiting-involved':
      return isCreator ? 'awaiting-other' : 'awaiting-you';
    case 'accepted-all':
      return 'accepted-all';
    case 'modification-requested':
      const hasModificationRequest = currentUserParticipant?.settlementModificationRequestedAt !== null;
      return hasModificationRequest ? 'awaiting-other' : 'awaiting-you';
    default:
      return analysis?.propozycja_porozumienia?.status || 'awaiting-you';
  }
}

/**
 * Parsuje analizę AI z obiektu Affair do formatu używanego przez komponenty
 */
export function parseAIAnalysis(affair: Affair | null, userId: string | null): ParsedAIAnalysis {
  if (!affair) {
    return {
      analysisData: { agreements: [], negotiations: [], disagreements: [] },
      settlementProposal: undefined,
      isAnalyzing: false,
    };
  }

  const bothHavePositions = bothPartiesHavePositions(affair);
  const isAnalyzing = !!(bothHavePositions && !affair.aiAnalysis);

  if (!affair.aiAnalysis) {
    return {
      analysisData: { agreements: [], negotiations: [], disagreements: [] },
      settlementProposal: undefined,
      isAnalyzing,
    };
  }

  try {
    const analysis: AIAnalysis = JSON.parse(affair.aiAnalysis);
    
    const proposalStatus = mapSettlementProposalStatus(affair, userId, analysis);

    return {
      analysisData: {
        agreements: mapToComponentFormat(analysis.punkty_zgodne || []),
        negotiations: mapToComponentFormat(analysis.punkty_do_negocjacji || []),
        disagreements: mapToComponentFormat(analysis.punkty_sporne || []),
      },
      settlementProposal: analysis.propozycja_porozumienia ? {
        ...analysis.propozycja_porozumienia,
        status: proposalStatus
      } : undefined,
      isAnalyzing: false,
    };
  } catch (error) {
    console.error('Error parsing AI analysis:', error);
    return {
      analysisData: { agreements: [], negotiations: [], disagreements: [] },
      settlementProposal: undefined,
      isAnalyzing: false,
    };
  }
}
