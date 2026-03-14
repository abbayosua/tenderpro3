'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  FolderOpen, Building2, FileText, Clock, MapPin, Eye, Plus, Search,
  Star, CheckCircle, Video, Flag, Upload, Download,
  DollarSign, Heart, Scale, Calendar, Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { StatsCard, QuickActions, PieChartCard, BarChartCard } from '@/components/dashboard';
import { VerificationAlert } from '@/components/common';
import { formatRupiah, calculateMatchScore } from '@/lib/utils';
import { OWNER_CHART_CONFIG, PROJECT_CATEGORY_DATA, MONTHLY_PROGRESS_DATA } from '@/lib/constants';
import type { User, OwnerStats, Notification, Favorite, Milestone, Contractor } from '@/types';

// Import extracted components
import { ProjectCard } from './ProjectCard';
import { BidCard } from './BidCard';

interface OwnerDashboardProps {
  user: User;
  ownerStats: OwnerStats;
  notifications: Notification[];
  unreadCount: number;
  favorites: Favorite[];
  milestones: Milestone[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  onLogout: () => void;
  onShowVerificationModal: () => void;
  onShowCreateProjectModal: () => void;
  onShowExportModal: () => void;
  onShowCCTVModal: (project: { id: string; title: string; status: string }) => void;
  onShowProgressModal: (project: { id: string; title: string; category: string; budget: number }) => void;
  onLoadMilestones: (projectId: string) => void;
  onAcceptBid: (bidId: string) => void;
  onRejectBid: (bidId: string) => void;
  onAddFavorite: (contractorId: string) => void;
  onRemoveFavorite: (favoriteId: string) => void;
  toggleBidSelection: (bidId: string) => void;
  selectedBidsForCompare: string[];
  onShowCompareModal: () => void;
  renderModals: () => React.ReactNode;
}

export function OwnerDashboard({
  user,
  ownerStats,
  notifications,
  unreadCount,
  favorites,
  milestones,
  onMarkNotificationRead,
  onMarkAllRead,
  onLogout,
  onShowVerificationModal,
  onShowCreateProjectModal,
  onShowExportModal,
  onShowCCTVModal,
  onShowProgressModal,
  onLoadMilestones,
  onAcceptBid,
  onRejectBid,
  onAddFavorite,
  onRemoveFavorite,
  toggleBidSelection,
  selectedBidsForCompare,
  onShowCompareModal,
  renderModals,
}: OwnerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const quickActions = [
    { label: 'Buat Proyek Baru', icon: Plus, onClick: onShowCreateProjectModal, className: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
    { label: 'Lihat Semua Penawaran', icon: Eye, onClick: () => toast.info('Lihat semua penawaran di tab Penawaran Masuk') },
    { label: 'Laporan', icon: FileText, onClick: onShowExportModal },
    { label: 'CCTV Proyek', icon: Video, onClick: () => {
      const firstInProgress = ownerStats.projects.find(p => p.status === 'IN_PROGRESS');
      if (firstInProgress) {
        onShowCCTVModal({ id: firstInProgress.id, title: firstInProgress.title, status: firstInProgress.status });
      } else {
        toast.info('Tidak ada proyek yang sedang berjalan');
      }
    }},
  ];

  const statsCards = [
    { label: 'Total Proyek', value: ownerStats.totalProjects, icon: FolderOpen, trend: '+12%', trendUp: true, color: 'primary' as const },
    { label: 'Proyek Aktif', value: ownerStats.activeProjects, icon: Building2, trend: '+5%', trendUp: true, color: 'blue' as const },
    { label: 'Tender Terbuka', value: ownerStats.openProjects, icon: FileText, trend: '-2%', trendUp: false, color: 'yellow' as const },
    { label: 'Penawaran Pending', value: ownerStats.totalPendingBids, icon: Clock, trend: '+8%', trendUp: true, color: 'purple' as const },
  ];

  // Filter projects
  const filteredProjects = ownerStats.projects
    .filter(project => filterStatus === 'all' || project.status === filterStatus)
    .filter(project => searchQuery === '' || project.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50">
      {renderModals()}
      <DashboardHeader
        user={user}
        notifications={notifications}
        unreadCount={unreadCount}
        onMarkNotificationRead={onMarkNotificationRead}
        onMarkAllRead={onMarkAllRead}
        onLogout={onLogout}
        roleLabel="Pemilik Proyek"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <VerificationAlert user={user} onUploadClick={onShowVerificationModal} />
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {statsCards.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PieChartCard
            title="Proyek per Kategori"
            description="Distribusi proyek berdasarkan kategori"
            data={PROJECT_CATEGORY_DATA}
            config={OWNER_CHART_CONFIG}
          />
          <BarChartCard
            title="Progress Bulanan"
            description="Proyek baru vs selesai per bulan"
            data={MONTHLY_PROGRESS_DATA}
            config={OWNER_CHART_CONFIG}
            bars={[
              { dataKey: 'proyek', fill: 'hsl(var(--primary))' },
              { dataKey: 'selesai', fill: 'var(--color-yellow)' },
            ]}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="projects"><FolderOpen className="h-4 w-4 mr-2" /> Proyek Saya</TabsTrigger>
            <TabsTrigger value="bids"><FileText className="h-4 w-4 mr-2" /> Penawaran Masuk</TabsTrigger>
            <TabsTrigger value="timeline"><Flag className="h-4 w-4 mr-2" /> Timeline</TabsTrigger>
            <TabsTrigger value="documents"><FolderOpen className="h-4 w-4 mr-2" /> Dokumen</TabsTrigger>
            <TabsTrigger value="payments"><DollarSign className="h-4 w-4 mr-2" /> Pembayaran</TabsTrigger>
            <TabsTrigger value="favorites"><Star className="h-4 w-4 mr-2" /> Favorit</TabsTrigger>
          </TabsList>

          {/* Tab: Proyek Saya */}
          <TabsContent value="projects">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Cari proyek..."
                    className="pl-10 w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="OPEN">Tender Terbuka</SelectItem>
                    <SelectItem value="IN_PROGRESS">Sedang Berjalan</SelectItem>
                    <SelectItem value="COMPLETED">Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {ownerStats.projects.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FolderOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">Belum ada proyek</p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" onClick={onShowCreateProjectModal}>
                    <Plus className="h-4 w-4 mr-2" /> Buat Proyek Pertama
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onShowCCTVModal={onShowCCTVModal}
                  onShowProgressModal={onShowProgressModal}
                  onLoadMilestones={onLoadMilestones}
                  onAcceptBid={onAcceptBid}
                  onRejectBid={onRejectBid}
                />
              ))
            )}
          </TabsContent>

          {/* Tab: Penawaran Masuk */}
          <TabsContent value="bids">
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
                  {ownerStats.projects.filter(p => p.bids.length > 0).flatMap(p => p.bids).length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                      <p>Belum ada penawaran masuk</p>
                    </div>
                  ) : (
                    ownerStats.projects.filter(p => p.bids.length > 0 && p.status === 'OPEN').flatMap(project =>
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
                            onToggleSelect={() => toggleBidSelection(bid.id)}
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
          </TabsContent>

          {/* Tab: Favorit */}
          <TabsContent value="favorites">
            <Card>
              <CardContent className="p-6">
                {!favorites || favorites.length === 0 ? (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 mb-4">Belum ada kontraktor favorit</p>
                    <p className="text-sm text-slate-400">Tambahkan kontraktor ke favorit dari daftar penawaran</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {favorites.map((fav) => (
                      <Card key={fav.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                                <Building2 className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <p className="font-semibold">{fav.contractor.name}</p>
                                <p className="text-sm text-slate-500">{fav.contractor.company?.name}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => onRemoveFavorite(fav.id)}>
                              <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                            </Button>
                          </div>
                          {fav.contractor.company && (
                            <div className="flex items-center gap-4 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-sm">{fav.contractor.company.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span className="text-sm text-slate-500">{fav.contractor.company.totalProjects} proyek</span>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Timeline */}
          <TabsContent value="timeline">
            <TimelineTab 
              ownerStats={ownerStats}
              onShowProgressModal={onShowProgressModal}
              onLoadMilestones={onLoadMilestones}
            />
          </TabsContent>

          {/* Tab: Dokumen */}
          <TabsContent value="documents">
            <DocumentsTab ownerStats={ownerStats} />
          </TabsContent>

          {/* Tab: Pembayaran */}
          <TabsContent value="payments">
            <PaymentsTab onShowExportModal={onShowExportModal} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// === Inline Tab Components ===

// Timeline Tab Component
function TimelineTab({ 
  ownerStats, 
  onShowProgressModal, 
  onLoadMilestones 
}: { 
  ownerStats: OwnerStats; 
  onShowProgressModal: (project: { id: string; title: string; category: string; budget: number }) => void; 
  onLoadMilestones: (projectId: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-primary" />
          Timeline Proyek
        </CardTitle>
        <CardDescription>Pantau progress dan milestone semua proyek Anda</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {ownerStats.projects.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Flag className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>Belum ada proyek untuk ditampilkan timeline</p>
          </div>
        ) : (
          <div className="space-y-6">
            {ownerStats.projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'COMPLETED').map((project) => (
              <Card key={project.id} className="border-l-4 border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={project.status === 'IN_PROGRESS' ? 'bg-blue-600' : 'bg-primary'}>
                          {project.status === 'IN_PROGRESS' ? 'Sedang Berjalan' : 'Selesai'}
                        </Badge>
                        <Badge variant="outline">{project.category}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg">{project.title}</h3>
                      <p className="text-sm text-slate-500">{project.location} • {formatRupiah(project.budget)}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        onShowProgressModal({ id: project.id, title: project.title, category: project.category, budget: project.budget });
                        onLoadMilestones(project.id);
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" /> Detail
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Progress</span>
                        <span className="font-medium text-primary">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="text-sm text-slate-500">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Est. 90 hari
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {ownerStats.projects.filter(p => p.status === 'IN_PROGRESS' || p.status === 'COMPLETED').length === 0 && (
              <div className="text-center py-8 text-slate-500">
                <p>Tidak ada proyek yang sedang berjalan atau selesai</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Documents Tab Component
function DocumentsTab({ ownerStats }: { ownerStats: OwnerStats }) {
  const mockDocuments = [
    { name: 'Kontrak_Kerja_Rumah_2Lantai.pdf', type: 'KONTRAK', project: 'Pembangunan Rumah 2 Lantai', date: '15 Jan 2025', size: '2.4 MB', approved: true },
    { name: 'Gambar_Teknis_Floor_Plan.pdf', type: 'GAMBAR', project: 'Pembangunan Rumah 2 Lantai', date: '14 Jan 2025', size: '5.1 MB', approved: true },
    { name: 'RAB_Renovasi_Kantor.pdf', type: 'RAB', project: 'Renovasi Kantor Pusat', date: '10 Jan 2025', size: '1.2 MB', approved: false },
    { name: 'Invoice_Pembayaran_1.pdf', type: 'INVOICE', project: 'Pembangunan Rumah 2 Lantai', date: '08 Jan 2025', size: '340 KB', approved: true },
    { name: 'SPK_Pembangunan_Gudang.pdf', type: 'SPK', project: 'Pembangunan Gudang Baru', date: '05 Jan 2025', size: '890 KB', approved: true },
  ];

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
          {mockDocuments.map((doc, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-5">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  doc.type === 'KONTRAK' ? 'bg-blue-100' :
                  doc.type === 'GAMBAR' ? 'bg-purple-100' :
                  doc.type === 'INVOICE' ? 'bg-yellow-100' :
                  doc.type === 'SPK' ? 'bg-orange-100' : 'bg-slate-100'
                }`}>
                  <FileText className={`h-5 w-5 ${
                    doc.type === 'KONTRAK' ? 'text-blue-600' :
                    doc.type === 'GAMBAR' ? 'text-purple-600' :
                    doc.type === 'INVOICE' ? 'text-yellow-600' :
                    doc.type === 'SPK' ? 'text-orange-600' : 'text-slate-600'
                  }`} />
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Payments Tab Component
function PaymentsTab({ onShowExportModal }: { onShowExportModal: () => void }) {
  const mockPayments = [
    { project: 'Pembangunan Rumah 2 Lantai', milestone: 'Pembayaran Awal (DP 30%)', amount: 225000000, status: 'PAID', date: '15 Jan 2025', method: 'Transfer Bank' },
    { project: 'Pembangunan Rumah 2 Lantai', milestone: 'Pembayaran Progress 1 (20%)', amount: 150000000, status: 'PAID', date: '01 Feb 2025', method: 'Transfer Bank' },
    { project: 'Pembangunan Rumah 2 Lantai', milestone: 'Pembayaran Progress 2 (20%)', amount: 150000000, status: 'PENDING', date: 'Pending', method: '-' },
    { project: 'Renovasi Kantor Pusat', milestone: 'Down Payment (25%)', amount: 125000000, status: 'PAID', date: '10 Jan 2025', method: 'Transfer Bank' },
    { project: 'Renovasi Kantor Pusat', milestone: 'Pembayaran Progress (25%)', amount: 125000000, status: 'PENDING', date: 'Pending', method: '-' },
    { project: 'Pembangunan Gudang Baru', milestone: 'DP Kontrak (20%)', amount: 100000000, status: 'PAID', date: '05 Jan 2025', method: 'Transfer Bank' },
  ];

  return (
    <>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Anggaran</p>
                <p className="text-2xl font-bold text-slate-800">{formatRupiah(1250000000)}</p>
              </div>
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Sudah Dibayar</p>
                <p className="text-2xl font-bold text-primary">{formatRupiah(750000000)}</p>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Sisa Pembayaran</p>
                <p className="text-2xl font-bold text-yellow-600">{formatRupiah(500000000)}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-primary" />
                Riwayat Pembayaran
              </CardTitle>
              <CardDescription>Tracking pembayaran milestone proyek</CardDescription>
            </div>
            <Button variant="outline" onClick={onShowExportModal}>
              <Download className="h-4 w-4 mr-2" /> Export Laporan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {mockPayments.map((payment, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    payment.status === 'PAID' ? 'bg-primary/10' : 'bg-yellow-100'
                  }`}>
                    {payment.status === 'PAID' ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{payment.milestone}</p>
                    <p className="text-sm text-slate-500">{payment.project}</p>
                    <p className="text-xs text-slate-400">{payment.method} • {payment.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${payment.status === 'PAID' ? 'text-primary' : 'text-yellow-600'}`}>
                    {formatRupiah(payment.amount)}
                  </p>
                  <Badge className={payment.status === 'PAID' ? 'bg-primary/10 text-primary' : 'bg-yellow-100 text-yellow-700'}>
                    {payment.status === 'PAID' ? 'Lunas' : 'Menunggu'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
