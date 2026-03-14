'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Star, Scale, CheckCircle, X, FileText } from 'lucide-react';

interface Bid {
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
  };
}

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  bidCount: number;
  bids: Bid[];
}

interface AllBidsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: Project[];
  selectedBidsForCompare: string[];
  onToggleBidCompare: (bidId: string) => void;
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
  onCompareClick: () => void;
  formatRupiah: (amount: number) => string;
}

export function AllBidsModal({
  open,
  onOpenChange,
  projects,
  selectedBidsForCompare,
  onToggleBidCompare,
  onAcceptBid,
  onRejectBid,
  onCompareClick,
  formatRupiah,
}: AllBidsModalProps) {
  const allBids = projects.flatMap((project) =>
    project.bids.map((bid) => ({
      ...bid,
      project,
    }))
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Semua Penawaran
          </DialogTitle>
          <DialogDescription>Daftar semua penawaran untuk proyek Anda</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {allBids.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Belum ada penawaran</p>
              <p className="text-sm text-slate-400 mt-2">
                Penawaran akan muncul setelah kontraktor mengajukan proposal
              </p>
            </div>
          ) : (
            allBids.map(({ bid, project }) => (
              <Card key={bid.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">{project.title}</h4>
                      <p className="text-sm text-slate-500">
                        {project.category} • {project.location}
                      </p>
                    </div>
                    <Badge
                      className={
                        bid.status === 'ACCEPTED'
                          ? 'bg-primary'
                          : bid.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                      }
                    >
                      {bid.status === 'ACCEPTED'
                        ? 'Diterima'
                        : bid.status === 'PENDING'
                          ? 'Pending'
                          : 'Ditolak'}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-slate-500">Kontraktor</p>
                      <p className="font-medium">{bid.contractor.name}</p>
                      {bid.contractor.company && (
                        <p className="text-xs text-slate-500">{bid.contractor.company}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Penawaran</p>
                      <p className="font-bold text-primary">{formatRupiah(bid.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Durasi</p>
                      <p className="font-medium">{bid.duration} hari</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-medium">{bid.contractor.rating || '-'}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{bid.proposal}</p>
                  <div className="flex gap-2 pt-3 border-t">
                    {bid.status === 'PENDING' && (
                      <>
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
                          className="text-red-600 hover:text-red-700"
                          onClick={() => onRejectBid(bid.id)}
                        >
                          <X className="h-4 w-4 mr-1" /> Tolak
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onToggleBidCompare(bid.id)}
                    >
                      <Scale className="h-4 w-4 mr-1" />{' '}
                      {selectedBidsForCompare.includes(bid.id) ? 'Bandingkan (-)' : 'Bandingkan'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {selectedBidsForCompare.length >= 2 && (
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-between items-center">
              <p className="text-sm text-slate-600">
                {selectedBidsForCompare.length} penawaran dipilih untuk dibandingkan
              </p>
              <Button className="bg-primary hover:bg-primary/90" onClick={onCompareClick}>
                <Scale className="h-4 w-4 mr-2" /> Bandingkan Penawaran
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
