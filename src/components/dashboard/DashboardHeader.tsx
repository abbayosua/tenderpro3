'use client';

import { Button } from '@/components/ui/button';
import { Building2, LogOut, MessageSquare } from 'lucide-react';
import { NotificationPanel } from './NotificationPanel';
import type { User, Notification } from '@/types';

interface DashboardHeaderProps {
  user: User;
  notifications?: Notification[];
  unreadCount?: number;
  onMarkNotificationRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onLogout: () => void;
  roleLabel?: string;
}

export function DashboardHeader({ 
  user, 
  notifications = [], 
  unreadCount = 0, 
  onMarkNotificationRead, 
  onMarkAllRead,
  onLogout,
  roleLabel = 'User'
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold text-slate-800">TenderPro</span>
        </div>
        <div className="flex items-center gap-4">
          {onMarkNotificationRead && onMarkAllRead && (
            <NotificationPanel
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllRead}
            />
          )}
          <Button variant="ghost" size="icon" className="relative">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <div className="text-right">
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-slate-500">{roleLabel}</p>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Keluar
          </Button>
        </div>
      </div>
    </header>
  );
}
