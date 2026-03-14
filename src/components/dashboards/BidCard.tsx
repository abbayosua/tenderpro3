'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Building2, Clock, Star, CheckCircle, Heart,
  FileText, MapPin
} from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { Contractor } from '@/types';

interface BidCardProps {
  bid: {
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
  };
  projectData?: {
    id: string;
    title: string;
    category: string;
    location: string;
    budget: number;
    status: string;
    bidCount: number;
  } | null;
  matchScore: number;
  isSelected: boolean;
  onToggleSelect: () => void;
  canSelect: boolean;
  onAccept: (bidId: string) => void;
  onReject: (bidId: string) => void;
  onAddFavorite: (contractorId: string) => void;
}

export function BidCard({
  bid,
  projectData,
  matchScore,
  isSelected,
  onToggleSelect,
  canSelect,
  onAccept,
  onReject,
  onAddFavorite,
}: BidCardProps) {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-yellow-600';
    return 'text-slate-500';
  };

  const getMatchScoreBg = (score: number) => {
    if (score >= 80) return 'bg-primary/10';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-slate-100';
  };

  return (
    <Card className={`mb-3 hover:shadow-md transition-all ${isSelected ? 'ring-2 ring-purple-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Checkbox for comparison */}
          <div className="pt-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onToggleSelect}
              disabled={!canSelect}
            />
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{bid.contractor.name}</p>
                    {bid.contractor.isVerified && (
                      <Badge className="bg-primary/10 text-primary text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" /> Terverifikasi
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{bid.contractor.company || 'Kontraktor Independent'}</p>
                </div>
              </div>
              
              {/* Match Score */}
              <div className={`px-3 py-1 rounded-full ${getMatchScoreBg(matchScore)}`}>
                <span className={`text-sm font-medium ${getMatchScoreColor(matchScore)}`}>
                  {matchScore}% Match
                </span>
              </div>
            </div>

            {/* Project info */}
            {projectData && (
              <div className="mb-3 p-2 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium">{projectData.title}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {projectData.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {projectData.location}
                  </span>
                </div>
              </div>
            )}

            {/* Bid details */}
            <div className="grid grid-cols-3 gap-4 mb-3">
              <div>
                <p className="text-xs text-slate-500">Harga Penawaran</p>
                <p className="font-bold text-primary">{formatRupiah(bid.price)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Durasi</p>
                <p className="font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {bid.duration} hari
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Rating</p>
                <p className="font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  {bid.contractor.rating || '-'} 
                  {bid.contractor.totalProjects && (
                    <span className="text-slate-500 text-sm">({bid.contractor.totalProjects} proyek)</span>
                  )}
                </p>
              </div>
            </div>

            {/* Proposal excerpt */}
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {bid.proposal}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between pt-3 border-t">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddFavorite(bid.contractor.id)}
              >
                <Heart className="h-4 w-4 mr-2" /> Favorit
              </Button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                  onClick={() => onReject(bid.id)}
                >
                  Tolak
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => onAccept(bid.id)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" /> Terima
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
