'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flag, Eye, Calendar } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { OwnerStats } from '@/types';

interface TimelineTabProps {
  ownerStats: OwnerStats;
  onShowProgressModal: (project: { id: string; title: string; category: string; budget: number }) => void;
  onLoadMilestones: (projectId: string) => void;
}

export function TimelineTab({
  ownerStats,
  onShowProgressModal,
  onLoadMilestones,
}: TimelineTabProps) {
  const activeProjects = ownerStats.projects.filter(
    p => p.status === 'IN_PROGRESS' || p.status === 'COMPLETED'
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Timeline Proyek
        </CardTitle>
        <CardDescription>Pantau progress dan milestone semua proyek Anda</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {ownerStats.projects.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Flag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>Belum ada proyek untuk ditampilkan timeline</p>
          </div>
        ) : activeProjects.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Flag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>Tidak ada proyek yang sedang berjalan atau selesai</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeProjects.map((project) => (
              <Card key={project.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={project.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-primary'}>
                          {project.status === 'IN_PROGRESS' ? 'Sedang Berjalan' : 'Selesai'}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-slate-500">{project.location} • {formatRupiah(project.budget)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onShowProgressModal({ id: project.id, title: project.title, category: project.category, budget: project.budget });
                        onLoadMilestones(project.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Detail
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium text-primary">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="text-sm text-slate-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Est. 90 hari
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
