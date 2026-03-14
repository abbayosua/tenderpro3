'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, Eye, Clock, FileText, Video, CheckCircle, 
  Building2, DollarSign
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    category: string;
    location: string;
    budget: number;
    status: string;
    bidCount: number;
    bids: Array<{
      id: string;
      price: number;
      duration: number;
      status: string;
      proposal: string;
      contractor: {
        id: string;
        name: string;
        isVerified: boolean;
        company?: string;
        rating?: number;
        totalProjects?: number;
      };
    }>;
  };
  onShowCCTVModal: (project: { id: string; title: string; status: string }) => void;
  onShowProgressModal: (project: { id: string; title: string; category: string; budget: number }) => void;
  onLoadMilestones: (projectId: string) => void;
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
}

export function ProjectCard({
  project,
  onShowCCTVModal,
  onShowProgressModal,
  onLoadMilestones,
  onAcceptBid,
  onRejectBid,
}: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-yellow-500';
      case 'IN_PROGRESS': return 'bg-blue-600';
      case 'COMPLETED': return 'bg-primary';
      case 'CANCELLED': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'OPEN': return 'Tender Terbuka';
      case 'IN_PROGRESS': return 'Sedang Berjalan';
      case 'COMPLETED': return 'Selesai';
      case 'CANCELLED': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(project.status)}>
                {getStatusText(project.status)}
              </Badge>
              <Badge variant="outline">{project.category}</Badge>
            </div>
            <h3 className="text-lg font-semibold mb-1">{project.title}</h3>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {project.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                {formatRupiah(project.budget)}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                {project.bidCount} penawaran
              </span>
            </div>
          </div>
          <div className="flex gap-2">
            {project.status === 'IN_PROGRESS' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onShowCCTVModal({ id: project.id, title: project.title, status: project.status })}
              >
                <Video className="h-4 w-4 mr-2" /> CCTV
              </Button>
            )}
            {(project.status === 'IN_PROGRESS' || project.status === 'COMPLETED') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onShowProgressModal({ id: project.id, title: project.title, category: project.category, budget: project.budget });
                  onLoadMilestones(project.id);
                }}
              >
                <Eye className="h-4 w-4 mr-2" /> Progress
              </Button>
            )}
          </div>
        </div>

        {/* Show bids for OPEN projects */}
        {project.status === 'OPEN' && project.bids.length > 0 && (
          <div className="border-t pt-4 mt-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Penawaran Terbaru ({project.bids.length})
            </h4>
            <div className="space-y-3">
              {project.bids.slice(0, 3).map((bid) => (
                <div key={bid.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{bid.contractor.name}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>{formatRupiah(bid.price)}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {bid.duration} hari
                        </span>
                        {bid.contractor.rating && (
                          <>
                            <span>•</span>
                            <span>⭐ {bid.contractor.rating}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-primary/90"
                      onClick={() => onAcceptBid(bid.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Terima
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => onRejectBid(bid.id)}
                    >
                      Tolak
                    </Button>
                  </div>
                </div>
              ))}
              {project.bids.length > 3 && (
                <p className="text-sm text-slate-500 text-center">
                  +{project.bids.length - 3} penawaran lainnya
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
