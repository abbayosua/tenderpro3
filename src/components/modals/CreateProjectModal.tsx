'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface ProjectData {
  title: string;
  description: string;
  category: string;
  location: string;
  budget: string;
  duration: string;
  requirements: string;
}

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newProject: ProjectData;
  setNewProject: (project: ProjectData) => void;
  onCreate: () => void;
  formatRupiah: (amount: number) => string;
}

export function CreateProjectModal({
  open,
  onOpenChange,
  newProject,
  setNewProject,
  onCreate,
  formatRupiah,
}: CreateProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Buat Proyek Baru</DialogTitle>
          <DialogDescription>Isi detail proyek yang ingin Anda kerjakan</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="projectTitle">Judul Proyek *</Label>
            <Input
              id="projectTitle"
              placeholder="contoh: Pembangunan Rumah 2 Lantai"
              value={newProject.title}
              onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectDescription">Deskripsi Proyek</Label>
            <Textarea
              id="projectDescription"
              placeholder="Jelaskan detail proyek Anda..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori Proyek</Label>
              <Select
                value={newProject.category}
                onValueChange={(v) => setNewProject({ ...newProject, category: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pembangunan Baru">Pembangunan Baru</SelectItem>
                  <SelectItem value="Renovasi">Renovasi</SelectItem>
                  <SelectItem value="Komersial">Komersial</SelectItem>
                  <SelectItem value="Interior">Interior</SelectItem>
                  <SelectItem value="Fasilitas">Fasilitas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectLocation">Lokasi</Label>
              <Input
                id="projectLocation"
                placeholder="contoh: Jakarta Selatan"
                value={newProject.location}
                onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectBudget">Anggaran (Rp) *</Label>
              <Input
                id="projectBudget"
                type="number"
                placeholder="contoh: 500000000"
                value={newProject.budget}
                onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
              />
              {newProject.budget && (
                <p className="text-xs text-slate-500">
                  Perkiraan: {formatRupiah(parseFloat(newProject.budget))}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectDuration">Durasi (hari)</Label>
              <Input
                id="projectDuration"
                type="number"
                placeholder="contoh: 90"
                value={newProject.duration}
                onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectRequirements">Persyaratan</Label>
            <Textarea
              id="projectRequirements"
              placeholder="Masukkan persyaratan, pisahkan dengan baris baru..."
              value={newProject.requirements}
              onChange={(e) => setNewProject({ ...newProject, requirements: e.target.value })}
              rows={3}
            />
            <p className="text-xs text-slate-500">
              contoh: memiliki IMB, pengalaman minimal 5 tahun, dll
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" /> Buat Proyek
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
