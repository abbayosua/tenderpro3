'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  exportFormat: 'pdf' | 'excel';
  setExportFormat: (format: 'pdf' | 'excel') => void;
  onExport: () => void;
}

export function ExportModal({
  open,
  onOpenChange,
  exportFormat,
  setExportFormat,
  onExport,
}: ExportModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Export Laporan
          </DialogTitle>
          <DialogDescription>Pilih format dan data yang ingin diekspor</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Format Export</Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={exportFormat === 'pdf' ? 'default' : 'outline'}
                className={exportFormat === 'pdf' ? 'bg-primary hover:bg-primary/90' : ''}
                onClick={() => setExportFormat('pdf')}
              >
                <FileText className="h-4 w-4 mr-2" /> PDF
              </Button>
              <Button
                variant={exportFormat === 'excel' ? 'default' : 'outline'}
                className={exportFormat === 'excel' ? 'bg-primary hover:bg-primary/90' : ''}
                onClick={() => setExportFormat('excel')}
              >
                <FileSpreadsheet className="h-4 w-4 mr-2" /> Excel
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Jenis Laporan</Label>
            <Select defaultValue="all">
              <SelectTrigger>
                <SelectValue placeholder="Pilih jenis laporan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Proyek</SelectItem>
                <SelectItem value="active">Proyek Aktif</SelectItem>
                <SelectItem value="completed">Proyek Selesai</SelectItem>
                <SelectItem value="financial">Laporan Keuangan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={onExport}>
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
