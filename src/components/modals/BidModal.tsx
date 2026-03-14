import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';

interface Project {
  id: string;
  title: string;
  budget: number;
}

interface BidModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProject: Project | null;
  bidProposal: string;
  setBidProposal: (value: string) => void;
  bidPrice: string;
  setBidPrice: (value: string) => void;
  bidDuration: string;
  setBidDuration: (value: string) => void;
  onSubmit: () => void;
}

export function BidModal({
  open,
  onOpenChange,
  selectedProject,
  bidProposal,
  setBidProposal,
  bidPrice,
  setBidPrice,
  bidDuration,
  setBidDuration,
  onSubmit
}: BidModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Ajukan Penawaran</DialogTitle>
          <DialogDescription>{selectedProject?.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Anggaran Proyek</Label>
            <p className="text-lg font-bold text-primary">
              {selectedProject && new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(selectedProject.budget)}
            </p>
          </div>
          <div>
            <Label htmlFor="proposal">Proposal</Label>
            <Textarea
              id="proposal"
              placeholder="Jelaskan proposal Anda..."
              value={bidProposal}
              onChange={(e) => setBidProposal(e.target.value)}
              rows={4}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Harga Penawaran (Rp)</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                value={bidPrice}
                onChange={(e) => setBidPrice(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="duration">Durasi (hari)</Label>
              <Input
                id="duration"
                type="number"
                placeholder="0"
                value={bidDuration}
                onChange={(e) => setBidDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={onSubmit}>Kirim Penawaran</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
