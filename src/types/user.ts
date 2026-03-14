// User-related types for TenderPro

export interface Contractor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  verificationStatus: string;
  company: {
    name: string;
    specialization?: string;
    experienceYears: number;
    rating: number;
    totalProjects: number;
    completedProjects: number;
    city?: string;
    province?: string;
    description?: string;
  } | null;
  portfolios: Array<{
    id: string;
    title: string;
    category: string;
    location?: string;
    budget?: number;
  }>;
}

export interface OwnerStats {
  totalProjects: number;
  activeProjects: number;
  openProjects: number;
  completedProjects: number;
  totalPendingBids: number;
  projects: Array<{
    id: string;
    title: string;
    category: string;
    location: string;
    budget: number;
    status: string;
    bidCount: number;
    bids: Array<{
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
    }>;
  }>;
}

export interface ContractorStats {
  totalBids: number;
  acceptedBids: number;
  pendingBids: number;
  rejectedBids: number;
  winRate: string;
  recentBids: Array<{
    id: string;
    price: number;
    status: string;
    project: { 
      id: string; 
      title: string; 
      category: string; 
      location: string; 
      budget: number; 
      owner: { name: string }; 
    };
  }>;
  availableProjects: Array<{
    id: string;
    title: string;
    category: string;
    location: string;
    budget: number;
    duration?: number;
    bidCount: number;
    hasBid: boolean;
    owner: { name: string; company?: string };
  }>;
}

// User verification status
export const VERIFICATION_STATUSES = {
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
} as const;

export type VerificationStatus = typeof VERIFICATION_STATUSES[keyof typeof VERIFICATION_STATUSES];

// User roles
export const USER_ROLES = {
  OWNER: 'OWNER',
  CONTRACTOR: 'CONTRACTOR',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Registration form data
export interface RegistrationFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  // Contractor fields
  companyName: string;
  companyType: string;
  npwp: string;
  nib: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  specialization: string;
  experienceYears: string;
  employeeCount: string;
  description: string;
  // Owner fields
  ownerCompanyName: string;
  ownerCompanyType: string;
  ownerNpwp: string;
  ownerAddress: string;
  ownerCity: string;
  ownerProvince: string;
  ownerPostalCode: string;
}

export const DEFAULT_REGISTRATION_FORM: RegistrationFormData = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  companyName: '',
  companyType: '',
  npwp: '',
  nib: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  specialization: '',
  experienceYears: '',
  employeeCount: '',
  description: '',
  ownerCompanyName: '',
  ownerCompanyType: '',
  ownerNpwp: '',
  ownerAddress: '',
  ownerCity: '',
  ownerProvince: '',
  ownerPostalCode: '',
};
