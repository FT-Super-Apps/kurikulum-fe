'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Target,
  Users,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

const navigationPhases = [
  {
    name: 'Dashboard',
    items: [
      {
        name: 'Overview',
        href: '/',
        icon: LayoutDashboard,
      }
    ]
  },
  {
    name: 'Setup Institusi',
    items: [
      {
        name: 'Fakultas & Prodi',
        href: '/fakultas',
        icon: GraduationCap,
      },
      {
        name: 'Profil Lulusan',
        href: '/profil-lulusan',
        icon: Target,
      }
    ]
  },
  {
    name: 'Desain Kurikulum',
    items: [
      {
        name: 'CPL',
        href: '/cpl',
        icon: BookOpen,
      },
      {
        name: 'Mata Kuliah',
        href: '/mata-kuliah',
        icon: FileText,
      },
      {
        name: 'CPMK',
        href: '/cpmk',
        icon: Target,
      }
    ]
  },
  {
    name: 'Pemetaan',
    items: [
      {
        name: 'Mapping CPMK-CPL',
        href: '/mapping',
        icon: BarChart3,
      }
    ]
  },
  {
    name: 'Evaluasi',
    items: [
      {
        name: 'Stakeholder',
        href: '/stakeholder',
        icon: Users,
      },
      {
        name: 'Survey',
        href: '/survey',
        icon: FileText,
      },
      {
        name: 'Analytics',
        href: '/analytics',
        icon: BarChart3,
      }
    ]
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn('relative flex flex-col', className)}>
      <div className="flex h-16 items-center justify-between px-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6" />
            <span className="font-semibold">Kurikulum Dashboard</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-3">
          {navigationPhases.map((phase, phaseIndex) => (
            <div key={phase.name}>
              {!collapsed && phaseIndex > 0 && (
                <div className="px-2 py-1 mb-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {phase.name}
                  </h3>
                </div>
              )}
              <div className="space-y-1">
                {phase.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        className={cn(
                          'w-full justify-start',
                          collapsed && 'px-2'
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        <item.icon className="h-4 w-4 mr-2" />
                        {!collapsed && item.name}
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 border-t">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start',
            collapsed && 'px-2'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="h-4 w-4 mr-2" />
          {!collapsed && 'Settings'}
        </Button>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <div className="w-64 border-r bg-gray-50/40">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
