'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProdiSelector } from '@/components/prodi-selector';
import {
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  className?: string;
}

const curriculumNavigation = [
  {
    section: '📋 Perencanaan Kurikulum',
    items: [
      { name: 'Overview Kurikulum', href: '/', emoji: '🏠' },
      { name: 'Profil Lulusan', href: '/profil-lulusan', emoji: '🎯' },
      { name: 'CPL Management', href: '/cpl', emoji: '📚' },
      { name: 'Survey Stakeholder', href: '/survey', emoji: '👥' },
    ]
  },
  {
    section: '🎨 Desain Kurikulum',
    items: [
      { name: 'Mata Kuliah', href: '/mata-kuliah', emoji: '📄' },
      { name: 'CPMK Management', href: '/cpmk', emoji: '🔍' },
      { name: 'Pemetaan CPMK-CPL', href: '/mapping', emoji: '📊' },
    ]
  },
  {
    section: '📈 Evaluasi & Monitoring',
    items: [
      { name: 'Analytics Dashboard', href: '/analytics', emoji: '📈' },
      { name: 'Laporan Stakeholder', href: '/reports', emoji: '📋' },
      { name: 'Assessment Matrix', href: '/assessment', emoji: '✅' },
    ]
  }
];

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className={cn(
      'relative flex flex-col h-full bg-gradient-to-br from-slate-50 via-white to-slate-100/50 border-r border-slate-200/60 shadow-lg backdrop-blur-sm',
      className
    )}>
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/50 bg-white/60 backdrop-blur-md">
        {!collapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl blur-sm opacity-75"></div>
              <div className="relative p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-800 text-sm">Kurikulum</span>
              <div className="text-xs text-slate-600 font-medium">Dashboard</div>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-9 w-9 p-0 hover:bg-slate-100/80 rounded-xl border border-slate-200/50 shadow-sm hover:shadow-md transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-slate-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-slate-600" />
          )}
        </Button>
      </div>

      {/* ProdiSelector */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-slate-200/40 bg-gradient-to-r from-white/70 to-slate-50/70">
          <ProdiSelector />
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1">
        <div className="px-3 py-4">
          {curriculumNavigation.map((section, sectionIndex) => (
            <div key={section.section} className="mb-6 last:mb-0">
              {!collapsed && (
                <div className="px-3 py-2 mb-3">
                  <h3 className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {section.section}
                  </h3>
                </div>
              )}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          'w-full justify-start rounded-xl h-12 font-medium transition-all duration-300 group relative overflow-hidden',
                          collapsed ? 'px-3' : 'px-4',
                          isActive
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl border-0 hover:from-blue-600 hover:to-purple-700'
                            : 'text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-transparent hover:border-slate-200/50 hover:shadow-md'
                        )}
                        title={collapsed ? item.name : undefined}
                      >
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                        <div className={cn(
                          'relative flex items-center',
                          !collapsed && 'w-full'
                        )}>
                          <div className={cn(
                            'flex items-center justify-center rounded-lg transition-all duration-200 relative',
                            isActive
                              ? 'bg-white/20 p-2'
                              : 'group-hover:bg-slate-100 p-2'
                          )}>
                            <span className={cn(
                              'text-lg transition-all duration-200 select-none',
                              'group-hover:scale-110 group-hover:rotate-6',
                              isActive && 'drop-shadow-sm'
                            )}>
                              {item.emoji}
                            </span>
                          </div>
                          {!collapsed && (
                            <span className={cn(
                              'ml-3 text-sm font-medium transition-colors',
                              isActive ? 'text-white' : 'text-slate-700 group-hover:text-slate-900'
                            )}>
                              {item.name}
                            </span>
                          )}
                        </div>
                        {isActive && !collapsed && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <div className="w-2 h-2 bg-white rounded-full shadow-sm"></div>
                          </div>
                        )}
                      </Button>
                    </Link>
                  );
                })}
              </div>
              {!collapsed && sectionIndex < curriculumNavigation.length - 1 && (
                <div className="mt-6 mb-2">
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent mx-3"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Settings */}
      <div className="p-3 border-t border-slate-200/40 bg-gradient-to-r from-white/70 to-slate-50/70">
        <Button
          variant="ghost"
          className={cn(
            'w-full justify-start rounded-xl h-12 font-medium text-slate-700 hover:bg-white/80 hover:text-slate-900 border border-transparent hover:border-slate-200/50 hover:shadow-md transition-all duration-300 group relative overflow-hidden',
            collapsed && 'px-3'
          )}
          title={collapsed ? 'Settings' : undefined}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-slate-500/5 to-gray-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className={cn(
            'relative flex items-center',
            !collapsed && 'w-full'
          )}>
            <div className="flex items-center justify-center rounded-lg group-hover:bg-slate-100 p-2 transition-all duration-200">
              <span className={cn(
                'text-lg transition-all duration-200 select-none',
                'group-hover:scale-110 group-hover:rotate-12'
              )}>
                ⚙️
              </span>
            </div>
            {!collapsed && (
              <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                Settings
              </span>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="h-full bg-white/90 backdrop-blur-xl border-r border-slate-200/60 shadow-2xl rounded-r-3xl lg:rounded-none">
          <Sidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="h-9 w-9 p-0 rounded-xl hover:bg-slate-100/80 transition-all duration-200"
          >
            <Menu className="h-5 w-5 text-slate-600" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-75"></div>
              <div className="relative p-1.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-lg">
                <GraduationCap className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="font-bold text-slate-800 text-sm">Kurikulum Dashboard</span>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
