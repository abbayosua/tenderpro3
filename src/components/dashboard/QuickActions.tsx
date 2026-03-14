'use client';

import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

export interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {actions.map((action, index) => (
        <Button
          key={index}
          variant={action.variant || 'outline'}
          className={action.className}
          onClick={action.onClick}
        >
          <action.icon className="h-4 w-4 mr-2" /> {action.label}
        </Button>
      ))}
    </div>
  );
}
