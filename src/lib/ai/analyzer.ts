import OpenAI from 'openai';
import { prisma, prismaWithTimeout } from '@/lib/prisma';

function getOpenAIApiKey(): string {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('OPENAI_API_KEY environment variable is required in production');
    }
    throw new Error('OPENAI_API_KEY environment variable is required. Please set it in your .env file');
  }
  return apiKey;
}

const openai = new OpenAI({
  apiKey: getOpenAIApiKey(),
});

export interface AnalysisPoint {
  referencja: string;
  podsumowanie: string;
  uzasadnienie: string;
}

export interface AIAnalysis {
  punkty_zgodne: AnalysisPoint[];
  punkty_do_negocjacji: AnalysisPoint[];
  punkty_sporne: AnalysisPoint[];
  propozycja_porozumienia: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
}

interface AffairWithParticipants {
  id: string;
  title: string;
  description: string | null;
  files: string | null;
  creatorId: string;
  involvedUserId: string | null;
  participants: Array<{
    userId: string;
    description: string | null;
    files: string | null;
  }>;
}

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
 * Przygotowuje prompt dla OpenAI na podstawie stanowisk stron
 */
function preparePrompt(affair: AffairWithParticipants, modificationRequests?: string[]): string {
  const creatorParticipant = affair.participants.find(p => p.userId === affair.creatorId);
  const involvedParticipant = affair.participants.find(p => p.userId === affair.involvedUserId);

  if (!creatorParticipant || !involvedParticipant) {
    throw new Error('Brak danych uczestników');
  }

  let prompt = `# Prompt systemowy - zachowanie chatu
Analyze a supplied contract and the positions of two parties, then identify and summarize: (1) disputed points; (2) negotiable points; (3) points of agreement; and (4) propose a settlement agreement.
Read and compare both the contract and each side's position statement carefully to identify all areas of overlap, conflict, or potential negotiation. Use thorough, step-by-step reasoning before making any classifications; only after analysis should you assign points to a category.
If information is ambiguous, make a note and clarify your reasoning.
Continue reasoning and comparison until all relevant contractual items are categorized.

## Steps:
1. Parse the supplied contract clause by clause (if provided).
2. Analyze each party's position for each relevant point.
3. For each clause, reason through:
- Do both sides agree unambiguously? If yes, mark as "agreed."
- Is there direct disagreement or clearly opposed positions? If yes, mark as "disputed."
- Is there partial overlap, ambiguity, or an expressed openness to negotiation? If yes, mark as "negotiable."
4. Only after this step-by-step analysis, assign the clause to one of the three categories, giving brief reasoning for each categorization.
5. Based on the analysis, propose a concrete settlement agreement that addresses the disputed and negotiable points while respecting the agreed points.

## Output Format:
Return the result as a JSON object in Polish, with four keys: "punkty_sporne" (disputed points), "punkty_do_negocjacji" (negotiable points), "punkty_zgodne" (agreed points), and "propozycja_porozumienia" (settlement proposal).

Each of the first three keys should contain a list of objects, each object describing:
- the clause or point reference,
- a short summary,
- the main reasoning for classification.

The "propozycja_porozumienia" key should contain an object with:
- "content": a detailed settlement proposal text in Polish that addresses all disputed and negotiable points,
- "status": "awaiting-you" (indicating the proposal is awaiting acceptance).

Example of desired output (in Polish):
{
  "punkty_sporne": [
    {
      "referencja": "[§2 Umowy, Wynagrodzenie]",
      "podsumowanie": "Strona A żąda wyższej stawki, strona B nie akceptuje.",
      "uzasadnienie": "Pozycje stron są sprzeczne (Strona A: 5000 zł, Strona B: 3000 zł)."
    }
  ],
  "punkty_do_negocjacji": [
    {
      "referencja": "[§4 Umowy, Termin realizacji]",
      "podsumowanie": "Strony zbliżone w zakresie terminu końcowego, lecz wskazują inne daty rozpoczęcia.",
      "uzasadnienie": "Strona A proponuje start 1 lipca, Strona B jest otwarta na 1-15 lipca."
    }
  ],
  "punkty_zgodne": [
    {
      "referencja": "[§6 Umowy, Odpowiedzialność]",
      "podsumowanie": "Brak zastrzeżeń obu stron do zapisów dotyczących odpowiedzialności.",
      "uzasadnienie": "Obie strony wyraziły zgodę na treść klauzuli."
    }
  ],
  "propozycja_porozumienia": {
    "content": "Na podstawie analizy stanowisk obu stron, proponuję następujące rozwiązanie: [szczegółowa propozycja porozumienia w języku polskim, która adresuje wszystkie punkty sporne i do negocjacji, uwzględniając punkty zgodne]",
    "status": "awaiting-you"
  }
}

## Important Reminder
Your objective is to:
- Analyze the contract (if provided) and both parties' positions;
- Reason step by step before assigning to categories;
- Return a JSON object (in Polish) summarizing all disputed, negotiable, and agreed points, each with clear justification and references;
- Propose a concrete, detailed settlement agreement that can serve as a basis for negotiation.

# Chat input
`;

  // Dodaj umowę jeśli jest dostępna
  if (affair.files) {
    try {
      const documents = JSON.parse(affair.files);
      if (Array.isArray(documents) && documents.length > 0) {
        prompt += `[Umowa]\n`;
        prompt += `Dokumenty umowy zostały przesłane. W analizie uwzględnij treść umowy na podstawie dostępnych dokumentów.\n\n`;
      }
    } catch {
    }
  }

  if (affair.description) {
    prompt += `[Opis sprawy]\n${affair.description}\n\n`;
  }

  prompt += `[Stanowiska stron]\n\n`;

  prompt += `Stanowisko Strony A (${affair.creatorId === creatorParticipant.userId ? 'Twórca sprawy' : 'Druga strona'}):\n`;
  if (creatorParticipant.description) {
    prompt += `${creatorParticipant.description}\n`;
  }
  if (creatorParticipant.files) {
    prompt += `\n[Dokumenty przesłane przez Stronę A]\n`;
  }

  prompt += `\nStanowisko Strony B (${affair.involvedUserId === involvedParticipant.userId ? 'Druga strona' : 'Twórca sprawy'}):\n`;
  if (involvedParticipant.description) {
    prompt += `${involvedParticipant.description}\n`;
  }
  if (involvedParticipant.files) {
    prompt += `\n[Dokumenty przesłane przez Stronę B]\n`;
  }

  if (modificationRequests && modificationRequests.length > 0) {
    prompt += `\n[Propozycje zmian do poprzedniej wersji porozumienia]\n`;
    modificationRequests.forEach((request, index) => {
      prompt += `Propozycja zmiany ${index + 1}:\n${request}\n\n`;
    });
    prompt += `Uwzględnij powyższe propozycje zmian przy przygotowaniu nowej wersji porozumienia.\n`;
  }

  return prompt;
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

  const prompt = preparePrompt(affair, modificationRequests);

  try {
    const completion = await withTimeout(
      () => openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Jesteś ekspertem prawnym specjalizującym się w analizie umów i mediacji. Analizujesz stanowiska stron i przygotowujesz szczegółową analizę oraz propozycję porozumienia. Zawsze zwracasz poprawny JSON w języku polskim.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3, // Niższa temperatura dla bardziej spójnych wyników
      }),
      60000, // 60 sekund timeout dla AI analysis
      'Timeout: Analiza AI przekroczyła dozwolony czas (60 sekund)'
    );

    const content = completion.choices[0]?.message?.content;
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
