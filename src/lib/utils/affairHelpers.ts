import { Affair, AffairParticipant } from '@/lib/types';

export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  path: string;
}

/**
 * Parsuje string JSON z dokumentami do tablicy obiektów
 */
export function parseDocuments(filesString: string | null | undefined): Document[] {
  if (!filesString) return [];
  try {
    const parsed = JSON.parse(filesString);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error parsing documents:', error);
    return [];
  }
}

/**
 * Sprawdza czy uczestnik ma stanowisko (description lub files)
 */
export function hasPosition(participant: AffairParticipant | null | undefined): boolean {
  return !!(participant && (participant.description || participant.files));
}

/**
 * Znajduje uczestnika dla danego użytkownika
 */
export function getParticipant(
  affair: Affair | null,
  userId: string | null
): AffairParticipant & { user: { id: string; firstName: string; lastName: string; email: string } } | undefined {
  if (!affair || !userId || !affair.participants) return undefined;
  return affair.participants.find(p => p.userId === userId);
}

/**
 * Znajduje uczestnika drugiej strony
 */
export function getOtherPartyParticipant(
  affair: Affair | null,
  userId: string | null
): (AffairParticipant & { user: { id: string; firstName: string; lastName: string; email: string } }) | undefined {
  if (!affair || !userId || !affair.participants) return undefined;
  return affair.participants.find(p => p.userId !== userId);
}

/**
 * Sprawdza czy obie strony mają stanowiska
 * Wrapper dla funkcji z analyzer.ts, dostosowany do typu Affair
 */
export function bothPartiesHavePositions(affair: Affair | null): boolean {
  if (!affair || !affair.participants || !affair.involvedUser) {
    return false;
  }

  const creatorParticipant = affair.participants.find(p => p.userId === affair.creator.id);
  const involvedParticipant = affair.participants.find(p => p.userId === affair.involvedUser?.id);

  return hasPosition(creatorParticipant) && hasPosition(involvedParticipant);
}
