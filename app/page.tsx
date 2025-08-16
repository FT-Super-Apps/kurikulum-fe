'use client';

import { useQuery } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
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
  WifiOff
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
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <Link href={href}>
          <Button variant="outline" size="sm" className="w-full">
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
      <Alert className="mb-6 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="flex items-center justify-between text-green-800">
          <span>
            Terhubung ke backend GraphQL. Menampilkan data real-time.
          </span>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert className="mb-6">
        <WifiOff className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>
            Backend GraphQL tidak tersedia: {error.message}
          </span>
          <Badge variant="secondary">Offline</Badge>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}

function RecentActivities({ isConnected, error }: { isConnected: boolean; error?: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Status Aplikasi
        </CardTitle>
        <CardDescription>
          Status dan informasi sistem
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <div className="flex-1">
            <p className="text-sm font-medium">
              {isConnected ? 'Backend terhubung' : 'Backend offline'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isConnected ? 'GraphQL endpoint berfungsi normal' : 'Tidak dapat mengakses GraphQL endpoint'}
            </p>
          </div>
          <Badge variant={isConnected ? "secondary" : "destructive"}>
            {isConnected ? "Online" : "Offline"}
          </Badge>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Frontend berfungsi normal</p>
            <p className="text-xs text-muted-foreground">Semua komponen UI tersedia</p>
          </div>
          <Badge variant="outline">Ready</Badge>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">GraphQL Schema</p>
            <p className="text-xs text-muted-foreground">kurikulum.if.unismuh.ac.id/graphql</p>
          </div>
          <Badge variant="outline">API</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActions() {
  const actions = [
    {
      title: 'Lihat Fakultas',
      description: 'Browse data fakultas',
      href: '/fakultas',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      title: 'Kelola CPL',
      description: 'Capaian pembelajaran lulusan',
      href: '/cpl',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Mata Kuliah',
      description: 'Daftar mata kuliah',
      href: '/mata-kuliah',
      icon: BookOpen,
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Dashboard & laporan',
      href: '/analytics',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Navigasi Cepat</CardTitle>
        <CardDescription>
          Akses halaman utama aplikasi
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent transition-colors cursor-pointer">
              <div className={`p-2 rounded-md ${action.color}`}>
                <action.icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{action.title}</p>
                <p className="text-xs text-muted-foreground">{action.description}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { data, loading, error } = useQuery(GET_ALL_FAKULTAS);
  const isConnected = !loading && !error && data;

  // Calculate stats from real data
  const stats = {
    fakultas: data?.allFakultas?.length || 0,
    prodi: 0, // Will need separate query for this
    cpl: 0, // Will need separate query for this
    mataKuliah: 0, // Will need separate query for this
    cpmk: 0, // Will need separate query for this
    profilLulusan: 0, // Will need separate query for this
    stakeholder: 0, // Will need separate query for this
    survey: 0, // Will need separate query for this
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Kurikulum</h1>
          <p className="text-muted-foreground">
            Sistem Manajemen Kurikulum Program Studi Informatika
          </p>
        </div>

        <ConnectionStatus isConnected={!!isConnected} error={error} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <QuickStatsCard
                title="Fakultas"
                value={stats.fakultas}
                description="Total fakultas"
                icon={Building}
                color="text-blue-600"
                href="/fakultas"
              />
              <QuickStatsCard
                title="Program Studi"
                value={stats.prodi}
                description="Total program studi"
                icon={GraduationCap}
                color="text-green-600"
                href="/fakultas"
              />
              <QuickStatsCard
                title="CPL"
                value={stats.cpl}
                description="Capaian Pembelajaran Lulusan"
                icon={Target}
                color="text-purple-600"
                href="/cpl"
              />
              <QuickStatsCard
                title="Mata Kuliah"
                value={stats.mataKuliah}
                description="Total mata kuliah"
                icon={BookOpen}
                color="text-orange-600"
                href="/mata-kuliah"
              />
            </>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivities isConnected={!!isConnected} error={error} />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
