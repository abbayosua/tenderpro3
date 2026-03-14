'use client';

import { useState, useEffect, useCallback } from 'react';
import type { OwnerStats, ContractorStats } from '@/types';
import { useAuthStore } from '@/lib/auth-store';

interface UseDashboardStatsReturn {
  ownerStats: OwnerStats | null;
  contractorStats: ContractorStats | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsReturn {
  const { user } = useAuthStore();
  
  const [ownerStats, setOwnerStats] = useState<OwnerStats | null>(null);
  const [contractorStats, setContractorStats] = useState<ContractorStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/stats?userId=${user.id}`);
      const data = await res.json();
      
      if (user.role === 'OWNER') {
        setOwnerStats(data);
      } else if (user.role === 'CONTRACTOR') {
        setContractorStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const refresh = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset stats when user logs out
  useEffect(() => {
    if (!user) {
      setOwnerStats(null);
      setContractorStats(null);
    }
  }, [user]);

  return {
    ownerStats,
    contractorStats,
    loading,
    error,
    refresh,
  };
}
