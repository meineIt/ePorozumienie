export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Podstawowy interfejs dokumentu (używany w formularzach)
 */
export interface Document {
  id: string;
  name: string;
  size: number;
  type: string;
  category: string;
  path?: string | null;
}

/**
 * Rozszerzony interfejs dokumentu z informacjami o sprawie (używany w listach dokumentów)
 */
export interface DocumentWithAffair extends Document {
  affairId: string;
  affairTitle: string;
  affairCreatedAt: string;
}

export enum AffairStatus {
  REACTION_NEEDED = 'REACTION_NEEDED',
  WAITING = 'WAITING',
  DONE = 'DONE'
}

export interface AffairParticipant {
  id: string;
  userId: string;
  affairId: string;
  status: AffairStatus;
  description?: string | null;
  files?: string | null;
  createdAt: string;
  updatedAt: string;
  settlementAcceptedAt?: string | null;
  settlementModificationRequestedAt?: string | null;
}

export interface Affair {
  id: string;
  title: string;
  category: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  status?: AffairStatus | null;
  files?: string | null;
  aiAnalysis?: string | null;
  aiAnalysisGeneratedAt?: string | null;
  settlementProposalStatus?: string | null;
  settlementAcceptedBy?: string | null;
  settlementModificationRequests?: string | null;
  creator: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  involvedUser: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  participants?: Array<AffairParticipant & {
    user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  }>;
}

export interface AffairFormData {
  title: string;
  category: string;
  description: string;
  disputeDate: string;
  disputeValue: number | null;
  hasTimeLimit: boolean;
  timeDeadline: string;
  
  documents: Document[];
  
  otherPartyType: 'person' | 'company';
  otherPartyPerson?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  otherPartyCompany?: {
    companyName: string;
    contactPerson: string;
    nip: string;
    email: string;
    phone: string;
  };
  knowsOtherParty: boolean;
  customMessage: string;
  notifyEmail: boolean;
  notifySMS: boolean;
}

