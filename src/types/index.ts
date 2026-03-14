// Re-export all types from TenderPro

// User types
export type { 
  Contractor, 
  OwnerStats, 
  ContractorStats, 
  RegistrationFormData,
} from './user';
export { 
  VERIFICATION_STATUSES, 
  USER_ROLES, 
  DEFAULT_REGISTRATION_FORM,
} from './user';
export type { 
  VerificationStatus, 
  UserRole 
} from './user';

// Project types
export type { 
  Project, 
  Bid, 
  ProjectWithBids, 
  ProjectFormData,
  ProjectCategory,
  ProjectStatus,
  BidStatus,
} from './project';
export { 
  PROJECT_CATEGORIES, 
  PROJECT_STATUSES, 
  BID_STATUSES,
} from './project';

// Notification types
export type { 
  Notification, 
  Favorite,
  NotificationType,
} from './notification';
export { NOTIFICATION_TYPES } from './notification';

// Payment types
export type { 
  Milestone, 
  Payment, 
  ProjectDocument, 
  PaymentStats,
  PaymentMethod,
  PaymentStatus,
  MilestoneStatus,
  DocumentType,
  VerificationDocumentType,
} from './payment';
export { 
  PAYMENT_METHODS, 
  PAYMENT_STATUSES, 
  MILESTONE_STATUSES,
  DOCUMENT_TYPES,
  VERIFICATION_DOCUMENT_TYPES,
} from './payment';
