import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, BookOpen, GraduationCap, Target, Users } from 'lucide-react';

export default function Home() {
  const stats = [
    {
      name: 'Total Fakultas',
      value: '12',
      icon: GraduationCap,
      description: 'Fakultas aktif'
    },
    {
      name: 'Program Studi',
      value: '45',
      icon: BookOpen,
      description: 'Program studi aktif'
    },
    {
      name: 'CPL Terdefinisi',
      value: '180',
      icon: Target,
      description: 'Capaian pembelajaran lulusan'
    },
    {
      name: 'Mata Kuliah',
      value: '320',
      icon: BookOpen,
      description: 'Total mata kuliah'
    },
    {
      name: 'CPMK',
      value: '1,240',
      icon: BarChart3,
      description: 'Capaian pembelajaran mata kuliah'
    },
    {
      name: 'Stakeholder',
      value: '85',
      icon: Users,
      description: 'Stakeholder terdaftar'
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang di Dashboard Kurikulum berbasis OBE
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.name}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Sistem manajemen kurikulum berbasis Outcome-Based Education (OBE) untuk perguruan tinggi.
                </div>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Fitur Utama:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Manajemen Fakultas dan Program Studi</li>
                    <li>• Pengelolaan CPL (Capaian Pembelajaran Lulusan)</li>
                    <li>• Pengelolaan CPMK (Capaian Pembelajaran Mata Kuliah)</li>
                    <li>• Mapping CPMK ke CPL</li>
                    <li>• Manajemen Stakeholder dan Survey</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Aktivitas terbaru di sistem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      CPL baru ditambahkan
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2 jam yang lalu
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Mata kuliah diperbarui
                    </p>
                    <p className="text-sm text-muted-foreground">
                      5 jam yang lalu
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      Survey baru dibuat
                    </p>
                    <p className="text-sm text-muted-foreground">
                      1 hari yang lalu
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
