import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Users, GraduationCap, School, BookOpen, 
  ClipboardList, Calendar, UserCheck, Receipt, CreditCard, 
  Bell, Wallet, Library, Bus, Settings, ChevronDown, ChevronRight,
  Layers, BookMarked, FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  children?: { to: string; label: string }[];
}

function NavItem({ to, icon, label, children }: NavItemProps) {
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

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
        <div className="h-10 w-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
          <GraduationCap className="h-6 w-6 text-sidebar-primary-foreground" />
        </div>
        <div>
          <h1 className="font-bold text-sidebar-foreground">EduKenya</h1>
          <p className="text-xs text-sidebar-foreground/60">CBC Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        <NavItem to="/" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" />
        
        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            People
          </p>
          <NavItem to="/students" icon={<Users className="h-5 w-5" />} label="Students" />
          <NavItem to="/teachers" icon={<GraduationCap className="h-5 w-5" />} label="Teachers" />
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            School Levels
          </p>
          <NavItem to="/primary" icon={<School className="h-5 w-5" />} label="Primary" />
          <NavItem to="/junior" icon={<BookOpen className="h-5 w-5" />} label="Junior School (6-9)" />
          <NavItem 
            to="/senior" 
            icon={<Layers className="h-5 w-5" />} 
            label="Senior School (10-12)"
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
          <NavItem to="/assessments" icon={<ClipboardList className="h-5 w-5" />} label="Assessment" />
          <NavItem to="/marklist" icon={<FileText className="h-5 w-5" />} label="Marklist" />
          <NavItem to="/results" icon={<BookMarked className="h-5 w-5" />} label="Result Analysis" />
          <NavItem to="/timetable" icon={<Calendar className="h-5 w-5" />} label="Timetable" />
          <NavItem to="/attendance" icon={<UserCheck className="h-5 w-5" />} label="Attendance" />
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            Finance
          </p>
          <NavItem to="/fees" icon={<Receipt className="h-5 w-5" />} label="Fees Collection" />
          <NavItem to="/fees-register" icon={<CreditCard className="h-5 w-5" />} label="Fees Register" />
          <NavItem to="/fees-reminders" icon={<Bell className="h-5 w-5" />} label="Fees Reminders" />
          <NavItem to="/payroll" icon={<Wallet className="h-5 w-5" />} label="Payroll" />
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider mb-2">
            Resources
          </p>
          <NavItem to="/library" icon={<Library className="h-5 w-5" />} label="Library" />
          <NavItem to="/transport" icon={<Bus className="h-5 w-5" />} label="Transport" />
        </div>

        <div className="pt-4">
          <NavItem to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
        </div>
      </nav>
    </aside>
  );
}
