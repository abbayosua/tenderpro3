// Application constants for TenderPro

import type { ChartConfig } from '@/components/ui/chart'

// Chart configurations
export const OWNER_CHART_CONFIG: ChartConfig = {
  primary: { label: 'Pembangunan Baru', color: 'hsl(var(--primary))' },
  chart2: { label: 'Renovasi', color: 'hsl(var(--chart-2))' },
  chart3: { label: 'Komersial', color: 'hsl(var(--chart-3))' },
  chart4: { label: 'Interior', color: 'hsl(var(--chart-4))' },
  muted: { label: 'Lainnya', color: 'hsl(var(--muted-foreground))' },
  proyek: { label: 'Proyek Baru', color: 'hsl(var(--primary))' },
  selesai: { label: 'Proyek Selesai', color: 'hsl(var(--chart-4))' },
}

// Project category data for charts
export const PROJECT_CATEGORY_DATA = [
  { name: 'Pembangunan Baru', value: 35, fill: 'hsl(var(--primary))' },
  { name: 'Renovasi', value: 25, fill: 'hsl(var(--chart-2))' },
  { name: 'Komersial', value: 20, fill: 'hsl(var(--chart-3))' },
  { name: 'Interior', value: 15, fill: 'hsl(var(--chart-4))' },
  { name: 'Lainnya', value: 5, fill: 'hsl(var(--muted-foreground))' },
]

// Monthly progress sample data for charts
export const MONTHLY_PROGRESS_DATA = [
  { month: 'Jan', proyek: 2, selesai: 1 },
  { month: 'Feb', proyek: 3, selesai: 2 },
  { month: 'Mar', proyek: 4, selesai: 3 },
  { month: 'Apr', proyek: 3, selesai: 2 },
  { month: 'Mei', proyek: 5, selesai: 4 },
  { month: 'Jun', proyek: 4, selesai: 3 },
]

// Company type options
export const COMPANY_TYPES = [
  'PT',
  'CV',
  'Firma',
  'Perorangan',
  'Lainnya',
] as const

// Specialization options for contractors
export const SPECIALIZATIONS = [
  'Pembangunan Baru',
  'Renovasi',
  'Interior Design',
  'Eksterior',
  'Landscape',
  'Komersial',
  'Industri',
  'Residensial',
] as const

// Indonesian provinces
export const PROVINCES = [
  'Aceh',
  'Sumatera Utara',
  'Sumatera Barat',
  'Riau',
  'Jambi',
  'Sumatera Selatan',
  'Bengkulu',
  'Lampung',
  'Kepulauan Bangka Belitung',
  'Kepulauan Riau',
  'DKI Jakarta',
  'Jawa Barat',
  'Jawa Tengah',
  'DI Yogyakarta',
  'Jawa Timur',
  'Banten',
  'Bali',
  'Nusa Tenggara Barat',
  'Nusa Tenggara Timur',
  'Kalimantan Barat',
  'Kalimantan Tengah',
  'Kalimantan Selatan',
  'Kalimantan Timur',
  'Kalimantan Utara',
  'Sulawesi Utara',
  'Sulawesi Tengah',
  'Sulawesi Selatan',
  'Sulawesi Tenggara',
  'Gorontalo',
  'Sulawesi Barat',
  'Maluku',
  'Maluku Utara',
  'Papua',
  'Papua Barat',
] as const

// App configuration
export const APP_CONFIG = {
  name: 'TenderPro',
  description: 'Platform Tender Konstruksi Terpercaya',
  version: '1.0.0',
  currency: 'IDR',
  locale: 'id-ID',
} as const

// Pagination defaults
export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const

// API endpoints
export const API_ENDPOINTS = {
  // Auth
  login: '/api/auth/login',
  register: '/api/auth/register',
  
  // User
  user: '/api/user',
  stats: '/api/stats',
  
  // Projects
  projects: '/api/projects',
  milestones: '/api/milestones',
  
  // Bids
  bids: '/api/bids',
  
  // Contractors
  contractors: '/api/contractors',
  
  // Documents
  documents: '/api/documents',
  projectDocuments: '/api/project-documents',
  
  // Notifications
  notifications: '/api/notifications',
  
  // Favorites
  favorites: '/api/favorites',
  
  // Payments
  payments: '/api/payments',
  
  // Verification
  verification: '/api/verification',
  
  // Export
  export: '/api/export',
} as const
