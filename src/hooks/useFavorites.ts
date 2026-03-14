'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Favorite } from '@/types';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'sonner';

interface UseFavoritesOptions {
  autoLoad?: boolean;
}

interface UseFavoritesReturn {
  favorites: Favorite[];
  loading: boolean;
  error: string | null;
  loadFavorites: () => Promise<void>;
  addFavorite: (contractorId: string, notes?: string) => Promise<boolean>;
  removeFavorite: (favoriteId: string) => Promise<boolean>;
  isFavorite: (contractorId: string) => boolean;
  refresh: () => Promise<void>;
}

export function useFavorites(options: UseFavoritesOptions = {}): UseFavoritesReturn {
  const { autoLoad = true } = options;
  const { user } = useAuthStore();
  
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFavorites = useCallback(async () => {
    if (!user || user.role !== 'OWNER') return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/favorites?userId=${user.id}`);
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error('Failed to fetch favorites:', err);
      setError('Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const addFavorite = useCallback(async (contractorId: string, notes?: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, contractorId, notes }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Kontraktor ditambahkan ke favorit!');
        await loadFavorites();
        return true;
      } else {
        toast.error(data.error || 'Gagal menambahkan favorit');
        return false;
      }
    } catch (err) {
      console.error('Failed to add favorite:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, [user, loadFavorites]);

  const removeFavorite = useCallback(async (favoriteId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/favorites?id=${favoriteId}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Kontraktor dihapus dari favorit');
        setFavorites(prev => prev.filter(f => f.id !== favoriteId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to remove favorite:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, []);

  const isFavorite = useCallback((contractorId: string): boolean => {
    return favorites.some(f => f.contractor.id === contractorId);
  }, [favorites]);

  const refresh = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    if (autoLoad && user && user.role === 'OWNER') {
      loadFavorites();
    }
  }, [autoLoad, user, loadFavorites]);

  // Reset when user logs out
  useEffect(() => {
    if (!user) {
      setFavorites([]);
    }
  }, [user]);

  return {
    favorites,
    loading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    refresh,
  };
}
