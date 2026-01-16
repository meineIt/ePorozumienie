import { prismaWithTimeout } from '@/lib/prisma';
import { DocumentResponse } from '@/lib/api/types';
import { ParsedDocument } from '@/lib/api/types';

/**
 * Parsuje dokumenty z JSON string
 */
export function parseDocuments(filesJson: string | null): ParsedDocument[] {
  if (!filesJson) {
    return [];
  }

  try {
    const documents = JSON.parse(filesJson);
    if (Array.isArray(documents)) {
      return documents;
    }
    return [];
  } catch (error) {
    console.error('Error parsing documents:', error);
    return [];
  }
}

/**
 * Pobiera wszystkie dokumenty użytkownika ze wszystkich spraw
 */
export async function getUserDocuments(userId: string): Promise<DocumentResponse['documents']> {
  // Pobierz wszystkie sprawy użytkownika
  const affairs = await prismaWithTimeout(async (client) => {
    return client.affair.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { involvedUserId: userId }
        ]
      },
      select: {
        id: true,
        title: true,
        files: true,
        createdAt: true,
        participants: {
          where: {
            userId: userId
          },
          select: {
            files: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }, 30000);

  // Spłaszcz dokumenty z wszystkich spraw
  const allDocuments: DocumentResponse['documents'] = [];

  affairs.forEach((affair) => {
    // Dokumenty z Affair (dla kompatybilności wstecznej)
    if (affair.files) {
      const documents = parseDocuments(affair.files);
      documents.forEach((doc: ParsedDocument) => {
        allDocuments.push({
          id: doc.id || Math.random().toString(36).substr(2, 9),
          name: doc.name,
          size: doc.size || 0,
          type: doc.type || 'application/octet-stream',
          category: doc.category || 'Inne',
          path: doc.path || null,
          affairId: affair.id,
          affairTitle: affair.title,
          affairCreatedAt: affair.createdAt
        });
      });
    }

    // Dokumenty z AffairParticipant
    affair.participants.forEach((participant) => {
      if (participant.files) {
        const documents = parseDocuments(participant.files);
        documents.forEach((doc: ParsedDocument) => {
          allDocuments.push({
            id: doc.id || Math.random().toString(36).substr(2, 9),
            name: doc.name,
            size: doc.size || 0,
            type: doc.type || 'application/octet-stream',
            category: doc.category || 'Inne',
            path: doc.path || null,
            affairId: affair.id,
            affairTitle: affair.title,
            affairCreatedAt: affair.createdAt
          });
        });
      }
    });
  });

  return allDocuments;
}
