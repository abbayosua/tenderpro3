'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Contractor } from '@/types';

interface UseContractorsOptions {
  autoLoad?: boolean;
  limit?: number;
}

interface UseContractorsReturn {
  contractors: Contractor[];
  loading: boolean;
  error: string | null;
  loadContractors: () => Promise<void>;
  getContractorById: (id: string) => Contractor | undefined;
  refresh: () => Promise<void>;
}

export function useContractors(options: UseContractorsOptions = {}): UseContractorsReturn {
  const { autoLoad = true, limit } = options;
  
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadContractors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = limit 
        ? `/api/contractors?limit=${limit}` 
        : '/api/contractors';
      const res = await fetch(url);
      const data = await res.json();
      
      if (data.contractors) {
        setContractors(data.contractors);
      } else {
        setError('Failed to load contractors');
      }
    } catch (err) {
      console.error('Failed to fetch contractors:', err);
      setError('Failed to load contractors');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  const getContractorById = useCallback((id: string) => {
    return contractors.find(c => c.id === id);
  }, [contractors]);

  const refresh = useCallback(async () => {
    await loadContractors();
  }, [loadContractors]);

  useEffect(() => {
    if (autoLoad) {
      loadContractors();
    }
  }, [autoLoad, loadContractors]);

  return {
    contractors,
    loading,
    error,
    loadContractors,
    getContractorById,
    refresh,
  };
}
