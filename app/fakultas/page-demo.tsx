'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockFakultas } from '@/lib/mock-data';
import { GraduationCap, Building, Users, AlertCircle, Wifi, WifiOff } from 'lucide-react';

function ConnectionStatus() {
  return (
    <Alert className="mb-6">
      <WifiOff className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          Backend tidak tersedia. Menampilkan data demo untuk preview aplikasi.
        </span>
        <Badge variant="secondary">Demo Mode</Badge>
      </AlertDescription>
    </Alert>
  );
}

function FakultasList() {
  return (
    <div className="space-y-4">
      {mockFakultas.map((fakultas) => (
        <Card key={fakultas.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {fakultas.nama}
            </CardTitle>
            <CardDescription>
              {fakultas.prodi?.length || 0} program studi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Program Studi:
              </div>
              <div className="flex flex-wrap gap-2">
                {fakultas.prodi?.map((prodi) => (
                  <Badge key={prodi.id} variant="secondary" className="flex items-center gap-1">
                    <GraduationCap className="h-3 w-3" />
                    {prodi.nama}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProdiList() {
  const allProdi = mockFakultas.flatMap(f => f.prodi.map(p => ({ ...p, fakultas: f })));

  return (
    <div className="space-y-4">
      {allProdi.map((prodi) => (
        <Card key={prodi.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {prodi.nama}
                </CardTitle>
                <CardDescription>
                  {prodi.fakultas.nama}
                </CardDescription>
              </div>
              <Badge variant="outline">
                {prodi.fakultas.nama}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>ID: {prodi.id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function FakultasPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Fakultas & Program Studi</h1>
            <p className="text-muted-foreground">
              Manajemen data fakultas dan program studi
            </p>
          </div>
        </div>

        <ConnectionStatus />

        <Tabs defaultValue="fakultas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fakultas" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Fakultas
            </TabsTrigger>
            <TabsTrigger value="prodi" className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Program Studi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fakultas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Fakultas</CardTitle>
                <CardDescription>
                  Data fakultas yang tersedia di sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FakultasList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prodi" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Program Studi</CardTitle>
                <CardDescription>
                  Semua program studi dari berbagai fakultas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProdiList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
