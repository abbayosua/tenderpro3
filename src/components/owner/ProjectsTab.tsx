'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FolderOpen, Plus, Search
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { OwnerStats } from '@/types';
import { ProjectCard } from './ProjectCard';

interface ProjectsTabProps {
  ownerStats: OwnerStats;
  onShowCreateProjectModal: () => void;
  onShowCCTVModal: (project: { id: string; title: string; status: string }) => void;
  onShowProgressModal: (project: { id: string; title: string; category: string; budget: number }) => void;
  onLoadMilestones: (projectId: string) => void;
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
}

export function ProjectsTab({
  ownerStats,
  onShowCreateProjectModal,
  onShowCCTVModal,
  onShowProgressModal,
  onLoadMilestones,
  onAcceptBid,
  onRejectBid,
}: ProjectsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredProjects = ownerStats.projects
    .filter(project => filterStatus === 'all' || project.status === filterStatus)
    .filter(project => searchQuery === '' || project.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari proyek..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="OPEN">Tender Terbuka</SelectItem>
              <SelectItem value="IN_PROGRESS">Sedang Berjalan</SelectItem>
              <SelectItem value="COMPLETED">Selesai</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={onShowCreateProjectModal}>
          <Plus className="h-4 w-4 mr-2" /> Buat Proyek Baru
        </Button>
      </div>

      {ownerStats.projects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Belum ada proyek</p>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onShowCreateProjectModal}>
              <Plus className="h-4 w-4 mr-2" /> Buat Proyek Pertama
            </Button>
          </CardContent>
        </Card>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">Tidak ada proyek yang cocok dengan filter</p>
          </CardContent>
        </Card>
      ) : (
        filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onShowCCTVModal={onShowCCTVModal}
            onShowProgressModal={onShowProgressModal}
            onLoadMilestones={onLoadMilestones}
            onAcceptBid={onAcceptBid}
            onRejectBid={onRejectBid}
          />
        ))
      )}
    </>
  );
}
