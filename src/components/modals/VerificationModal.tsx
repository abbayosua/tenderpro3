import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Upload, FileCheck, Clock } from 'lucide-react';

interface Document {
  id: string;
  type: string;
  name: string;
  verified: boolean;
}

interface VerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  docType: string;
  setDocType: (value: string) => void;
  docName: string;
  setDocName: (value: string) => void;
  documents: Document[];
  onUpload: () => void;
  onRequestVerification: () => void;
}

export function VerificationModal({
  open,
  onOpenChange,
  docType,
  setDocType,
  docName,
  setDocName,
  documents,
  onUpload,
  onRequestVerification
}: VerificationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Verifikasi Akun</DialogTitle>
          <DialogDescription>Unggah dokumen untuk verifikasi akun Anda</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Jenis Dokumen</Label>
            <div className="grid grid-cols-2 gap-2">
              {['KTP', 'NPWP', 'SIUP', 'NIB', 'Akta Perusahaan'].map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={docType === type ? 'default' : 'outline'}
                  className={docType === type ? 'bg-primary hover:bg-primary/90' : ''}
                  onClick={() => setDocType(type)}
                >
                  {type}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="docName">Nama Dokumen</Label>
            <Input
              id="docName"
              placeholder="contoh: KTP - Ahmad Sulaiman"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
            />
          </div>

          {documents.length > 0 && (
            <div>
              <Label>Dokumen Terunggah</Label>
              <div className="mt-2 space-y-2">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-slate-500" />
                      <span className="text-sm">{doc.name}</span>
                    </div>
                    {doc.verified ? (
                      <Badge className="bg-primary">
                        <FileCheck className="h-3 w-3 mr-1" /> Terverifikasi
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <Clock className="h-3 w-3 mr-1" /> Pending
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={onUpload}>
              <Upload className="h-4 w-4 mr-2" /> Unggah Dokumen
            </Button>
          </div>

          {documents.length > 0 && (
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full" onClick={onRequestVerification}>
                Ajukan Permintaan Verifikasi
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
