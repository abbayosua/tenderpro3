import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Contractor } from "@/types"

// Class name utility for Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as Indonesian Rupiah currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "Rp 1.000.000")
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Calculate a match score between a contractor and a project
 * @param contractor - The contractor to evaluate
 * @param projectCategory - The project category
 * @param projectBudget - The project budget (currently unused but available for future scoring)
 * @returns A score from 0-100 indicating match quality
 */
export function calculateMatchScore(
  contractor: Contractor | null, 
  projectCategory: string, 
  _projectBudget: number
): number {
  if (!contractor || !contractor.company) return 50
  
  let score = 50 // Base score
  
  // Category match
  if (contractor.company.specialization?.toLowerCase().includes(projectCategory.toLowerCase())) {
    score += 20
  }
  
  // Experience bonus
  if (contractor.company.experienceYears >= 5) score += 10
  if (contractor.company.experienceYears >= 10) score += 5
  
  // Rating bonus
  if (contractor.company.rating >= 4.5) score += 10
  if (contractor.company.rating >= 4.8) score += 5
  
  // Completed projects bonus
  if (contractor.company.completedProjects >= 10) score += 5
  if (contractor.company.completedProjects >= 50) score += 5
  
  // Verification bonus
  if (contractor.verificationStatus === 'VERIFIED') score += 10
  
  return Math.min(score, 100) // Cap at 100
}

/**
 * Format a date to Indonesian locale
 * @param date - The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date with time to Indonesian locale
 * @param date - The date to format
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a relative time (e.g., "2 hours ago")
 * @param date - The date to compare
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Baru saja'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`
  
  return formatDate(d)
}

/**
 * Truncate text with ellipsis
 * @param text - The text to truncate
 * @param maxLength - Maximum length before truncating
 * @returns Truncated text with ellipsis if needed
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

/**
 * Generate initials from a name
 * @param name - The full name
 * @returns Two-letter initials
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Validate email format
 * @param email - The email to validate
 * @returns Whether the email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Format file size in bytes to human readable format
 * @param bytes - The file size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Generate a random ID (for client-side use only)
 * @returns A random string ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
