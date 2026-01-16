import { prismaWithTimeout } from '@/lib/prisma';
import { UpdateAffairStatusRequest } from '@/lib/api/types';

/**
 * Aktualizuje status sprawy
 */
export async function updateAffairStatus(
    id: string,
    userId: string,
    status: UpdateAffairStatusRequest['status']
  ): Promise<void> {
    // Sprawdź czy sprawa istnieje
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
      // Sprawdź czy użytkownik jest uczestnikiem
      const existingParticipant = await prismaWithTimeout(async (client) => {
        return client.affairParticipant.findUnique({
          where: {
            userId_affairId: {
              userId: userId,
              affairId: id
            }
          }
        });
      }, 30000);
  
      if (!existingParticipant) {
        throw new Error('Brak uprawnień: nie jesteś uczestnikiem tej sprawy');
      }
    }
  
    await prismaWithTimeout(async (client) => {
      return client.$transaction(async (tx) => {
        // Znajdź lub utwórz uczestnika
        const participant = await tx.affairParticipant.findUnique({
          where: {
            userId_affairId: {
              userId: userId,
              affairId: id
            }
          }
        });
  
        if (participant) {
          await tx.affairParticipant.update({
            where: { id: participant.id },
            data: { status }
          });
        } else {
          await tx.affairParticipant.create({
            data: {
              userId: userId,
              affairId: id,
              status
            }
          });
        }
  
        // Jeśli status to WAITING, ustaw drugą stronę na REACTION_NEEDED
        if (status === 'WAITING') {
          const otherUserId = affair.creatorId === userId
            ? affair.involvedUserId
            : affair.creatorId;
  
          if (otherUserId) {
            const otherParticipant = await tx.affairParticipant.findUnique({
              where: {
                userId_affairId: {
                  userId: otherUserId,
                  affairId: id
                }
              }
            });
  
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
  }