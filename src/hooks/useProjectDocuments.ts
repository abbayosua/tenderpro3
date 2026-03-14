'use client';

import { useState, useCallback } from 'react';
import type { ProjectDocument } from '@/types';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'sonner';

interface UploadDocumentData {
  name: string;
  type: string;
  description: string;
}

interface UseProjectDocumentsReturn {
  documents: ProjectDocument[];
  loading: boolean;
  error: string | null;
  loadDocuments: (projectId: string) => Promise<void>;
  uploadDocument: (projectId: string, data: UploadDocumentData) => Promise<boolean>;
  deleteDocument: (documentId: string) => Promise<boolean>;
  getDocumentById: (documentId: string) => ProjectDocument | undefined;
  clearDocuments: () => void;
}

export function useProjectDocuments(): UseProjectDocumentsReturn {
  const { user } = useAuthStore();
  
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDocuments = useCallback(async (projectId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/project-documents?projectId=${projectId}`);
      const data = await res.json();
      
      setDocuments(data.documents || []);
    } catch (err) {
      console.error('Failed to fetch documents:', err);
      setError('Failed to load documents');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadDocument = useCallback(async (projectId: string, docData: UploadDocumentData): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const res = await fetch('/api/project-documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          uploadedBy: user.id,
          name: docData.name,
          type: docData.type,
          fileUrl: `/documents/${Date.now()}_${docData.name.replace(/\s+/g, '_')}.pdf`,
          fileSize: Math.floor(Math.random() * 500000) + 50000, // Simulated file size
          description: docData.description || null,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Dokumen berhasil diunggah!');
        await loadDocuments(projectId);
        return true;
      } else {
        toast.error(data.error || 'Gagal mengunggah dokumen');
        return false;
      }
    } catch (err) {
      console.error('Failed to upload document:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, [user, loadDocuments]);

  const deleteDocument = useCallback(async (documentId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/project-documents?id=${documentId}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Dokumen berhasil dihapus');
        setDocuments(prev => prev.filter(d => d.id !== documentId));
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to delete document:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, []);

  const getDocumentById = useCallback((documentId: string) => {
    return documents.find(d => d.id === documentId);
  }, [documents]);

  const clearDocuments = useCallback(() => {
    setDocuments([]);
  }, []);

  return {
    documents,
    loading,
    error,
    loadDocuments,
    uploadDocument,
    deleteDocument,
    getDocumentById,
    clearDocuments,
  };
}
