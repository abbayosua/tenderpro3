// Notification and Favorite types for TenderPro

import { Contractor } from './user';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  relatedId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Favorite {
  id: string;
  notes?: string;
  createdAt: string;
  contractor: Contractor;
}

// Notification types
export const NOTIFICATION_TYPES = {
  BID_RECEIVED: 'BID_RECEIVED',
  BID_ACCEPTED: 'BID_ACCEPTED',
  BID_REJECTED: 'BID_REJECTED',
  PROJECT_UPDATE: 'PROJECT_UPDATE',
  PROJECT_AWARDED: 'PROJECT_AWARDED',
  MILESTONE_COMPLETED: 'MILESTONE_COMPLETED',
  PAYMENT_RECEIVED: 'PAYMENT_RECEIVED',
  VERIFICATION_UPDATE: 'VERIFICATION_UPDATE',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];
