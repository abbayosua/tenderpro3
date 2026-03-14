'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { Contractor, Project, OwnerStats, ContractorStats, Notification, Favorite } from '@/types';

interface User {
  id: string;
  role: 'OWNER' | 'CONTRACTOR' | 'ADMIN';
}

interface UseDataFetchingReturn {
  // Public data
  contractors: Contractor[];
  projects: Project[];
  
  // User-specific data
  ownerStats: OwnerStats | null;
  contractorStats: ContractorStats | null;
  notifications: Notification[];
  unreadCount: number;
  favorites: Favorite[];
  documents: Array<{ id: string; type: string; name: string; verified: boolean }>;
  
  // Loading state
  dataLoading: boolean;
  
  // Refresh functions
  refreshDashboardStats: () => Promise<void>;
  refreshDocuments: () => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

export function useDataFetching(user: User | null): UseDataFetchingReturn {
  // Public data
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  
  // User-specific data
  const [ownerStats, setOwnerStats] = useState<OwnerStats | null>(null);
  const [contractorStats, setContractorStats] = useState<ContractorStats | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [documents, setDocuments] = useState<Array<{ id: string; type: string; name: string; verified: boolean }>>([]);
  
  // Loading state
  const [dataLoading, setDataLoading] = useState(true);

  // CCTV modal tracking ref
  const cctvShownRef = useRef(false);

  // Load initial public data (contractors, projects)
  useEffect(() => {
    let mounted = true;
    
    const loadInitialData = async () => {
      if (!mounted) return;
      try {
        const [contractorsRes, projectsRes] = await Promise.all([
          fetch('/api/contractors'),
          fetch('/api/projects?status=OPEN&limit=6'),
        ]);
        
        if (!mounted) return;
        
        const contractorsData = await contractorsRes.json();
        const projectsData = await projectsRes.json();
        
        setContractors(contractorsData.contractors || []);
        setProjects(projectsData.projects || []);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      } finally {
        if (mounted) setDataLoading(false);
      }
    };
    
    loadInitialData();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Load user-specific data when user logs in
  useEffect(() => {
    if (!user?.id) return;
    
    let mounted = true;
    
    const loadUserData = async () => {
      if (!mounted || !user?.id) return;
      
      try {
        // Load stats
        const statsRes = await fetch(`/api/stats?userId=${user.id}`);
        const statsData = await statsRes.json();
        
        if (!mounted) return;
        
        if (user.role === 'OWNER') {
          setOwnerStats(statsData);
        } else if (user.role === 'CONTRACTOR') {
          setContractorStats(statsData);
        }
        
        // Load notifications
        const notifRes = await fetch(`/api/notifications?userId=${user.id}&limit=10`);
        const notifData = await notifRes.json();
        
        if (!mounted) return;
        
        setNotifications(notifData.notifications || []);
        setUnreadCount(notifData.unreadCount || 0);
        
        // Load documents
        const docsRes = await fetch(`/api/documents?userId=${user.id}`);
        const docsData = await docsRes.json();
        
        if (!mounted) return;
        
        setDocuments(docsData.documents || []);
        
        // Load favorites if owner
        if (user.role === 'OWNER') {
          const favRes = await fetch(`/api/favorites?userId=${user.id}`);
          const favData = await favRes.json();
          
          if (!mounted) return;
          
          setFavorites(favData.favorites || []);
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };
    
    loadUserData();
    
    return () => {
      mounted = false;
    };
  }, [user?.id, user?.role]);

  // Reset stats when user logs out
  useEffect(() => {
    if (user) return;
    setOwnerStats(null);
    setContractorStats(null);
    setNotifications([]);
    setUnreadCount(0);
    setDocuments([]);
    setFavorites([]);
    cctvShownRef.current = false;
  }, [user]);

  // Refresh dashboard stats
  const refreshDashboardStats = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/stats?userId=${user.id}`);
      const data = await res.json();
      if (user.role === 'OWNER') {
        setOwnerStats(data);
      } else if (user.role === 'CONTRACTOR') {
        setContractorStats(data);
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }, [user?.id, user?.role]);

  // Refresh documents
  const refreshDocuments = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/documents?userId=${user.id}`);
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to refresh documents:', error);
    }
  }, [user?.id]);

  // Refresh favorites
  const refreshFavorites = useCallback(async () => {
    if (!user?.id || user.role !== 'OWNER') return;
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Failed to refresh favorites:', error);
    }
  }, [user?.id, user?.role]);

  return {
    contractors,
    projects,
    ownerStats,
    contractorStats,
    notifications,
    unreadCount,
    favorites,
    documents,
    dataLoading,
    refreshDashboardStats,
    refreshDocuments,
    refreshFavorites,
  };
}
