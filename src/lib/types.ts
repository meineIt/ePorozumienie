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

export interface AffairFormData {
  // Step 1
  title: string;
  category: string;
  description: string;
  disputeDate: string;
  disputeValue: number | null;
  hasTimeLimit: boolean;
  timeDeadline: string;
  
  // Step 2
  documents: Document[];
  
  // Step 3
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

