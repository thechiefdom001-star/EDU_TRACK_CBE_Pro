import { ReactNode } from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  subtitle?: string;
  menuButton?: ReactNode;
}

export function Header({ title, subtitle, menuButton }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b px-4 md:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {menuButton}
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground hidden sm:block">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="pl-9 w-48 lg:w-64" />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-destructive rounded-full text-[10px] text-white flex items-center justify-center">3</span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
          </Button>
        </div>
      </div>
    </header>
  );
}
