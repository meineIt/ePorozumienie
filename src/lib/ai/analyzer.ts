import OpenAI from 'openai';
import { prismaWithTimeout } from '@/lib/prisma';
import { instructionPrompt } from './instructionPrompt';
import { AIAnalysis, AffairWithParticipants } from '@/lib/types';

function getOpenAIApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Nie ustawiono OPENAI_API_KEY');
    }
    throw new Error('Nie ustawiono OPENAI_API_KEY');
  }
  return apiKey;
}

const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
});

/**
 * Sprawdza czy obie strony mają stanowiska (description lub files)
 */
export function bothPartiesHavePositions(affair: AffairWithParticipants): boolean {
  if (!affair.involvedUserId) {
    return false; // Druga strona jeszcze nie dołączyła
  }

  const creatorParticipant = affair.participants.find(p => p.userId === affair.creatorId);
  const involvedParticipant = affair.participants.find(p => p.userId === affair.involvedUserId);

  const creatorHasPosition = creatorParticipant && 
    (creatorParticipant.description || creatorParticipant.files);
  const involvedHasPosition = involvedParticipant && 
    (involvedParticipant.description || involvedParticipant.files);

  return !!(creatorHasPosition && involvedHasPosition);
}

/**
 * Helper do opakowania operacji z timeoutem
 */
async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number,
  errorMessage: string
): Promise<T> {
  return Promise.race([
    operation(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(errorMessage)), timeoutMs)
    ),
  ]);
}

/**
 * Przygotowuje userPrompt dla OpenAI na podstawie stanowisk stron
 */
function preparePrompt(affair: AffairWithParticipants, modificationRequests?: string[]): string {
  const creatorParticipant = affair.participants.find(p => p.userId === affair.creatorId);
  const involvedParticipant = affair.participants.find(p => p.userId === affair.involvedUserId);

  if (!creatorParticipant || !involvedParticipant) {
    throw new Error('Brak danych uczestników');
  }

  let userPrompt = "";

  // Dodaj umowę jeśli jest dostępna
  if (affair.files) {
    try {
      const documents = JSON.parse(affair.files);
      if (Array.isArray(documents) && documents.length > 0) {
        userPrompt += `[Umowa]\n`;
        userPrompt += `Dokumenty umowy zostały przesłane. W analizie uwzględnij treść umowy na podstawie dostępnych dokumentów.\n\n`;
      }
    } catch (error) {
      console.error('Error parsing affair files for AI analysis:', error);
    }
  }

  if (affair.description) {
    userPrompt += `[Opis sprawy]\n${affair.description}\n\n`;
  }

  userPrompt += `[Stanowiska stron]\n\n`;

  userPrompt += `Stanowisko Strony A (${affair.creatorId === creatorParticipant.userId ? 'Twórca sprawy' : 'Druga strona'}):\n`;
  if (creatorParticipant.description) {
    userPrompt += `${creatorParticipant.description}\n`;
  }
  if (creatorParticipant.files) {
    userPrompt += `\n[Dokumenty przesłane przez Stronę A]\n`;
  }

  // dodaj ładowanie dokumentów strona A

  userPrompt += `\nStanowisko Strony B (${affair.involvedUserId === involvedParticipant.userId ? 'Druga strona' : 'Twórca sprawy'}):\n`;
  if (involvedParticipant.description) {
    userPrompt += `${involvedParticipant.description}\n`;
  }
  if (involvedParticipant.files) {
    userPrompt += `\n[Dokumenty przesłane przez Stronę B]\n`;
  }

  // dodaj ładowanie wylistowanie dokumentów strona B

  if (modificationRequests && modificationRequests.length > 0) {
    userPrompt += `\n[Propozycje zmian do poprzedniej wersji porozumienia]\n`;
    modificationRequests.forEach((request, index) => {
      userPrompt += `Propozycja zmiany ${index + 1}:\n${request}\n\n`;
    });
    userPrompt += `Uwzględnij powyższe propozycje zmian przy przygotowaniu nowej wersji porozumienia.\n`;
  }

  return userPrompt;
}

export async function analyzeAffairPositions(affairId: string, modificationRequests?: string[]): Promise<AIAnalysis> {
  const affair = await prismaWithTimeout(async (client) => {
    return client.affair.findUnique({
      where: { id: affairId },
      include: {
        participants: {
          select: {
            userId: true,
            description: true,
            files: true,
          },
        },
      },
    });
  }, 30000);

  if (!affair) {
    throw new Error('Sprawa nie została znaleziona');
  }

  if (!bothPartiesHavePositions(affair)) {
    throw new Error('Obie strony muszą mieć zapisane stanowiska');
  }

  const userPrompt = preparePrompt(affair, modificationRequests);

  try {
    const response = await withTimeout(
      () => openai.responses.create({
        model: process.env.OPENAI_MODEL || 'gpt-5.1',
        instructions: instructionPrompt,
        input: `Zwróć wynik jako JSON.\n\n${userPrompt}`,
        text: { format: { type: "json_object" } },
        reasoning: { effort: "medium" }
      }),
    500000,
    'Timeout: Analiza AI przekroczyła dozwolony czas (5 minut)'
  );

    const content = response.output_text;
    if (!content) {
      throw new Error('Brak odpowiedzi z OpenAI');
    }

    const analysis = JSON.parse(content) as AIAnalysis;

    if (!analysis.punkty_zgodne || !analysis.punkty_do_negocjacji || 
        !analysis.punkty_sporne || !analysis.propozycja_porozumienia) {
      throw new Error('Nieprawidłowa struktura odpowiedzi z OpenAI');
    }

    if (!Array.isArray(analysis.punkty_zgodne) || 
        !Array.isArray(analysis.punkty_do_negocjacji) || 
        !Array.isArray(analysis.punkty_sporne)) {
      throw new Error('Nieprawidłowy format danych z OpenAI');
    }

    return analysis;
  } catch (error) {
    console.error('Error analyzing affair positions:', error);
    if (error instanceof Error) {
      throw new Error(`Błąd podczas analizy AI: ${error.message}`);
    }
    throw new Error('Nieznany błąd podczas analizy AI');
  }
}
