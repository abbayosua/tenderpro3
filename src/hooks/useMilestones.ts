'use client';

import { useState, useCallback } from 'react';
import type { Milestone } from '@/types';
import { toast } from 'sonner';

interface UseMilestonesReturn {
  milestones: Milestone[];
  progressPercent: number;
  loading: boolean;
  error: string | null;
  loadMilestones: (projectId: string) => Promise<void>;
  updateMilestoneStatus: (milestoneId: string, status: string) => Promise<boolean>;
  getMilestoneById: (milestoneId: string) => Milestone | undefined;
  clearMilestones: () => void;
}

export function useMilestones(): UseMilestonesReturn {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMilestones = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/milestones?projectId=${projectId}`);
      const data = await res.json();
      
      setMilestones(data.milestones || []);
      setProgressPercent(data.progress || 0);
    } catch (err) {
      console.error('Failed to fetch milestones:', err);
      setError('Failed to load milestones');
      setMilestones([]);
      setProgressPercent(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMilestoneStatus = useCallback(async (milestoneId: string, status: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/milestones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Status milestone diperbarui');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to update milestone:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, []);

  const getMilestoneById = useCallback((milestoneId: string) => {
    return milestones.find(m => m.id === milestoneId);
  }, [milestones]);

  const clearMilestones = useCallback(() => {
    setMilestones([]);
    setProgressPercent(0);
  }, []);

  return {
    milestones,
    progressPercent,
    loading,
    error,
    loadMilestones,
    updateMilestoneStatus,
    getMilestoneById,
    clearMilestones,
  };
}
