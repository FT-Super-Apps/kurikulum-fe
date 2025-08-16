'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  completion: number;
  status: 'completed' | 'in-progress' | 'pending';
  items: {
    name: string;
    href: string;
    completed: boolean;
  }[];
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 'setup',
    name: 'Setup Institusi',
    description: 'Konfigurasi struktur fakultas dan program studi',
    completion: 85,
    status: 'completed',
    items: [
      { name: 'Fakultas & Prodi', href: '/fakultas', completed: true },
      { name: 'Profil Lulusan', href: '/profil-lulusan', completed: true }
    ]
  },
  {
    id: 'curriculum',
    name: 'Desain Kurikulum',
    description: 'Definisi CPL, mata kuliah, dan CPMK',
    completion: 60,
    status: 'in-progress',
    items: [
      { name: 'CPL', href: '/cpl', completed: true },
      { name: 'Mata Kuliah', href: '/mata-kuliah', completed: true },
      { name: 'CPMK', href: '/cpmk', completed: false }
    ]
  },
  {
    id: 'alignment',
    name: 'Pemetaan Kurikulum',
    description: 'Mapping CPMK dengan CPL untuk alignment',
    completion: 30,
    status: 'pending',
    items: [
      { name: 'Mapping CPMK-CPL', href: '/mapping', completed: false }
    ]
  },
  {
    id: 'evaluation',
    name: 'Evaluasi & Feedback',
    description: 'Survey stakeholder dan analisis kurikulum',
    completion: 10,
    status: 'pending',
    items: [
      { name: 'Stakeholder', href: '/stakeholder', completed: false },
      { name: 'Survey', href: '/survey', completed: false },
      { name: 'Analytics', href: '/analytics', completed: false }
    ]
  }
];

function getStatusColor(status: string) {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-700 border-green-200';
    case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-600 border-gray-200';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'in-progress': return <Circle className="h-4 w-4 text-blue-600 animate-pulse" />;
    default: return <Circle className="h-4 w-4 text-gray-400" />;
  }
}

export function WorkflowProgress() {
  const overallProgress = Math.round(
    workflowSteps.reduce((acc, step) => acc + step.completion, 0) / workflowSteps.length
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Progress Kurikulum OBE</CardTitle>
          <Badge variant="outline" className="text-lg font-semibold">
            {overallProgress}% Complete
          </Badge>
        </div>
        <Progress value={overallProgress} className="w-full" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="relative">
              <Card className={`border-2 transition-all hover:shadow-md ${
                step.status === 'in-progress' ? 'ring-2 ring-blue-200' : ''
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(step.status)}
                    <CardTitle className="text-sm font-medium">
                      {step.name}
                    </CardTitle>
                  </div>
                  <Badge className={`w-fit text-xs ${getStatusColor(step.status)}`}>
                    {step.status === 'completed' ? 'Selesai' :
                     step.status === 'in-progress' ? 'Sedang Berjalan' : 'Menunggu'}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground mb-3">
                    {step.description}
                  </p>
                  <div className="space-y-1">
                    {step.items.map((item) => (
                      <div key={item.name} className="flex items-center gap-2 text-xs">
                        {item.completed ? (
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                        ) : (
                          <Circle className="h-3 w-3 text-gray-400" />
                        )}
                        <span className={item.completed ? 'text-green-700' : 'text-gray-600'}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <Progress value={step.completion} className="h-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.completion}% selesai
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* Arrow connector */}
              {index < workflowSteps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}