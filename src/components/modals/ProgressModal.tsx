'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flag, Calendar, CheckCircle } from 'lucide-react';

interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completedAt?: string;
  status: string;
  order: number;
  amount?: number;
  paymentStatus?: string;
  paidAt?: string;
  payments?: any[];
}

interface ProgressModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProjectForProgress: { id: string; title: string; category: string; budget: number } | null;
  milestones: Milestone[];
  progressPercent: number;
  formatRupiah: (amount: number) => string;
  onUpdateMilestone: (milestoneId: string, status: string) => void;
}

export function ProgressModal({
  open,
  onOpenChange,
  selectedProjectForProgress,
  milestones,
  progressPercent,
  formatRupiah,
  onUpdateMilestone,
}: ProgressModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Flag className="h-5 w-5 text-primary" />
            Tracking Progress
          </DialogTitle>
          <DialogDescription>
            {selectedProjectForProgress?.title} - {formatRupiah(selectedProjectForProgress?.budget || 0)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Progress Keseluruhan</span>
                <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
              </div>
              <Progress value={progressPercent} className="h-3" />
              <div className="flex items-center justify-between mt-2 text-sm text-slate-500">
                <span>
                  {milestones.filter((m) => m.status === 'COMPLETED').length} dari {milestones.length}{' '}
                  milestone selesai
                </span>
              </div>
            </CardContent>
          </Card>

          {milestones.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Flag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>Belum ada milestone untuk proyek ini</p>
              <p className="text-sm mt-2">Milestone akan dibuat setelah proyek dimulai</p>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((milestone, idx) => (
                <Card
                  key={milestone.id}
                  className={`${
                    milestone.status === 'COMPLETED'
                      ? 'border-primary/30 bg-primary/5'
                      : milestone.status === 'IN_PROGRESS'
                        ? 'border-yellow-200 bg-yellow-50'
                        : ''
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            milestone.status === 'COMPLETED'
                              ? 'bg-primary'
                              : milestone.status === 'IN_PROGRESS'
                                ? 'bg-yellow-500'
                                : 'bg-slate-200'
                          }`}
                        >
                          {milestone.status === 'COMPLETED' ? (
                            <CheckCircle className="h-5 w-5 text-white" />
                          ) : (
                            <span className="text-sm font-medium text-slate-600">{idx + 1}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{milestone.title}</p>
                          {milestone.description && (
                            <p className="text-sm text-slate-500 mt-1">{milestone.description}</p>
                          )}
                          {milestone.dueDate && (
                            <p className="text-xs text-slate-400 mt-1">
                              <Calendar className="h-3 w-3 inline mr-1" />
                              Target:{' '}
                              {new Date(milestone.dueDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          )}
                        </div>
                      </div>
                      {milestone.status !== 'COMPLETED' && (
                        <Select
                          value={milestone.status}
                          onValueChange={(v) => onUpdateMilestone(milestone.id, v)}
                        >
                          <SelectTrigger className="w-32 h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_PROGRESS">Dalam Proses</SelectItem>
                            <SelectItem value="COMPLETED">Selesai</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
