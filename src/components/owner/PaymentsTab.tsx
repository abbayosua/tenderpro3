'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, CheckCircle, Clock, Download } from 'lucide-react';
import { formatRupiah } from '@/lib/utils';

// Mock data for payments
const mockPayments = [
  { project: 'Pembangunan Rumah 2 Lantai', milestone: 'Pembayaran Awal (DP 30%)', amount: 225000000, status: 'PAID', date: '15 Jan 2025', method: 'Transfer Bank' },
  { project: 'Pembangunan Rumah 2 Lantai', milestone: 'Pembayaran Progress 1 (20%)', amount: 150000000, status: 'PAID', date: '01 Feb 2025', method: 'Transfer Bank' },
  { project: 'Pembangunan Rumah 2 Lantai', milestone: 'Pembayaran Progress 2 (20%)', amount: 150000000, status: 'PENDING', date: 'Pending', method: '-' },
  { project: 'Renovasi Kantor Pusat', milestone: 'Down Payment (25%)', amount: 125000000, status: 'PAID', date: '10 Jan 2025', method: 'Transfer Bank' },
  { project: 'Renovasi Kantor Pusat', milestone: 'Pembayaran Progress (25%)', amount: 125000000, status: 'PENDING', date: 'Pending', method: '-' },
  { project: 'Pembangunan Gudang Baru', milestone: 'DP Kontrak (20%)', amount: 100000000, status: 'PAID', date: '05 Jan 2025', method: 'Transfer Bank' },
];

interface PaymentsTabProps {
  onShowExportModal: () => void;
}

export function PaymentsTab({ onShowExportModal }: PaymentsTabProps) {
  const totalBudget = 1250000000;
  const totalPaid = 750000000;
  const remaining = totalBudget - totalPaid;

  return (
    <>
      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total Anggaran</p>
                <p className="text-2xl font-bold text-slate-800">{formatRupiah(totalBudget)}</p>
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
                <p className="text-2xl font-bold text-primary">{formatRupiah(totalPaid)}</p>
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
                <p className="text-2xl font-bold text-yellow-600">{formatRupiah(remaining)}</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
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
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
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
