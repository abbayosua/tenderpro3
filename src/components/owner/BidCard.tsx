'use client';

import { Button } from '@/components/ui/button';
import { Building2, Star, CheckCircle, Heart, Zap } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';
import type { OwnerStats } from '@/types';

interface BidCardProps {
  bid: OwnerStats['projects'][0]['bids'][0];
  projectData: OwnerStats['projects'][0] | undefined;
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
  onAddFavorite 
}: BidCardProps) {
  return (
    <div className={`border rounded-lg p-4 mb-3 hover:shadow-sm transition-shadow ${isSelected ? 'border-purple-400 bg-purple-50' : 'bg-white'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-slate-300 accent-purple-600 cursor-pointer"
            checked={isSelected}
            onChange={onToggleSelect}
            disabled={!canSelect}
          />
          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
            <Building2 className="h-5 w-5 text-slate-500" />
          </div>
          <div>
            <p className="font-medium">{bid.contractor.name}</p>
            <p className="text-sm text-slate-500">{bid.contractor.company}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-lg text-primary">{formatRupiah(bid.price)}</p>
          <p className="text-sm text-slate-500">{bid.duration} hari kerja</p>
        </div>
      </div>
      
      {bid.contractor.rating && (
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{bid.contractor.rating}</span>
            <span className="text-sm text-slate-500">({bid.contractor.totalProjects} proyek)</span>
          </div>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">{matchScore}% Cocok</span>
          </div>
        </div>
      )}
      
      <p className="text-sm text-slate-600 line-clamp-2 mb-3">{bid.proposal}</p>
      
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">Untuk: {projectData?.title}</p>
        <div className="flex gap-2">
          <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => onAccept(bid.id)}>
            <CheckCircle className="h-4 w-4 mr-1" /> Terima
          </Button>
          <Button size="sm" variant="outline" onClick={() => onReject(bid.id)}>Tolak</Button>
          <Button size="sm" variant="ghost" onClick={() => onAddFavorite(bid.contractor.id)}>
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
