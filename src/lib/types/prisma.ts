import { Prisma } from '@prisma/client';

/**
 * Typy dla często używanych Prisma queries
 */

export type AffairWithDetails = Prisma.AffairGetPayload<{
  select: {
    id: true;
    title: true;
    category: true;
    description: true;
    affairCreatedAt: true;
    affairValue: true;
    files: true;
    createdAt: true;
    updatedAt: true;
    creatorId: true;
    involvedUserId: true;
    inviteToken: true;
    inviteTokenUsed: true;
    aiAnalysis: true;
    aiAnalysisGeneratedAt: true;
    settlementProposalStatus: true;
    settlementAcceptedBy: true;
    settlementModificationRequests: true;
    creator: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
      };
    };
    involvedUser: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
      };
    };
    participants: {
      select: {
        id: true;
        userId: true;
        status: true;
        description: true;
        files: true;
        settlementAcceptedAt: true;
        settlementModificationRequestedAt: true;
        user: {
          select: {
            id: true;
            firstName: true;
            lastName: true;
            email: true;
          };
        };
      };
    };
  };
}>;

export type AffairWithParticipants = Prisma.AffairGetPayload<{
  include: {
    participants: {
      select: {
        userId: true;
        description: true;
        files: true;
      };
    };
  };
}>;

export type UserWithProfile = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    firstName: true;
    lastName: true;
    createdAt: true;
    updatedAt: true;
  };
}>;

export type AffairList = Prisma.AffairGetPayload<{
  include: {
    creator: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
      };
    };
    involvedUser: {
      select: {
        id: true;
        email: true;
        firstName: true;
        lastName: true;
      };
    };
    participants: {
      where: {
        userId: string;
      };
      select: {
        status: true;
      };
    };
  };
}>;
