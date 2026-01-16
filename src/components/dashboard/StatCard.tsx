import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
}

const variantStyles = {
  default: 'bg-card border-border',
  primary: 'bg-primary/5 border-primary/20',
  secondary: 'bg-secondary/10 border-secondary/20',
  success: 'bg-success/5 border-success/20',
  warning: 'bg-warning/5 border-warning/20',
};

const iconStyles = {
  default: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/20 text-secondary',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
};

export function StatCard({ title, value, icon, change, variant = 'default' }: StatCardProps) {
  return (
    <div className={cn(
      "rounded-xl border p-6 transition-shadow hover:shadow-md",
      variantStyles[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {change && (
            <p className={cn(
              "text-sm mt-2 flex items-center gap-1",
              change.type === 'increase' ? 'text-success' : 'text-destructive'
            )}>
              <span>{change.type === 'increase' ? '↑' : '↓'}</span>
              {Math.abs(change.value)}% from last term
            </p>
          )}
        </div>
        <div className={cn(
          "h-12 w-12 rounded-xl flex items-center justify-center",
          iconStyles[variant]
        )}>
          {icon}
        </div>
      </div>
    </div>
  );
}
