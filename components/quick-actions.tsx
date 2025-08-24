'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Map, 
  BarChart3, 
  FileText, 
  Users, 
  Target,
  BookOpen,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  category: 'create' | 'manage' | 'analyze';
  priority: 'high' | 'medium' | 'low';
  estimated_time: string;
}

const quickActions: QuickAction[] = [
  {
    id: 'add-cpmk',
    title: 'Tambah CPMK Baru',
    description: 'Buat capaian pembelajaran mata kuliah',
    href: '/cpmk',
    icon: Target,
    category: 'create',
    priority: 'high',
    estimated_time: '5 menit'
  },
  {
    id: 'map-cpmk-cpl',
    title: 'Mapping CPMK-CPL',
    description: 'Petakan hubungan CPMK dengan CPL',
    href: '/mapping',
    icon: Map,
    category: 'manage',
    priority: 'high',
    estimated_time: '10 menit'
  },
  {
    id: 'review-analytics',
    title: 'Review Analytics',
    description: 'Analisis performa kurikulum',
    href: '/analytics',
    icon: BarChart3,
    category: 'analyze',
    priority: 'medium',
    estimated_time: '15 menit'
  },
  {
    id: 'manage-stakeholder',
    title: 'Kelola Stakeholder',
    description: 'Tambah atau edit data stakeholder',
    href: '/stakeholder',
    icon: Users,
    category: 'manage',
    priority: 'medium',
    estimated_time: '8 menit'
  },
  {
    id: 'create-survey',
    title: 'Buat Survey Baru',
    description: 'Survey feedback stakeholder',
    href: '/survey',
    icon: FileText,
    category: 'create',
    priority: 'low',
    estimated_time: '12 menit'
  },
  {
    id: 'add-cpl',
    title: 'Tambah CPL',
    description: 'Definisikan capaian pembelajaran lulusan',
    href: '/cpl',
    icon: BookOpen,
    category: 'create',
    priority: 'medium',
    estimated_time: '7 menit'
  }
];

function getCategoryColor(category: string) {
  switch (category) {
    case 'create': return 'bg-green-100 text-green-700 border-green-200';
    case 'manage': return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'analyze': return 'bg-purple-100 text-purple-700 border-purple-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getPriorityIcon(priority: string) {
  switch (priority) {
    case 'high': return <Zap className="h-3 w-3 text-red-500" />;
    case 'medium': return <ArrowRight className="h-3 w-3 text-yellow-500" />;
    default: return null;
  }
}

export function QuickActions() {
  // Show top 6 actions, prioritized by high -> medium -> low
  const prioritizedActions = quickActions
    .sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })
    .slice(0, 6);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-blue-600" />
          Quick Actions
        </CardTitle>
        <CardDescription>
          Aksi cepat untuk meningkatkan produktivitas kerja Anda
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {prioritizedActions.map((action) => (
            <Link key={action.id} href={action.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <action.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{action.title}</h4>
                        {getPriorityIcon(action.priority)}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {action.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(action.category)}`}
                        >
                          {action.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ~{action.estimated_time}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}