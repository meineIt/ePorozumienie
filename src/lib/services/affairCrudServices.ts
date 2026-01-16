import { prismaWithTimeout } from '@/lib/prisma';
import { AffairWithDetails, AffairList } from '@/lib/types/prisma';
import { Affair } from '@/lib/types';
import { CreateAffairRequest } from '@/lib/api/types';
import { sanitizeString, sanitizeText } from '@/lib/utils/sanitize';
import { sendAffairInviteEmail } from '@/lib/utils/email';
import crypto from 'crypto'

/**
 * Tworzy nową sprawę
 */
export async function createAffair(
    data: CreateAffairRequest,
    creatorId: string
  ): Promise<{ affair: Affair; inviteToken: string | null }> {
    // Sanityzacja danych
    const sanitizedTitle = sanitizeString(data.title);
    const sanitizedCategory = data.category ? sanitizeString(data.category) : null;
    const sanitizedDescription = data.description ? sanitizeText(data.description) : null;
    const filesData = data.documents && data.documents.length > 0
      ? JSON.stringify(data.documents)
      : null;
  
    // Sprawdź czy użytkownik z podanym emailem istnieje
    const involvedUser = await prismaWithTimeout(async (client) => {
      return client.user.findUnique({
        where: { email: data.otherPartyEmail }
      });
    }, 30000);

    // Sprawdź czy użytkownik nie próbuje utworzyć sprawy ze sobą samym
    if (involvedUser && involvedUser.id === creatorId) {
      throw new Error('Nie możesz utworzyć sprawy ze sobą samym');
    }

    let affair: Affair;
    let inviteToken: string | null = null;
  
    if (involvedUser) {
      // Użytkownik istnieje - utwórz sprawę z przypisanym użytkownikiem
      affair = await prismaWithTimeout(async (client) => {
        return client.$transaction(async (tx) => {
          const createdAffair = await tx.affair.create({
            data: {
              title: sanitizedTitle,
              category: sanitizedCategory,
              description: sanitizedDescription,
              affairValue: data.disputeValue ? parseFloat(data.disputeValue.toString()) : null,
              files: filesData,
              creatorId,
              involvedUserId: involvedUser.id
            },
            include: {
              creator: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true
                }
              },
              involvedUser: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          });
  
          // Utwórz rekord uczestnika dla twórcy ze statusem WAITING
          await tx.affairParticipant.create({
            data: {
              userId: creatorId,
              affairId: createdAffair.id,
              status: 'WAITING',
              description: sanitizedDescription,
              files: filesData
            }
          });
  
          // Utwórz rekord uczestnika dla drugiej strony ze statusem REACTION_NEEDED
          await tx.affairParticipant.create({
            data: {
              userId: involvedUser.id,
              affairId: createdAffair.id,
              status: 'REACTION_NEEDED'
            }
          });
  
          return createdAffair;
        });
      }, 30000) as unknown as Affair;
    } else {
      // Użytkownik nie istnieje - utwórz sprawę z tokenem zaproszenia
      inviteToken = crypto.randomBytes(32).toString('base64url');
  
      affair = await prismaWithTimeout(async (client) => {
        return client.$transaction(async (tx) => {
          const createdAffair = await tx.affair.create({
            data: {
              title: sanitizedTitle,
              category: sanitizedCategory,
              description: sanitizedDescription,
              affairValue: data.disputeValue ? parseFloat(data.disputeValue.toString()) : null,
              files: filesData,
              creatorId,
              inviteToken,
              inviteTokenUsed: false,
            },
            include: {
              creator: {
                select: {
                  id: true,
                  email: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          });
  
          // Utwórz rekord uczestnika dla twórcy ze statusem WAITING
          await tx.affairParticipant.create({
            data: {
              userId: creatorId,
              affairId: createdAffair.id,
              status: 'WAITING',
              description: sanitizedDescription,
              files: filesData
            }
          });
  
          return createdAffair;
        });
      }, 30000) as unknown as Affair;
  
      // Wyślij email z zaproszeniem
      try {
        await sendAffairInviteEmail(data.otherPartyEmail, sanitizedTitle, inviteToken!);
      } catch (emailError) {
        console.error('Error sending invite email:', emailError);
        // Nie przerywamy - sprawa została utworzona
      }
    }
  
    return { affair, inviteToken };
  }


  /**
 * Pobiera listę spraw użytkownika
 */
export async function getUserAffairs(
    userId: string,
    statusFilter?: string
  ): Promise<AffairList[]> {
    const affairs = await prismaWithTimeout(async (client) => {
      return client.affair.findMany({
        where: {
          OR: [
            { creatorId: userId },
            { involvedUserId: userId }
          ]
        },
        include: {
          creator: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          involvedUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          participants: {
            where: {
              userId: userId
            },
            select: {
              status: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }, 30000) as AffairList[];
  
    // Filtruj po statusie jeśli podano
    if (statusFilter) {
      return affairs.filter(affair => {
        const participant = affair.participants[0];
        return participant?.status === statusFilter;
      });
    }
  
    return affairs;
  }

  export async function getAffairById(id: string, userId: string): Promise<AffairWithDetails | null> {
    const affair = await prismaWithTimeout(async (client) => {
      return client.affair.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          category: true,
          description: true,
          affairCreatedAt: true,
          affairValue: true,
          files: true,
          createdAt: true,
          updatedAt: true,
          creatorId: true,
          involvedUserId: true,
          inviteToken: true,
          inviteTokenUsed: true,
          aiAnalysis: true,
          aiAnalysisGeneratedAt: true,
          settlementProposalStatus: true,
          settlementAcceptedBy: true,
          settlementModificationRequests: true,
          creator: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          involvedUser: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true
            }
          },
          participants: {
            select: {
              id: true,
              userId: true,
              status: true,
              description: true,
              files: true,
              settlementAcceptedAt: true,
              settlementModificationRequestedAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true
                }
              }
            }
          }
        }
      });
    }, 30000) as AffairWithDetails | null;
  
    if (!affair) {
      return null;
    }
  
    // Sprawdź uprawnienia
    if (affair.creatorId !== userId && affair.involvedUserId !== userId) {
      // Sprawdź czy użytkownik jest uczestnikiem
      const isParticipant = affair.participants.some(p => p.userId === userId);
      if (!isParticipant) {
        return null; // Brak uprawnień
      }
    }
  
    return affair;
  }