'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, FileText, Clock, MapPin, Eye, Search,
  Star, CheckCircle, X, MessageSquare, Plus, Edit, FolderOpen, TrendingUp
} from 'lucide-react';
import { toast } from 'sonner';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SimpleStatsCard } from '@/components/dashboard/StatsCard';
import { QuickActions } from '@/components/dashboard';
import { VerificationAlert } from '@/components/common';
import { formatRupiah } from '@/lib/utils';
import type { User, ContractorStats, Project } from '@/types';

interface ContractorDashboardProps {
  user: User;
  contractorStats: ContractorStats;
  onLogout: () => void;
  onShowVerificationModal: () => void;
  onShowBidModal: (project: Project) => void;
  renderModals: () => React.ReactNode;
}

export function ContractorDashboard({
  user,
  contractorStats,
  onLogout,
  onShowVerificationModal,
  onShowBidModal,
  renderModals,
}: ContractorDashboardProps) {
  const quickActions = [
    { label: 'Cari Proyek', icon: Search, onClick: () => {}, className: 'bg-primary hover:bg-primary/90 text-primary-foreground' },
    { label: 'Penawaran Saya', icon: FileText, onClick: () => {} },
    { label: 'Unggah Dokumen', icon: FileText, onClick: onShowVerificationModal },
    { label: 'Portofolio', icon: FolderOpen, onClick: () => toast.info('Fitur portofolio dalam pengembangan') },
  ];

  const statsCards = [
    { label: 'Total Penawaran', value: contractorStats.totalBids, icon: FileText, color: 'primary' as const },
    { label: 'Diterima', value: contractorStats.acceptedBids, icon: CheckCircle, color: 'primary' as const },
    { label: 'Pending', value: contractorStats.pendingBids, icon: Clock, color: 'yellow' as const },
    { label: 'Win Rate', value: `${contractorStats.winRate}%`, icon: TrendingUp, color: 'purple' as const },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {renderModals()}
      <DashboardHeader
        user={user}
        onLogout={onLogout}
        roleLabel="Kontraktor"
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <VerificationAlert user={user} onUploadClick={onShowVerificationModal} />
        
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat) => (
            <SimpleStatsCard key={stat.label} {...stat} />
          ))}
        </div>

        {/* Quick Actions */}
        <QuickActions actions={quickActions} />

        {/* Main Content Tabs */}
        <Tabs defaultValue="tender" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tender"><Search className="h-4 w-4 mr-2" /> Proyek Tersedia</TabsTrigger>
            <TabsTrigger value="bids"><FileText className="h-4 w-4 mr-2" /> Penawaran Saya</TabsTrigger>
            <TabsTrigger value="portfolio"><FolderOpen className="h-4 w-4 mr-2" /> Portofolio</TabsTrigger>
          </TabsList>

          {/* Tab: Proyek Tersedia */}
          <TabsContent value="tender">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contractorStats.availableProjects.map((project) => (
                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Badge variant="outline" className="bg-primary/10 text-primary">{project.category}</Badge>
                      {project.hasBid ? (
                        <Badge className="bg-blue-100 text-blue-700">Sudah Mengajukan</Badge>
                      ) : (
                        <Badge variant="secondary">{project.bidCount} Penawaran</Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <div>
                        <p className="text-slate-500">Anggaran</p>
                        <p className="font-bold text-primary">{formatRupiah(project.budget)}</p>
                      </div>
                      {project.duration && (
                        <div className="text-right">
                          <p className="text-slate-500">Durasi</p>
                          <p className="font-medium">{project.duration} hari</p>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{project.owner.company || project.owner.name}</p>
                  </CardContent>
                  <CardFooter className="bg-slate-50 border-t">
                    {!project.hasBid ? (
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90" 
                        onClick={() => onShowBidModal(project as unknown as Project)}
                      >
                        Ajukan Penawaran
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" disabled>Sudah Mengajukan</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tab: Penawaran Saya */}
          <TabsContent value="bids">
            <div className="space-y-4">
              {contractorStats.recentBids.map((bid) => (
                <Card key={bid.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{bid.project.title}</h3>
                        <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                          <MapPin className="h-4 w-4" /> {bid.project.location} • {bid.project.category}
                        </p>
                      </div>
                      <Badge className={bid.status === 'ACCEPTED' ? 'bg-primary' : bid.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                        {bid.status === 'ACCEPTED' ? 'Diterima' : bid.status === 'PENDING' ? 'Pending' : 'Ditolak'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-6 mt-4">
                      <div>
                        <p className="text-sm text-slate-500">Penawaran Anda</p>
                        <p className="font-bold text-primary">{formatRupiah(bid.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Anggaran Proyek</p>
                        <p className="font-medium">{formatRupiah(bid.project.budget)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-500">Pemilik Proyek</p>
                        <p className="font-medium">{bid.project.owner.name}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      {bid.status === 'ACCEPTED' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => toast.success('Detail proyek dibuka!')}>
                            <Eye className="h-4 w-4 mr-2" /> Lihat Detail
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toast.info('Fitur chat dalam pengembangan')}>
                            <MessageSquare className="h-4 w-4 mr-2" /> Chat Owner
                          </Button>
                        </>
                      )}
                      {bid.status === 'PENDING' && (
                        <>
                          <Button variant="outline" size="sm" onClick={() => toast.info('Menunggu respons dari pemilik proyek')}>
                            <Clock className="h-4 w-4 mr-2" /> Menunggu Respons
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700" onClick={() => toast.success('Penawaran dibatalkan')}>
                            <X className="h-4 w-4 mr-2" /> Batalkan
                          </Button>
                        </>
                      )}
                      {bid.status === 'REJECTED' && (
                        <Button variant="outline" size="sm" onClick={() => toast.info('Cari proyek lain yang sesuai')}>
                          <Search className="h-4 w-4 mr-2" /> Cari Proyek Lain
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {contractorStats.recentBids.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-4">Belum ada penawaran</p>
                    <Button className="bg-primary hover:bg-primary/90">
                      <Search className="h-4 w-4 mr-2" /> Cari Proyek
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Tab: Portofolio */}
          <TabsContent value="portfolio">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-primary" />
                      Portofolio Proyek
                    </CardTitle>
                    <CardDescription>Tampilkan hasil kerja Anda untuk menarik klien</CardDescription>
                  </div>
                  <Button className="bg-primary hover:bg-primary/90" onClick={() => toast.info('Fitur upload portofolio dalam pengembangan')}>
                    <Plus className="h-4 w-4 mr-2" /> Tambah Portofolio
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <PortfolioGrid />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Portfolio Grid Component
function PortfolioGrid() {
  const portfolioItems = [
    { title: 'Rumah Mewah 2 Lantai', location: 'Jakarta Selatan', year: '2024', image: 'https://loremflickr.com/g/400/300/house,luxury/all' },
    { title: 'Renovasi Kantor', location: 'BSD City', year: '2024', image: 'https://loremflickr.com/g/400/300/office,modern/all' },
    { title: 'Ruko Modern', location: 'Tangerang', year: '2023', image: 'https://loremflickr.com/g/400/300/shop,building/all' },
  ];

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {portfolioItems.map((item, idx) => (
        <Card key={idx} className="overflow-hidden group cursor-pointer">
          <div className="relative h-40">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => toast.info('Detail portofolio')}>
                <Eye className="h-4 w-4 mr-1" /> Lihat
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => toast.info('Edit portofolio')}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
            </div>
          </div>
          <CardContent className="p-3">
            <h4 className="font-medium text-sm">{item.title}</h4>
            <p className="text-xs text-slate-500">{item.location} • {item.year}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
