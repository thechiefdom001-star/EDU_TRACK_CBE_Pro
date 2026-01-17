import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, School, BookOpen, 
  ClipboardList, Calendar, UserCheck, Receipt, CreditCard, 
  Bell, Wallet, Library, Bus, Settings, ChevronDown, ChevronRight,
  Layers, BookMarked, FileText, X, Menu, LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  children?: { to: string; label: string }[];
  onClick?: () => void;
}

function NavItem({ to, icon, label, children, onClick }: NavItemProps) {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = location.pathname === to || children?.some(c => location.pathname === c.to);

  if (children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "sidebar-item w-full justify-between",
            isActive && "bg-sidebar-accent text-sidebar-foreground"
          )}
        >
          <span className="flex items-center gap-3">
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </span>
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isOpen && (
          <div className="ml-6 mt-1 space-y-1">
            {children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                onClick={onClick}
                className={({ isActive }) =>
                  cn(
                    "sidebar-item text-sm",
                    isActive && "sidebar-item-active"
                  )
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        cn(
          "sidebar-item",
          isActive && "sidebar-item-active"
        )
      }
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppSidebar({ isOpen, onClose }: AppSidebarProps) {
  const { logout, admin } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={cn(
          "fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto transition-transform duration-300",
          "lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between gap-3 px-6 py-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-sidebar-foreground">EduKenya</h1>
              <p className="text-xs text-sidebar-foreground/60">CBC Management</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden text-sidebar-foreground"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Admin Info */}
        {admin && (
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60">Logged in as</p>
            <p className="text-sm font-medium text-sidebar-foreground">{admin.name}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" onClick={onClose} />
          
          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              People
            </p>
            <NavItem to="/students" icon={<Users className="h-5 w-5" />} label="Students" onClick={onClose} />
            <NavItem to="/teachers" icon={<GraduationCap className="h-5 w-5" />} label="Teachers" onClick={onClose} />
          </div>

          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              School Levels
            </p>
            <NavItem to="/primary" icon={<School className="h-5 w-5" />} label="Primary" onClick={onClose} />
            <NavItem to="/junior" icon={<BookOpen className="h-5 w-5" />} label="Junior School (6-9)" onClick={onClose} />
            <NavItem 
              to="/senior" 
              icon={<Layers className="h-5 w-5" />} 
              label="Senior School (10-12)"
              onClick={onClose}
              children={[
                { to: '/senior/stem', label: 'STEM Pathway' },
                { to: '/senior/social-sciences', label: 'Social Sciences' },
                { to: '/senior/arts-sports', label: 'Arts & Sports' },
              ]}
            />
          </div>

          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Academics
            </p>
            <NavItem to="/assessments" icon={<ClipboardList className="h-5 w-5" />} label="Assessment" onClick={onClose} />
            <NavItem to="/marklist" icon={<FileText className="h-5 w-5" />} label="Marklist" onClick={onClose} />
            <NavItem to="/results" icon={<BookMarked className="h-5 w-5" />} label="Result Analysis" onClick={onClose} />
            <NavItem to="/timetable" icon={<Calendar className="h-5 w-5" />} label="Timetable" onClick={onClose} />
            <NavItem to="/attendance" icon={<UserCheck className="h-5 w-5" />} label="Attendance" onClick={onClose} />
          </div>

          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Finance
            </p>
            <NavItem to="/fees" icon={<Receipt className="h-5 w-5" />} label="Fees Collection" onClick={onClose} />
            <NavItem to="/fees-register" icon={<CreditCard className="h-5 w-5" />} label="Fees Register" onClick={onClose} />
            <NavItem to="/fees-reminders" icon={<Bell className="h-5 w-5" />} label="Fees Reminders" onClick={onClose} />
            <NavItem to="/payroll" icon={<Wallet className="h-5 w-5" />} label="Payroll" onClick={onClose} />
          </div>

          <div className="pt-4">
            <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
              Resources
            </p>
            <NavItem to="/library" icon={<Library className="h-5 w-5" />} label="Library" onClick={onClose} />
            <NavItem to="/transport" icon={<Bus className="h-5 w-5" />} label="Transport" onClick={onClose} />
          </div>

          <div className="pt-4 space-y-1">
            <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" onClick={onClose} />
            <button
              onClick={handleLogout}
              className="sidebar-item w-full text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}

// Mobile menu toggle button component
export function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="lg:hidden"
      onClick={onClick}
    >
      <Menu className="h-6 w-6" />
    </Button>
  );
}
