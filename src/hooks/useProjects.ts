'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Project, ProjectFormData } from '@/types';

interface UseProjectsOptions {
  autoLoad?: boolean;
  status?: string;
  limit?: number;
  ownerId?: string;
}

interface UseProjectsReturn {
  projects: Project[];
  loading: boolean;
  error: string | null;
  loadProjects: () => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  createProject: (data: ProjectFormData & { ownerId: string }) => Promise<boolean>;
  refresh: () => Promise<void>;
}

export function useProjects(options: UseProjectsOptions = {}): UseProjectsReturn {
  const { autoLoad = true, status, limit, ownerId } = options;
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildQueryUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (limit) params.append('limit', limit.toString());
    if (ownerId) params.append('ownerId', ownerId);
    const queryString = params.toString();
    return queryString ? `/api/projects?${queryString}` : '/api/projects';
  }, [status, limit, ownerId]);

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(buildQueryUrl());
      const data = await res.json();
      
      if (data.projects) {
        setProjects(data.projects);
      } else {
        setError('Failed to load projects');
      }
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [buildQueryUrl]);

  const getProjectById = useCallback((id: string) => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const createProject = useCallback(async (data: ProjectFormData & { ownerId: string }) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: data.ownerId,
          title: data.title,
          description: data.description,
          category: data.category,
          location: data.location,
          budget: parseFloat(data.budget),
          duration: data.duration ? parseInt(data.duration) : null,
          requirements: data.requirements.split('\n').filter(r => r.trim()),
        }),
      });
      const result = await res.json();
      
      if (result.success) {
        await loadProjects();
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to create project:', err);
      return false;
    }
  }, [loadProjects]);

  const refresh = useCallback(async () => {
    await loadProjects();
  }, [loadProjects]);

  useEffect(() => {
    if (autoLoad) {
      loadProjects();
    }
  }, [autoLoad, loadProjects]);

  return {
    projects,
    loading,
    error,
    loadProjects,
    getProjectById,
    createProject,
    refresh,
  };
}
