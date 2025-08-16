'use client';

import { useQuery } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { GET_ALL_FAKULTAS } from '@/lib/graphql/queries';
import { GraduationCap, Building, Users, CheckCircle } from 'lucide-react';

interface FakultasData {
  allFakultas: Array<{
    id: string;
    kode: string;
    nama: string;
    alias: string;
    program: string;
    jenjang: string;
  }>;
}

function ConnectionStatus({ isConnected }: { isConnected: boolean }) {
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

  return null;
}

function FakultasList() {
  const { data, loading, error } = useQuery<FakultasData>(GET_ALL_FAKULTAS);

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
      {data?.allFakultas?.map((fakultas) => (
        <Card key={fakultas.id}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {fakultas.nama}
            </CardTitle>
            <CardDescription>
              {fakultas.alias} - Kode: {fakultas.kode}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Program:</span>
                <div className="font-medium">{fakultas.program}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Jenjang:</span>
                <div className="font-medium">{fakultas.jenjang}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {(!data?.allFakultas || data.allFakultas.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Belum ada fakultas</h3>
            <p className="text-muted-foreground">
              Data fakultas akan muncul di sini ketika sudah ditambahkan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function FakultasPage() {
  const { data, loading, error } = useQuery<FakultasData>(GET_ALL_FAKULTAS);
  const isConnected = !loading && !error && data;

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

        <ConnectionStatus isConnected={!!isConnected} />

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
      </div>
    </DashboardLayout>
  );
}
