'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, Building2, Scale
} from 'lucide-react';
import { calculateMatchScore } from '@/lib/utils';
import type { OwnerStats, Contractor } from '@/types';
import { BidCard } from './BidCard';

interface BidsTabProps {
  ownerStats: OwnerStats;
  selectedBidsForCompare: string[];
  onToggleBidSelection: (bidId: string) => void;
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
  onAddFavorite: (contractorId: string) => void;
  onShowCompareModal: () => void;
}

export function BidsTab({
  ownerStats,
  selectedBidsForCompare,
  onToggleBidSelection,
  onAcceptBid,
  onRejectBid,
  onAddFavorite,
  onShowCompareModal,
}: BidsTabProps) {
  const allBids = ownerStats.projects.filter(p => p.bids.length > 0).flatMap(p => p.bids);
  const openProjectBids = ownerStats.projects.filter(p => p.bids.length > 0 && p.status === 'OPEN');

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Proyek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Proyek</SelectItem>
                {ownerStats.projects.filter(p => p.status === 'OPEN').map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="newest">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Terbaru</SelectItem>
                <SelectItem value="lowest">Harga Terendah</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {selectedBidsForCompare.length >= 2 && (
            <Button className="bg-purple-600 hover:bg-purple-700" onClick={onShowCompareModal}>
              <Scale className="h-4 w-4 mr-2" /> Bandingkan ({selectedBidsForCompare.length})
            </Button>
          )}
        </div>

        <ScrollArea className="h-96">
          {allBids.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
              <p>Belum ada penawaran masuk</p>
            </div>
          ) : (
            openProjectBids.flatMap(project =>
              project.bids.map(bid => {
                const projectData = ownerStats.projects.find(p => p.bids.some(b => b.id === bid.id));
                const matchScore = calculateMatchScore(
                  bid.contractor as unknown as Contractor,
                  projectData?.category || '',
                  projectData?.budget || 0
                );
                return (
                  <BidCard
                    key={bid.id}
                    bid={bid}
                    projectData={projectData}
                    matchScore={matchScore}
                    isSelected={selectedBidsForCompare.includes(bid.id)}
                    onToggleSelect={() => onToggleBidSelection(bid.id)}
                    canSelect={selectedBidsForCompare.length < 3 || selectedBidsForCompare.includes(bid.id)}
                    onAccept={onAcceptBid}
                    onReject={onRejectBid}
                    onAddFavorite={onAddFavorite}
                  />
                );
              })
            )
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
