/**
 * Wspólne typy TypeScript dla API
 */

/**
 * Typ dla odpowiedzi API
 */
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Typ dla paginowanych odpowiedzi
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Typy dla request body endpointów
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  inviteToken?: string | null;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
}

export interface CreateAffairRequest {
  title: string;
  category?: string | null;
  description?: string | null;
  disputeValue?: number | null;
  documents?: Array<{
    id?: string;
    name: string;
    size?: number;
    type?: string;
    category?: string;
    path?: string | null;
  }>;
  otherPartyEmail: string;
  otherPartyType?: string;
  otherPartyPerson?: string;
  otherPartyCompany?: string;
}

export interface UpdateAffairStatusRequest {
  status: 'REACTION_NEEDED' | 'WAITING' | 'DONE';
}

export interface UpdatePartyPositionRequest {
  description?: string | null;
  documents?: Array<{
    id?: string;
    name: string;
    size?: number;
    type?: string;
    category?: string;
    path?: string | null;
  }>;
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  subject?: string | null;
}

export interface DiscountRequest {
  email: string;
  name: string;
}

/**
 * Typy dla response endpointów
 */

export interface LoginResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  token: string;
  affairTitle?: string;
}

export interface ProfileResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface ProfileUpdateResponse {
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface AffairResponse {
  affair: {
    id: string;
    title: string;
    category: string | null;
    description: string | null;
    affairCreatedAt: Date | null;
    affairValue: number | null;
    files: string | null;
    createdAt: Date;
    updatedAt: Date;
    creatorId: string;
    involvedUserId: string | null;
    inviteToken: string | null;
    inviteTokenUsed: boolean;
    aiAnalysis: string | null;
    aiAnalysisGeneratedAt: Date | null;
    settlementProposalStatus: string | null;
    settlementAcceptedBy: string | null;
    settlementModificationRequests: string | null;
    status: string | null;
    creator: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    involvedUser: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } | null;
    participants: Array<{
      id: string;
      userId: string;
      status: string;
      description: string | null;
      files: string | null;
      settlementAcceptedAt: Date | null;
      settlementModificationRequestedAt: Date | null;
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
    }>;
  };
}

export interface AffairListResponse {
  affairs: Array<{
    id: string;
    title: string;
    category: string | null;
    description: string | null;
    affairCreatedAt: Date | null;
    affairValue: number | null;
    files: string | null;
    createdAt: Date;
    updatedAt: Date;
    creatorId: string;
    involvedUserId: string | null;
    inviteToken: string | null;
    inviteTokenUsed: boolean;
    status: string | null;
    creator: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    };
    involvedUser: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
    } | null;
  }>;
}

export interface CreateAffairResponse {
  message: string;
  affair: {
    id: string;
    title: string;
    category: string | null;
    createdAt: Date;
  };
}

export interface DocumentResponse {
  documents: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    category: string;
    path: string | null;
    affairId: string;
    affairTitle: string;
    affairCreatedAt: Date;
  }>;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParsedDocument {
  id?: string;
  name: string;
  size?: number;
  type?: string;
  category?: string;
  path?: string;
}