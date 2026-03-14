'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FolderOpen, Upload, Download, Eye, FileText
} from 'lucide-react';
import { toast } from 'sonner';
import type { OwnerStats } from '@/types';

// Mock data for documents
const mockDocuments = [
  { name: 'Kontrak_Kerja_Rumah_2Lantai.pdf', type: 'KONTRAK', project: 'Pembangunan Rumah 2 Lantai', date: '15 Jan 2025', size: '2.4 MB', approved: true },
  { name: 'Gambar_Teknis_Floor_Plan.pdf', type: 'GAMBAR', project: 'Pembangunan Rumah 2 Lantai', date: '14 Jan 2025', size: '5.1 MB', approved: true },
  { name: 'RAB_Renovasi_Kantor.pdf', type: 'RAB', project: 'Renovasi Kantor Pusat', date: '10 Jan 2025', size: '1.2 MB', approved: false },
  { name: 'Invoice_Pembayaran_1.pdf', type: 'INVOICE', project: 'Pembangunan Rumah 2 Lantai', date: '08 Jan 2025', size: '340 KB', approved: true },
  { name: 'SPK_Pembangunan_Gudang.pdf', type: 'SPK', project: 'Pembangunan Gudang Baru', date: '05 Jan 2025', size: '890 KB', approved: true },
];

const getTypeStyles = (type: string) => {
  const styles: Record<string, { bg: string; text: string }> = {
    KONTRAK: { bg: 'bg-blue-100', text: 'text-blue-600' },
    GAMBAR: { bg: 'bg-purple-100', text: 'text-purple-600' },
    INVOICE: { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    SPK: { bg: 'bg-orange-100', text: 'text-orange-600' },
    RAB: { bg: 'bg-slate-100', text: 'text-slate-600' },
  };
  return styles[type] || { bg: 'bg-slate-100', text: 'text-slate-600' };
};

interface DocumentsTabProps {
  ownerStats: OwnerStats;
}

export function DocumentsTab({ ownerStats }: DocumentsTabProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-primary" />
              Dokumen Proyek
            </CardTitle>
            <CardDescription>Kelola semua dokumen proyek Anda</CardDescription>
          </div>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => toast.info('Fitur upload dokumen dalam pengembangan')}>
            <Upload className="h-4 w-4 mr-2" /> Upload Dokumen
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="KONTRAK">Kontrak</SelectItem>
              <SelectItem value="GAMBAR">Gambar Teknis</SelectItem>
              <SelectItem value="INVOICE">Invoice</SelectItem>
              <SelectItem value="SPK">SPK</SelectItem>
              <SelectItem value="RAB">RAB</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter Proyek" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Proyek</SelectItem>
              {ownerStats.projects.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {mockDocuments.map((doc, idx) => {
            const styles = getTypeStyles(doc.type);
            return (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${styles.bg}`}>
                    <FileText className={`h-5 w-5 ${styles.text}`} />
                  </div>
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <p className="text-sm text-slate-500">{doc.project} • {doc.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-slate-500">{doc.date}</p>
                    {doc.approved ? (
                      <Badge className="bg-primary/10 text-primary text-xs">Disetujui</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">Pending</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => toast.success('Membuka dokumen...')}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => toast.success('Mengunduh dokumen...')}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
