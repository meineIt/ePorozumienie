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

export interface AffairTabsProps {
  activeTab: 'agreements' | 'negotiations' | 'disagreements';
  onTabChange: (tab: 'agreements' | 'negotiations' | 'disagreements') => void;
}


export interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: TimelineEventType;
}

export interface AffairWithAnalysis extends Affair {
  aiAnalysis?: string | null;
  aiAnalysisGeneratedAt?: string | null;
}

export interface AffairTimelineProps {
  affair: AffairWithAnalysis | null;
  currentUserId: string | null;
  settlementProposalStatus?: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
}

export interface AnalysisPoint {
  id: string;
  title: string;
  description: string;
}

export interface AnalysisPointsProps {
  type: AnalysisType;
  points: AnalysisPoint[];
}

export interface PartyPositionFormProps {
  affairId: string;
  onSave: () => void;
}

export interface PartyPositionSectionProps {
  participant: AffairParticipant & { user: { id: string; firstName: string; lastName: string; email: string } };
  title: string;
  defaultExpanded?: boolean;
}

export interface SettlementFeedbackFormProps {
  affairId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export interface SettlementProposalProps {
  proposal?: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
}

export interface SettlementStatusCardProps {
  proposal?: {
    content: string;
    status: 'awaiting-you' | 'awaiting-other' | 'accepted-you' | 'accepted-all';
  };
  affairId: string;
  onFeedbackClick: () => void;
  onRefresh: () => void;
}

export interface SubmitButtonProps {
  loading: boolean;
  loadingText: string;
  text: string;
}

export interface SuccessMessageProps {
  message: string;
  onClose?: () => void;
}

export interface TrustedProfileButtonProps {
  text: string;
}

export interface ContactFormProps {
  userEmail?: string;
  userName?: string;
}

export interface DashboardNavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export interface DashboardSidebarProps {
  user: User | null;
  isOpen?: boolean;
  onClose?: () => void;
}


export interface DocumentCardProps {
  document: DocumentWithAffair;
  onClick: (doc: DocumentWithAffair) => void;
}

export interface DocumentFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export interface DocumentGridProps {
  documents: DocumentWithAffair[];
  onDocumentClick: (doc: DocumentWithAffair) => void;
}

export interface DocumentListViewProps {
  documents: DocumentWithAffair[];
  onDocumentClick: (doc: DocumentWithAffair) => void;
}

export interface DocumentRowProps {
  document: DocumentWithAffair;
  onClick: (doc: DocumentWithAffair) => void;
}

export interface DocumentViewerProps {
  document: DocumentWithAffair | null;
  isOpen: boolean;
  onClose: () => void;
  getDocumentUrl: (path: string) => string;
}

export interface CTASectionProps {
  onCTAClick: () => void;
}

export interface Step1BasicInfoProps {
  formData: AffairFormData;
  updateFormData: (data: Partial<AffairFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export interface Step2DocumentsProps {
  formData: AffairFormData;
  updateFormData: (data: Partial<AffairFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export interface Step3OtherPartyProps {
  formData: AffairFormData;
  updateFormData: (data: Partial<AffairFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export interface Step4SummaryProps {
  formData: AffairFormData;
  user: User;
  onPrev: () => void;
  onCreateAffair: () => void;
}

export interface StepIndicatorProps {
  currentStep: number;
}

export interface PopupModalRef {
  open: () => void;
}

type AnalysisType = 'agreements' | 'negotiations' | 'disagreements';
type TimelineEventType = 'creation' | 'party-added' | 'party-joined' | 'analysis' | 'proposal' | 'modification' | 'acceptance';


interface IconProps {
  className?: string;
  size?: number | string;
}

export interface AnalysisIconProps extends IconProps {
  type: AnalysisType;
}

export interface DocumentIconProps extends IconProps {
  category: string;
  type: string;
}

export interface TimelineIconProps extends IconProps {
  type: TimelineEventType;
}

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

export interface AffairWithParticipants {
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

export interface RateLimitConfig {
  limit: number;
  interval: number; // w milisekundach
}