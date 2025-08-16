'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GET_ALL_FAKULTAS, GET_ALL_PRODI } from '@/lib/graphql/queries';
import { useQueryWithFallback } from '@/lib/use-query-with-fallback';
import { Fakultas, Prodi } from '@/lib/types';
import { GraduationCap, Building, Users } from 'lucide-react';

interface FakultasData {
  fakultas: Fakultas[];
}

interface ProdiData {
  prodi: Prodi[];
}

function FakultasList() {
  const { data, loading, error } = useQueryWithFallback(GET_ALL_FAKULTAS);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading fakultas: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {data?.fakultas.map((fakultas) => (
        <Card key={fakultas.kode}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  {fakultas.nama}
                </CardTitle>
                <CardDescription>
                  {fakultas.alias} - Kode: {fakultas.kode}
                </CardDescription>
              </div>
              <Badge variant="outline">{fakultas.jenjang}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Program:</strong> {fakultas.program}
              </p>
              {fakultas.prodi && fakultas.prodi.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Program Studi:</p>
                  <div className="flex flex-wrap gap-2">
                    {fakultas.prodi.map((prodi) => (
                      <Badge key={prodi.kode} variant="secondary">
                        {prodi.nama}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ProdiList() {
  const { data, loading, error } = useQueryWithFallback(GET_ALL_PRODI);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading program studi: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {data?.prodi?.map((prodi: any) => (
        <Card key={prodi.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  {prodi.nama}
                </CardTitle>
                <CardDescription>
                  {prodi.nama_eng} - Kode: {prodi.kode}
                </CardDescription>
              </div>
              <Badge variant="outline">{prodi.jenjang}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Fakultas:</span> {prodi.fakultas?.nama}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Gelar Pendek:</span> {prodi.gelar_pendek}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Gelar Lengkap:</span> {prodi.gelar}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Gelar (English):</span> {prodi.gelar_eng}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Jenjang:</span> {prodi.jenjang}
                </p>
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
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fakultas & Program Studi</h1>
          <p className="text-muted-foreground">
            Manajemen data fakultas dan program studi
          </p>
        </div>

        <Tabs defaultValue="fakultas" className="space-y-4">
          <TabsList>
            <TabsTrigger value="fakultas" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              Fakultas
            </TabsTrigger>
            <TabsTrigger value="prodi" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Program Studi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fakultas">
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

          <TabsContent value="prodi">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Program Studi</CardTitle>
                <CardDescription>
                  Data program studi yang tersedia di sistem
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
