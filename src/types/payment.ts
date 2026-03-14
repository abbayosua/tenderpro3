// Payment, Milestone, and Document types for TenderPro

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  status: string;
  order: number;
  amount?: number;
  paymentStatus?: string;
  paidAt?: string;
  payments?: Payment[];
}

export interface Payment {
  id: string;
  milestoneId: string;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  notes?: string;
  proofUrl?: string;
  paidAt?: string;
  confirmedAt?: string;
  createdAt: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  uploadedBy: string;
  name: string;
  type: string;
  fileUrl: string;
  fileSize: number;
  description?: string;
  isApproved: boolean;
  approvedAt?: string;
  createdAt: string;
}

// Payment stats
export interface PaymentStats {
  totalBudget: number;
  totalPaid: number;
  percentage: number;
}

// Payment methods
export const PAYMENT_METHODS = [
  'Transfer Bank',
  'Cash',
  'Check',
  'Lainnya',
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number];

// Payment status
export const PAYMENT_STATUSES = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus = typeof PAYMENT_STATUSES[keyof typeof PAYMENT_STATUSES];

// Milestone status
export const MILESTONE_STATUSES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
} as const;

export type MilestoneStatus = typeof MILESTONE_STATUSES[keyof typeof MILESTONE_STATUSES];

// Document types
export const DOCUMENT_TYPES = [
  'KTP',
  'NPWP',
  'SIUP',
  'NIB',
  'Contract',
  'Invoice',
  'Receipt',
  'Blueprint',
  'Photo',
  'Other',
] as const;

export type DocumentType = typeof DOCUMENT_TYPES[number];

// Verification document types
export const VERIFICATION_DOCUMENT_TYPES = [
  'KTP',
  'NPWP',
  'SIUP',
  'NIB',
] as const;

export type VerificationDocumentType = typeof VERIFICATION_DOCUMENT_TYPES[number];
