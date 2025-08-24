'use client';

import { useQuery } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Activity
} from 'lucide-react';
import Link from 'next/link';
import {
  GET_ALL_FAKULTAS,
  GET_ALL_CPL,
  GET_ALL_MATA_KULIAH,
  GET_ALL_CPMK,
  GET_ALL_PROFIL_LULUSAN,
  GET_ALL_STAKEHOLDER,
  GET_ALL_SURVEY
} from '@/lib/graphql/queries';

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

function RecentActivities() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Aktivitas Terbaru
        </CardTitle>
        <CardDescription>
          Ringkasan aktivitas sistem kurikulum
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Sistem beroperasi normal</p>
            <p className="text-xs text-muted-foreground">Semua modul berfungsi dengan baik</p>
          </div>
          <Badge variant="secondary">Online</Badge>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">Data kurikulum tersinkronisasi</p>
            <p className="text-xs text-muted-foreground">Terakhir diperbarui hari ini</p>
          </div>
          <Badge variant="outline">Sync</Badge>
        </div>

        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
          <div className="flex-1">
            <p className="text-sm font-medium">GraphQL API tersedia</p>
            <p className="text-xs text-muted-foreground">Endpoint: kurikulum.if.unismuh.ac.id</p>
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
      title: 'Tambah Mata Kuliah',
      description: 'Buat mata kuliah baru',
      href: '/mata-kuliah',
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Kelola CPL',
      description: 'Atur capaian pembelajaran',
      href: '/cpl',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Survey Stakeholder',
      description: 'Buat survey baru',
      href: '/survey',
      icon: ClipboardList,
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Lihat laporan data',
      href: '/analytics',
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aksi Cepat</CardTitle>
        <CardDescription>
          Akses fitur utama dengan cepat
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
  const { data: fakultasData, loading: fakultasLoading } = useQuery(GET_ALL_FAKULTAS);
  const { data: cplData, loading: cplLoading } = useQuery(GET_ALL_CPL);
  const { data: mataKuliahData, loading: mataKuliahLoading } = useQuery(GET_ALL_MATA_KULIAH);
  const { data: cpmkData, loading: cpmkLoading } = useQuery(GET_ALL_CPMK);
  const { data: profilLulusanData, loading: profilLulusanLoading } = useQuery(GET_ALL_PROFIL_LULUSAN);
  const { data: stakeholderData, loading: stakeholderLoading } = useQuery(GET_ALL_STAKEHOLDER);
  const { data: surveyData, loading: surveyLoading } = useQuery(GET_ALL_SURVEY);

  const isLoading = fakultasLoading || cplLoading || mataKuliahLoading || cpmkLoading ||
                   profilLulusanLoading || stakeholderLoading || surveyLoading;

  const stats = {
    fakultas: fakultasData?.fakultas?.length || 0,
    prodi: fakultasData?.fakultas?.reduce((acc: number, f: any) => acc + (f.prodi?.length || 0), 0) || 0,
    cpl: cplData?.cpls?.length || 0,
    mataKuliah: mataKuliahData?.allMataKuliah?.length || 0,
    cpmk: cpmkData?.allCpmk?.length || 0,
    profilLulusan: profilLulusanData?.allProfilLulusan?.length || 0,
    stakeholder: stakeholderData?.allStakeholder?.length || 0,
    survey: surveyData?.allSurvey?.length || 0,
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Kurikulum</h1>
          <p className="text-muted-foreground">
            Sistem Manajemen Kurikulum Program Studi Informatika
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <QuickStatsCard
            title="CPMK"
            value={stats.cpmk}
            description="Capaian Pembelajaran MK"
            icon={Target}
            color="text-red-600"
            href="/cpmk"
          />
          <QuickStatsCard
            title="Profil Lulusan"
            value={stats.profilLulusan}
            description="Profil lulusan terdefinisi"
            icon={Users}
            color="text-indigo-600"
            href="/profil-lulusan"
          />
          <QuickStatsCard
            title="Stakeholder"
            value={stats.stakeholder}
            description="Total stakeholder"
            icon={Users}
            color="text-pink-600"
            href="/stakeholder"
          />
          <QuickStatsCard
            title="Survey"
            value={stats.survey}
            description="Survey tersedia"
            icon={ClipboardList}
            color="text-teal-600"
            href="/survey"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <RecentActivities />
          <QuickActions />
        </div>
      </div>
    </DashboardLayout>
  );
}
