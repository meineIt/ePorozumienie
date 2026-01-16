import { prismaWithTimeout } from '@/lib/prisma';
import { AffairWithParticipants } from '@/lib/types/prisma';
import { sanitizeText } from '@/lib/utils/sanitize';
import { analyzeAffairPositions, bothPartiesHavePositions } from '@/lib/ai/analyzer';
import { UpdatePartyPositionRequest } from '@/lib/api/types';

/**
 * Aktualizuje stanowisko strony
 */
export async function updatePartyPosition(
    id: string,
    userId: string,
    position: UpdatePartyPositionRequest
  ): Promise<void> {
    // Sprawdź czy sprawa istnieje i użytkownik ma uprawnienia
    const affair = await prismaWithTimeout(async (client) => {
      return client.affair.findUnique({
        where: { id },
        select: {
          id: true,
          creatorId: true,
          involvedUserId: true
        }
      });
    }, 30000);
  
    if (!affair) {
      throw new Error('Sprawa nie została znaleziona');
    }
  
    // Sprawdź uprawnienia
    if (affair.creatorId !== userId && affair.involvedUserId !== userId) {
      throw new Error('Brak uprawnień do aktualizacji tej sprawy');
    }
  
    // Sprawdź czy użytkownik jest uczestnikiem
    const participant = await prismaWithTimeout(async (client) => {
      return client.affairParticipant.findUnique({
        where: {
          userId_affairId: {
            userId: userId,
            affairId: id
          }
        }
      });
    }, 30000);
  
    if (!participant) {
      throw new Error('Nie jesteś uczestnikiem tej sprawy');
    }
  
    const filesData = position.documents && position.documents.length > 0
      ? JSON.stringify(position.documents)
      : null;
  
    const sanitizedDescription = position.description ? sanitizeText(position.description) : null;
  
    const otherUserId = affair.creatorId === userId
      ? affair.involvedUserId
      : affair.creatorId;
  
    await prismaWithTimeout(async (client) => {
      return client.$transaction(async (tx) => {
        // Aktualizuj stanowisko uczestnika
        await tx.affairParticipant.update({
          where: { id: participant.id },
          data: {
            description: sanitizedDescription,
            files: filesData
          }
        });
  
        // Sprawdź czy druga strona ma stanowisko
        let otherParticipant = null;
        if (otherUserId) {
          otherParticipant = await tx.affairParticipant.findUnique({
            where: {
              userId_affairId: {
                userId: otherUserId,
                affairId: id
              }
            }
          });
        }
  
        const otherHasPosition = otherParticipant &&
          (otherParticipant.description || otherParticipant.files);
  
        if (otherHasPosition) {
          // Obie strony mają stanowiska - ustaw status na awaiting-both
          await tx.affair.update({
            where: { id },
            data: {
              settlementProposalStatus: 'awaiting-both'
            }
          });
        } else {
          // Tylko jedna strona ma stanowisko - ustaw statusy
          await tx.affairParticipant.update({
            where: { id: participant.id },
            data: { status: 'WAITING' }
          });
  
          if (otherUserId) {
            if (otherParticipant) {
              await tx.affairParticipant.update({
                where: { id: otherParticipant.id },
                data: { status: 'REACTION_NEEDED' }
              });
            } else {
              await tx.affairParticipant.create({
                data: {
                  userId: otherUserId,
                  affairId: id,
                  status: 'REACTION_NEEDED'
                }
              });
            }
          }
        }
      });
    }, 30000);
  
    // Background task: Generate AI analysis if both parties have positions
    Promise.resolve().then(async () => {
      try {
        const affairWithParticipants = await prismaWithTimeout(async (client) => {
          return client.affair.findUnique({
            where: { id },
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
        }, 30000) as AffairWithParticipants | null;
  
        if (affairWithParticipants && bothPartiesHavePositions(affairWithParticipants)) {
          if (!affairWithParticipants.aiAnalysis) {
            const analysis = await analyzeAffairPositions(id);
  
            await prismaWithTimeout(async (client) => {
              return client.affair.update({
                where: { id },
                data: {
                  aiAnalysis: JSON.stringify(analysis),
                  aiAnalysisGeneratedAt: new Date(),
                  settlementProposalStatus: 'awaiting-both'
                }
              });
            }, 30000);
  
            await prismaWithTimeout(async (client) => {
              return client.affairParticipant.updateMany({
                where: { affairId: id },
                data: { status: 'REACTION_NEEDED' }
              });
            }, 30000);
          }
        }
      } catch (error) {
        console.error('Error generating AI analysis:', error);
      }
    }).catch((error) => {
      console.error('Unhandled error in AI analysis background task:', error);
    });
  }