'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import { formatRupiah } from '@/lib/utils';
import type { OwnerStats, Milestone } from '@/types';

interface User {
  id: string;
  role: 'OWNER' | 'CONTRACTOR' | 'ADMIN';
}

interface UseOwnerActionsReturn {
  // Bid actions
  handleAcceptBid: (bidId: string) => Promise<void>;
  handleRejectBid: (bidId: string) => Promise<void>;
  
  // Project actions
  handleCreateProject: (projectData: {
    title: string;
    description: string;
    category: string;
    location: string;
    budget: string;
    duration: string;
    requirements: string;
  }) => Promise<boolean>;
  
  // Document actions
  handleUploadDocument: (docType: string, docName: string) => Promise<boolean>;
  handleRequestVerification: () => Promise<void>;
  
  // Favorite actions
  handleAddFavorite: (contractorId: string, notes?: string) => Promise<void>;
  handleRemoveFavorite: (favoriteId: string) => Promise<void>;
  
  // Notification actions
  handleMarkNotificationRead: (notificationId: string) => Promise<void>;
  handleMarkAllRead: () => Promise<void>;
  
  // Milestone actions
  handleUpdateMilestone: (milestoneId: string, status: string, projectId: string) => Promise<void>;
  loadMilestones: (projectId: string) => Promise<Milestone[]>;
  
  // Export actions
  handleExportReport: (projectId: string, format: 'pdf' | 'excel', ownerStats: OwnerStats | null) => Promise<void>;
}

export function useOwnerActions(
  user: User | null,
  refreshDashboardStats: () => Promise<void>,
  refreshDocuments: () => Promise<void>,
  refreshFavorites: () => Promise<void>,
  setMilestones: (milestones: Milestone[]) => void,
  setProgressPercent: (percent: number) => void,
): UseOwnerActionsReturn {
  
  // Accept bid
  const handleAcceptBid = useCallback(async (bidId: string) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, status: 'ACCEPTED' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Penawaran diterima!');
        await refreshDashboardStats();
      } else {
        toast.error(data.error || 'Gagal menerima penawaran');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [refreshDashboardStats]);

  // Reject bid
  const handleRejectBid = useCallback(async (bidId: string) => {
    try {
      const res = await fetch('/api/bids', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bidId, status: 'REJECTED' }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Penawaran ditolak');
        await refreshDashboardStats();
      } else {
        toast.error(data.error || 'Gagal menolak penawaran');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [refreshDashboardStats]);

  // Create project
  const handleCreateProject = useCallback(async (projectData: {
    title: string;
    description: string;
    category: string;
    location: string;
    budget: string;
    duration: string;
    requirements: string;
  }) => {
    if (!user || !projectData.title || !projectData.budget) {
      toast.error('Mohon lengkapi data proyek');
      return false;
    }
    
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: user.id,
          ...projectData,
          budget: parseFloat(projectData.budget),
          duration: parseInt(projectData.duration) || null,
          requirements: projectData.requirements.split('\n').filter(r => r.trim()),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Proyek berhasil dibuat!');
        await refreshDashboardStats();
        return true;
      } else {
        toast.error(data.error || 'Gagal membuat proyek');
        return false;
      }
    } catch {
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, [user, refreshDashboardStats]);

  // Upload document
  const handleUploadDocument = useCallback(async (docType: string, docName: string) => {
    if (!user || !docName.trim()) {
      toast.error('Mohon isi nama dokumen');
      return false;
    }
    
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          type: docType,
          name: docName,
          fileUrl: `/documents/${docType.toLowerCase()}_${user.id}.pdf`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Dokumen berhasil diunggah!');
        await refreshDocuments();
        return true;
      } else {
        toast.error(data.error || 'Gagal mengunggah dokumen');
        return false;
      }
    } catch {
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, [user, refreshDocuments]);

  // Request verification
  const handleRequestVerification = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Permintaan verifikasi berhasil dikirim!');
      } else {
        toast.error(data.error || 'Gagal mengirim permintaan verifikasi');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [user]);

  // Add favorite
  const handleAddFavorite = useCallback(async (contractorId: string, notes?: string) => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, contractorId, notes }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Kontraktor ditambahkan ke favorit!');
        await refreshFavorites();
      } else {
        toast.error(data.error || 'Gagal menambahkan favorit');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [user, refreshFavorites]);

  // Remove favorite
  const handleRemoveFavorite = useCallback(async (favoriteId: string) => {
    try {
      const res = await fetch(`/api/favorites?id=${favoriteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Kontraktor dihapus dari favorit');
        await refreshFavorites();
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [refreshFavorites]);

  // Mark notification as read
  const handleMarkNotificationRead = useCallback(async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  // Mark all notifications as read
  const handleMarkAllRead = useCallback(async () => {
    if (!user) return;
    
    try {
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true, userId: user.id }),
      });
      toast.success('Semua notifikasi ditandai sudah dibaca');
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [user]);

  // Load milestones
  const loadMilestones = useCallback(async (projectId: string) => {
    try {
      const res = await fetch(`/api/milestones?projectId=${projectId}`);
      const data = await res.json();
      setMilestones(data.milestones || []);
      setProgressPercent(data.progress || 0);
      return data.milestones || [];
    } catch (error) {
      console.error('Failed to fetch milestones:', error);
      return [];
    }
  }, [setMilestones, setProgressPercent]);

  // Update milestone status
  const handleUpdateMilestone = useCallback(async (milestoneId: string, status: string, projectId: string) => {
    try {
      const res = await fetch('/api/milestones', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ milestoneId, status }),
      });
      const data = await res.json();
      if (data.success) {
        await loadMilestones(projectId);
        toast.success('Status milestone diperbarui');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  }, [loadMilestones]);

  // Export report
  const handleExportReport = useCallback(async (projectId: string, format: 'pdf' | 'excel', ownerStats: OwnerStats | null) => {
    try {
      const project = ownerStats?.projects.find(p => p.id === projectId);
      if (!project) return;
      
      if (format === 'excel') {
        const csv = [
          'LAPORAN PROYEK TENDERPRO',
          '',
          'Judul Proyek,' + project.title,
          'Kategori,' + project.category,
          'Lokasi,' + project.location,
          'Anggaran,' + project.budget,
          'Status,' + project.status,
          'Jumlah Penawaran,' + project.bidCount,
          'Tanggal Generate,' + new Date().toLocaleDateString('id-ID'),
        ].join('\n');
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_${project.title.replace(/\s+/g, '_')}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else {
        const content = `
LAPORAN PROYEK TENDERPRO
========================

Judul Proyek: ${project.title}
Kategori: ${project.category}
Lokasi: ${project.location}
Anggaran: ${formatRupiah(project.budget)}
Status: ${project.status}
Jumlah Penawaran: ${project.bidCount}

Tanggal Generate: ${new Date().toLocaleDateString('id-ID', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
})}
        `;
        
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Laporan_${project.title.replace(/\s+/g, '_')}.txt`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      toast.success(`Laporan berhasil diekspor sebagai ${format.toUpperCase()}`);
    } catch {
      toast.error('Terjadi kesalahan saat mengekspor laporan');
    }
  }, []);

  return {
    handleAcceptBid,
    handleRejectBid,
    handleCreateProject,
    handleUploadDocument,
    handleRequestVerification,
    handleAddFavorite,
    handleRemoveFavorite,
    handleMarkNotificationRead,
    handleMarkAllRead,
    handleUpdateMilestone,
    loadMilestones,
    handleExportReport,
  };
}
