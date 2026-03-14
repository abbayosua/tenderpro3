'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Star, Briefcase, CheckCircle, Clock, Mail, Phone, MapPin } from 'lucide-react';

interface Portfolio {
  id: string;
  title: string;
  category: string;
  location?: string;
  budget?: number;
}

interface ContractorCompany {
  name: string;
  specialization?: string;
  experienceYears: number;
  rating: number;
  totalProjects: number;
  completedProjects: number;
  city?: string;
  province?: string;
  description?: string;
}

interface Contractor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isVerified: boolean;
  verificationStatus: string;
  company: ContractorCompany | null;
  portfolios: Portfolio[];
}

interface ContractorDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedContractor: Contractor | null;
}

export function ContractorDetailModal({
  open,
  onOpenChange,
  selectedContractor,
}: ContractorDetailModalProps) {
  if (!selectedContractor) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{selectedContractor.company?.name}</DialogTitle>
          <DialogDescription>{selectedContractor.company?.specialization}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Star,
                value: selectedContractor.company?.rating,
                label: 'Rating',
                color: 'yellow',
              },
              {
                icon: Briefcase,
                value: selectedContractor.company?.totalProjects,
                label: 'Total Proyek',
                color: 'primary',
              },
              {
                icon: CheckCircle,
                value: selectedContractor.company?.completedProjects,
                label: 'Selesai',
                color: 'blue',
              },
              {
                icon: Clock,
                value: selectedContractor.company?.experienceYears,
                label: 'Tahun',
                color: 'purple',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 bg-slate-50 rounded-lg">
                <stat.icon className={`h-6 w-6 text-${stat.color}-500 mx-auto mb-1`} />
                <p className="font-bold">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="font-semibold mb-2">Tentang</h4>
            <p className="text-slate-600">{selectedContractor.company?.description}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Informasi Kontak</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-400" />{' '}
                <span className="text-sm">{selectedContractor.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-400" />{' '}
                <span className="text-sm">{selectedContractor.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400" />{' '}
                <span className="text-sm">{selectedContractor.company?.city}</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Portofolio</h4>
            {selectedContractor.portfolios.length > 0 ? (
              <div className="space-y-3">
                {selectedContractor.portfolios.map((portfolio) => (
                  <div key={portfolio.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="font-medium">{portfolio.title}</h5>
                        <p className="text-sm text-slate-500">{portfolio.location}</p>
                      </div>
                      <Badge variant="outline">{portfolio.category}</Badge>
                    </div>
                    {portfolio.budget && (
                      <p className="text-sm text-primary font-medium mt-2">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(portfolio.budget)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Belum ada portofolio</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
