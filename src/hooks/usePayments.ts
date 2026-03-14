'use client';

import { useState, useCallback } from 'react';
import type { Payment, PaymentStats } from '@/types';
import { useAuthStore } from '@/lib/auth-store';
import { toast } from 'sonner';

interface RecordPaymentData {
  amount: string;
  method: string;
  transactionId: string;
  notes: string;
}

interface UsePaymentsReturn {
  payments: Payment[];
  paymentStats: PaymentStats;
  loading: boolean;
  error: string | null;
  loadPayments: (milestoneId: string) => Promise<void>;
  recordPayment: (milestoneId: string, data: RecordPaymentData) => Promise<boolean>;
  confirmPayment: (paymentId: string) => Promise<boolean>;
  clearPayments: () => void;
}

export function usePayments(): UsePaymentsReturn {
  const { user } = useAuthStore();
  
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paymentStats, setPaymentStats] = useState<PaymentStats>({
    totalBudget: 0,
    totalPaid: 0,
    percentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPayments = useCallback(async (milestoneId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/payments?milestoneId=${milestoneId}`);
      const data = await res.json();
      
      setPayments(data.payments || []);
      setPaymentStats(data.stats || { totalBudget: 0, totalPaid: 0, percentage: 0 });
    } catch (err) {
      console.error('Failed to fetch payments:', err);
      setError('Failed to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordPayment = useCallback(async (milestoneId: string, paymentData: RecordPaymentData): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          milestoneId,
          amount: parseFloat(paymentData.amount),
          method: paymentData.method,
          transactionId: paymentData.transactionId || null,
          notes: paymentData.notes || null,
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Pembayaran berhasil dicatat!');
        await loadPayments(milestoneId);
        return true;
      } else {
        toast.error(data.error || 'Gagal mencatat pembayaran');
        return false;
      }
    } catch (err) {
      console.error('Failed to record payment:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, [user, loadPayments]);

  const confirmPayment = useCallback(async (paymentId: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      const res = await fetch('/api/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          paymentId, 
          status: 'CONFIRMED', 
          confirmedBy: user.id 
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        toast.success('Pembayaran dikonfirmasi!');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to confirm payment:', err);
      toast.error('Terjadi kesalahan');
      return false;
    }
  }, [user]);

  const clearPayments = useCallback(() => {
    setPayments([]);
    setPaymentStats({ totalBudget: 0, totalPaid: 0, percentage: 0 });
  }, []);

  return {
    payments,
    paymentStats,
    loading,
    error,
    loadPayments,
    recordPayment,
    confirmPayment,
    clearPayments,
  };
}
