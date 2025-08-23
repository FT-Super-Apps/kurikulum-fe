'use client';

import { useQuery } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { CurriculumWorkflow } from '@/components/curriculum-workflow';
import { useProdi } from '@/contexts/prodi-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Building,
  Target,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  ArrowRight,
  Activity,
  CheckCircle,
  WifiOff,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { GET_ALL_FAKULTAS } from '@/lib/graphql/queries';

interface QuickStatsProps {
  title: string;
  value: number;
  description: string;
  icon: any;
  color: string;
  href: string;
}

function QuickStatsCard({ title, value, description, icon: Icon, color, href }: QuickStatsProps) {
  return (
    <Card className="hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 border-0 shadow-md rounded-xl bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-bold text-slate-800">{title}</CardTitle>
        <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
        <p className="text-xs text-slate-600 mb-4 font-medium">{description}</p>
        <Link href={href}>
          <Button variant="outline" size="sm" className="w-full rounded-xl border-slate-200/50 hover:bg-white/80 shadow-sm font-medium">
            Kelola <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function ConnectionStatus({ isConnected, error }: { isConnected: boolean; error?: any }) {
  if (isConnected) {
    return (
      <Alert className="mb-6 border-0 bg-gradient-to-r from-green-50 to-emerald-50 shadow-md rounded-xl">
        <div className="p-1 bg-green-500 rounded-lg">
          <CheckCircle className="h-4 w-4 text-white" />
        </div>
        <AlertDescription className="flex items-center justify-between text-green-800 font-medium">
          <span>
            Terhubung ke backend GraphQL. Menampilkan data real-time.
          </span>
          <Badge variant="secondary" className="bg-green-100 text-green-800 rounded-lg font-medium">Online</Badge>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="mb-6 border-0 bg-gradient-to-r from-red-50 to-rose-50 shadow-md rounded-xl">
        <div className="p-1 bg-red-500 rounded-lg">
          <WifiOff className="h-4 w-4 text-white" />
        </div>
        <AlertDescription className="flex items-center justify-between text-red-800 font-medium">
          <span>
            Backend GraphQL tidak tersedia: {error.message}
          </span>
          <Badge variant="secondary" className="bg-red-100 text-red-800 rounded-lg font-medium">Offline</Badge>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

function RecentActivities({ isConnected, error }: { isConnected: boolean; error?: any }) {
  return (
    <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <span className="text-slate-800 font-bold">Status Aplikasi</span>
        </CardTitle>
        <CardDescription className="text-slate-600 font-medium">
          Status dan informasi sistem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 p-4 border-0 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl shadow-sm">
          <div className={`h-3 w-3 rounded-full shadow-sm ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">
              {isConnected ? 'Backend terhubung' : 'Backend offline'}
            </p>
            <p className="text-xs text-slate-600 font-medium">
              {isConnected ? 'GraphQL endpoint berfungsi normal' : 'Tidak dapat mengakses GraphQL endpoint'}
            </p>
          </div>
          <Badge variant={isConnected ? "secondary" : "destructive"} className="rounded-lg font-medium">
            {isConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 p-4 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
          <div className="h-3 w-3 bg-blue-500 rounded-full shadow-sm"></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">Frontend berfungsi normal</p>
            <p className="text-xs text-slate-600 font-medium">Semua komponen UI tersedia</p>
          </div>
          <Badge variant="outline" className="rounded-lg font-medium border-blue-200 text-blue-700">Ready</Badge>
        </div>

        <div className="flex items-center gap-4 p-4 border-0 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl shadow-sm">
          <div className="h-3 w-3 bg-purple-500 rounded-full shadow-sm"></div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-800">GraphQL Schema</p>
            <p className="text-xs text-slate-600 font-medium">kurikulum.if.unismuh.ac.id/graphql</p>
          </div>
          <Badge variant="outline" className="rounded-lg font-medium border-purple-200 text-purple-700">API</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const { selectedProdi } = useProdi();

  const actions = [
    {
      title: 'Profil Lulusan',
      description: 'Definisi karakteristik lulusan',
      href: '/profil-lulusan',
      icon: Target,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'CPL Management',
      description: 'Capaian pembelajaran lulusan',
      href: '/cpl',
      icon: BookOpen,
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'CPMK Management',
      description: 'Capaian pembelajaran mata kuliah',
      href: '/cpmk',
      icon: ClipboardList,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Analytics Dashboard',
      description: 'Monitoring & evaluasi',
      href: '/analytics',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader>
        <CardTitle className="text-slate-800 font-bold">Aksi Cepat</CardTitle>
        <CardDescription className="text-slate-600 font-medium">
          {selectedProdi ? `Kelola kurikulum ${selectedProdi.nama}` : 'Pilih program studi untuk memulai'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center gap-4 p-4 border-0 bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer">
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${action.color} shadow-sm`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800">{action.title}</p>
                <p className="text-xs text-slate-600 font-medium">{action.description}</p>
              </div>
              <div className="p-1 bg-slate-200/50 rounded-lg">
                <ArrowRight className="h-4 w-4 text-slate-600" />
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

function CurriculumInfo() {
  const { selectedProdi } = useProdi();

  if (!selectedProdi) {
    return null;
  }

  return (
    <Card className="border-0 shadow-lg rounded-xl bg-gradient-to-br from-white to-slate-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <span className="text-slate-800 font-bold">Informasi Program Studi</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center justify-between p-4 border-0 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-800">Program Studi</p>
              <p className="text-xs text-slate-600 font-medium">{selectedProdi.nama}</p>
            </div>
            <Badge variant="outline" className="rounded-lg font-medium border-blue-200 text-blue-700">{selectedProdi.jenjang}</Badge>
          </div>

          <div className="flex items-center justify-between p-4 border-0 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl shadow-sm">
            <div>
              <p className="text-sm font-bold text-slate-800">Gelar Lulusan</p>
              <p className="text-xs text-slate-600 font-medium">{selectedProdi.gelar}</p>
            </div>
            <Badge variant="secondary" className="rounded-lg font-medium bg-purple-100 text-purple-700">{selectedProdi.gelar_pendek}</Badge>
          </div>

          <div className="flex items-center gap-4 p-4 border-0 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-sm">
            <div className="p-1.5 bg-green-500 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Status Kurikulum</p>
              <p className="text-xs text-slate-600 font-medium">Dalam pengembangan</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 border-0 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl shadow-sm">
            <div className="p-1.5 bg-orange-500 rounded-lg">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Terakhir Diperbarui</p>
              <p className="text-xs text-slate-600 font-medium">2 hari yang lalu</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data, loading, error } = useQuery(GET_ALL_FAKULTAS);
  const { selectedProdi } = useProdi();
  const isConnected = !loading && !error && data;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Dashboard Kurikulum
          </h1>
          <p className="text-slate-600 font-medium mt-2 text-lg">
            {selectedProdi
              ? `Sistem Pengembangan Kurikulum - ${selectedProdi.nama}`
              : 'Sistem Pengembangan Kurikulum Berbasis OBE'
            }
          </p>
        </div>

        <ConnectionStatus isConnected={!!isConnected} error={error} />

        <CurriculumWorkflow />

        <div className="grid gap-8 lg:grid-cols-2">
          <CurriculumInfo />
          <QuickActions />
        </div>

        <RecentActivities isConnected={!!isConnected} error={error} />
      </div>
    </DashboardLayout>
  );
}
