'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import {
  GET_ALL_FAKULTAS,
  GET_ALL_CPL,
  GET_ALL_MATA_KULIAH,
  GET_ALL_CPMK,
  GET_ALL_PROFIL_LULUSAN,
  GET_ALL_STAKEHOLDER,
  GET_ALL_SURVEY
} from '@/lib/graphql/queries';
import {
  Building,
  Target,
  BookOpen,
  Users,
  GraduationCap,
  ClipboardList,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface OverviewStats {
  fakultas: number;
  prodi: number;
  cpl: number;
  mataKuliah: number;
  cpmk: number;
  profilLulusan: number;
  stakeholder: number;
  survey: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

function StatsCard({ icon: Icon, title, value, description, color }: {
  icon: any;
  title: string;
  value: number;
  description: string;
  color: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function OverviewTab() {
  const { data: fakultasData } = useQuery(GET_ALL_FAKULTAS);
  const { data: cplData } = useQuery(GET_ALL_CPL);
  const { data: mataKuliahData } = useQuery(GET_ALL_MATA_KULIAH);
  const { data: cpmkData } = useQuery(GET_ALL_CPMK);
  const { data: profilLulusanData } = useQuery(GET_ALL_PROFIL_LULUSAN);
  const { data: stakeholderData } = useQuery(GET_ALL_STAKEHOLDER);
  const { data: surveyData } = useQuery(GET_ALL_SURVEY);

  const stats: OverviewStats = {
    fakultas: fakultasData?.fakultas?.length || 0,
    prodi: fakultasData?.fakultas?.reduce((acc: number, f: any) => acc + (f.prodi?.length || 0), 0) || 0,
    cpl: cplData?.allCpl?.length || 0,
    mataKuliah: mataKuliahData?.allMataKuliah?.length || 0,
    cpmk: cpmkData?.allCpmk?.length || 0,
    profilLulusan: profilLulusanData?.allProfilLulusan?.length || 0,
    stakeholder: stakeholderData?.stakeholder?.length || 0,
    survey: surveyData?.survey?.length || 0,
  };

  const chartData = [
    { name: 'Fakultas', value: stats.fakultas },
    { name: 'Program Studi', value: stats.prodi },
    { name: 'CPL', value: stats.cpl },
    { name: 'Mata Kuliah', value: stats.mataKuliah },
    { name: 'CPMK', value: stats.cpmk },
    { name: 'Profil Lulusan', value: stats.profilLulusan },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Building}
          title="Fakultas"
          value={stats.fakultas}
          description="Total fakultas"
          color="text-blue-600"
        />
        <StatsCard
          icon={GraduationCap}
          title="Program Studi"
          value={stats.prodi}
          description="Total program studi"
          color="text-green-600"
        />
        <StatsCard
          icon={Target}
          title="CPL"
          value={stats.cpl}
          description="Capaian Pembelajaran Lulusan"
          color="text-purple-600"
        />
        <StatsCard
          icon={BookOpen}
          title="Mata Kuliah"
          value={stats.mataKuliah}
          description="Total mata kuliah"
          color="text-orange-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Target}
          title="CPMK"
          value={stats.cpmk}
          description="Capaian Pembelajaran MK"
          color="text-red-600"
        />
        <StatsCard
          icon={Users}
          title="Profil Lulusan"
          value={stats.profilLulusan}
          description="Profil lulusan terdefinisi"
          color="text-indigo-600"
        />
        <StatsCard
          icon={Users}
          title="Stakeholder"
          value={stats.stakeholder}
          description="Total stakeholder"
          color="text-pink-600"
        />
        <StatsCard
          icon={ClipboardList}
          title="Survey"
          value={stats.survey}
          description="Survey tersedia"
          color="text-teal-600"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi Data Kurikulum</CardTitle>
            <CardDescription>
              Overview distribusi data dalam sistem kurikulum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proporsi Data</CardTitle>
            <CardDescription>
              Proporsi setiap jenis data dalam sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CurriculumAnalysis() {
  const { data: cplData } = useQuery(GET_ALL_CPL);
  const { data: mataKuliahData } = useQuery(GET_ALL_MATA_KULIAH);
  const { data: cpmkData } = useQuery(GET_ALL_CPMK);

  // Group CPL by sikap, pengetahuan, keterampilan umum, keterampilan khusus
  const cplByType = cplData?.allCpl?.reduce((acc: any, cpl: any) => {
    let type = 'Lainnya';
    if (cpl.kode?.toLowerCase().includes('s')) type = 'Sikap';
    else if (cpl.kode?.toLowerCase().includes('p')) type = 'Pengetahuan';
    else if (cpl.kode?.toLowerCase().includes('ku')) type = 'Keterampilan Umum';
    else if (cpl.kode?.toLowerCase().includes('kk')) type = 'Keterampilan Khusus';

    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {}) || {};

  const cplTypeData = Object.entries(cplByType).map(([name, value]) => ({
    name,
    value: value as number,
  }));

  // Group mata kuliah by semester
  const mkBySemester = mataKuliahData?.mataKuliah?.reduce((acc: any, mk: any) => {
    const semester = mk.semester || 'Tidak Ditentukan';
    acc[semester] = (acc[semester] || 0) + 1;
    return acc;
  }, {}) || {};

  const semesterData = Object.entries(mkBySemester).map(([name, value]) => ({
    name: `Semester ${name}`,
    value: value as number,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribusi CPL berdasarkan Jenis</CardTitle>
            <CardDescription>
              Klasifikasi CPL berdasarkan sikap, pengetahuan, dan keterampilan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={cplTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {cplTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Mata Kuliah per Semester</CardTitle>
            <CardDescription>
              Sebaran mata kuliah berdasarkan semester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={semesterData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ringkasan Kurikulum</CardTitle>
          <CardDescription>
            Informasi umum tentang struktur kurikulum
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {cplData?.allCpl?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total CPL</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {mataKuliahData?.mataKuliah?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Mata Kuliah</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {cpmkData?.cpmk?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total CPMK</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics & Dashboard</h1>
            <p className="text-muted-foreground">
              Overview dan analisis data kurikulum
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              <BarChart3 className="h-4 w-4 mr-1" />
              Live Data
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="curriculum">Analisis Kurikulum</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <OverviewTab />
          </TabsContent>

          <TabsContent value="curriculum" className="space-y-4">
            <CurriculumAnalysis />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
