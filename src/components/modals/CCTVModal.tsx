'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Video, Camera, Pause, Play, Maximize2, Settings, Flag } from 'lucide-react';

interface CCTVModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProjectForCCTV: { id: string; title: string; status: string } | null;
  selectedCamera: number;
  setSelectedCamera: (camera: number) => void;
  cctvIsPlaying: boolean;
  setCctvIsPlaying: (playing: boolean) => void;
  onProgressClick: () => void;
  onScreenshot: () => void;
  onRecord: () => void;
  onZoom: () => void;
}

export function CCTVModal({
  open,
  onOpenChange,
  selectedProjectForCCTV,
  selectedCamera,
  setSelectedCamera,
  cctvIsPlaying,
  setCctvIsPlaying,
  onProgressClick,
  onScreenshot,
  onRecord,
  onZoom,
}: CCTVModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-600" />
            CCTV Proyek
          </DialogTitle>
          <DialogDescription>
            {selectedProjectForCCTV?.title} - Status:{' '}
            {selectedProjectForCCTV?.status === 'IN_PROGRESS' ? 'Sedang Berjalan' : selectedProjectForCCTV?.status}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <img
              src="https://giffiles.alphacoders.com/158/158676.gif"
              alt="CCTV Feed"
              className="w-full h-full object-cover"
            />

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">LIVE - Camera {selectedCamera}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => setCctvIsPlaying(!cctvIsPlaying)}
                  >
                    {cctvIsPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {new Date().toLocaleString('id-ID', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((cam) => (
              <Button
                key={cam}
                variant={selectedCamera === cam ? 'default' : 'outline'}
                className={`flex items-center gap-2 ${
                  selectedCamera === cam ? 'bg-blue-600 hover:bg-blue-700' : ''
                }`}
                onClick={() => setSelectedCamera(cam)}
              >
                <Camera className="h-4 w-4" />
                Cam {cam}
              </Button>
            ))}
          </div>

          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-slate-500">Lokasi Kamera</p>
                  <p className="font-medium">Area Konstruksi {selectedCamera}</p>
                </div>
                <div>
                  <p className="text-slate-500">Status</p>
                  <p className="font-medium text-green-600">Online</p>
                </div>
                <div>
                  <p className="text-slate-500">Kualitas</p>
                  <p className="font-medium">HD 1080p</p>
                </div>
                <div>
                  <p className="text-slate-500">Rekam Sejak</p>
                  <p className="font-medium">06:00 WIB</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={onScreenshot}>
              <Camera className="h-4 w-4 mr-2" /> Ambil Screenshot
            </Button>
            <Button variant="outline" onClick={onRecord}>
              <Video className="h-4 w-4 mr-2" /> Rekam
            </Button>
            <Button variant="outline" onClick={onZoom}>
              <Maximize2 className="h-4 w-4 mr-2" /> Zoom
            </Button>
            <Button variant="outline" onClick={onProgressClick}>
              <Flag className="h-4 w-4 mr-2" /> Lihat Progress
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
