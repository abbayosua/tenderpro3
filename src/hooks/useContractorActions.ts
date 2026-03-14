'use client';

import { useCallback } from 'react';
import { toast } from 'sonner';
import type { Project } from '@/types';

interface User {
  id: string;
  role: 'OWNER' | 'CONTRACTOR' | 'ADMIN';
}

interface UseContractorActionsReturn {
  // Bid actions
  handleSubmitBid: (projectId: string, proposal: string, price: string, duration: string) => Promise<boolean>;
  
  // Document actions
  handleUploadDocument: (docType: string, docName: string) => Promise<boolean>;
  handleRequestVerification: () => Promise<void>;
}

export function useContractorActions(
  user: User | null,
  refreshDashboardStats: () => Promise<void>,
  refreshDocuments: () => Promise<void>,
): UseContractorActionsReturn {
  
  // Submit bid
  const handleSubmitBid = useCallback(async (
    projectId: string,
    proposal: string,
    price: string,
    duration: string
  ) => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu');
      return false;
    }
    
    if (!proposal.trim() || !price || !duration) {
      toast.error('Mohon lengkapi semua field penawaran');
      return false;
    }
    
    try {
      const res = await fetch('/api/bids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          contractorId: user.id,
          proposal,
          price: parseFloat(price),
          duration: parseInt(duration),
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Penawaran berhasil dikirim!');
        await refreshDashboardStats();
        return true;
      } else {
        toast.error(data.error || 'Gagal mengirim penawaran');
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

  return {
    handleSubmitBid,
    handleUploadDocument,
    handleRequestVerification,
  };
}
