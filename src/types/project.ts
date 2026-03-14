// Project and Bid related types for TenderPro

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  duration?: number;
  status: string;
  viewCount: number;
  owner: { name: string; isVerified: boolean; company?: string; };
  bidCount: number;
}

export interface Bid {
  id: string;
  price: number;
  duration: number;
  status: string;
  proposal: string;
  contractor: {
    id: string;
    name: string;
    isVerified: boolean;
    company?: string;
    rating?: number;
    totalProjects?: number;
  };
}

export interface ProjectWithBids extends Project {
  bids: Bid[];
}

// Form types for creating/editing projects
export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  duration: string;
  requirements: string;
}

// Project category options
export const PROJECT_CATEGORIES = [
  'Pembangunan Baru',
  'Renovasi',
  'Interior',
  'Komersial',
  'Industri',
  'Lainnya',
] as const;

export type ProjectCategory = typeof PROJECT_CATEGORIES[number];

// Project status enum values
export const PROJECT_STATUSES = {
  DRAFT: 'DRAFT',
  OPEN: 'OPEN',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type ProjectStatus = typeof PROJECT_STATUSES[keyof typeof PROJECT_STATUSES];

// Bid status enum values
export const BID_STATUSES = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  WITHDRAWN: 'WITHDRAWN',
} as const;

export type BidStatus = typeof BID_STATUSES[keyof typeof BID_STATUSES];
