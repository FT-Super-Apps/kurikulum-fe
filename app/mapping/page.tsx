'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GET_ALL_CPMK_CPL, GET_ALL_CPMK, GET_ALL_CPL } from '@/lib/graphql/queries';
import { CREATE_CPMK_CPL, REMOVE_CPMK_CPL } from '@/lib/graphql/mutations';
import { CpmkCpl, CPMK, CPL, CreateCpmkCplInput } from '@/lib/types';
import { ArrowRight, Plus, Trash2, Link, Target, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CpmkCplData {
  cpmkCpl: CpmkCpl[];
}

interface CpmkData {
  cpmk: CPMK[];
}

interface CplData {
  cpl: CPL[];
}

function CreateMappingDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { setValue, watch, reset } = useForm<CreateCpmkCplInput>();
  const { data: cpmkData } = useQuery<CpmkData>(GET_ALL_CPMK);
  const { data: cplData } = useQuery<CplData>(GET_ALL_CPL);

  const selectedCpmkId = watch('cpmk_id');
  const selectedCplId = watch('cpl_id');

  const [createMapping, { loading }] = useMutation(CREATE_CPMK_CPL, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_CPMK_CPL],
  });

  const onSubmit = () => {
    if (selectedCpmkId && selectedCplId) {
      createMapping({
        variables: {
          createCpmkCplInput: {
            cpmk_id: selectedCpmkId,
            cpl_id: selectedCplId,
          },
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Mapping
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tambah Mapping CPMK-CPL</DialogTitle>
          <DialogDescription>
            Buat mapping antara CPMK dan CPL
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="cpmk_id">CPMK</Label>
            <Select onValueChange={(value) => setValue('cpmk_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih CPMK" />
              </SelectTrigger>
              <SelectContent>
                {cpmkData?.cpmk.map((cpmk) => (
                  <SelectItem key={cpmk.id} value={cpmk.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{cpmk.kode}</span>
                      <span className="text-xs text-muted-foreground">
                        {cpmk.mataKuliah?.nama}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="cpl_id">CPL</Label>
            <Select onValueChange={(value) => setValue('cpl_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih CPL" />
              </SelectTrigger>
              <SelectContent>
                {cplData?.cpl.map((cpl) => (
                  <SelectItem key={cpl.id} value={cpl.id}>
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{cpl.kode}</span>
                      <span className="text-xs text-muted-foreground">
                        {cpl.domain} - {cpl.prodi?.nama}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedCpmkId && selectedCplId && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {cpmkData?.cpmk.find(c => c.id === selectedCpmkId)?.kode}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cpmkData?.cpmk.find(c => c.id === selectedCpmkId)?.mataKuliah?.nama}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {cplData?.cpl.find(c => c.id === selectedCplId)?.kode}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {cplData?.cpl.find(c => c.id === selectedCplId)?.domain}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button
            onClick={onSubmit}
            disabled={loading || !selectedCpmkId || !selectedCplId}
          >
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function MappingTable() {
  const { data, loading, error, refetch } = useQuery<CpmkCplData>(GET_ALL_CPMK_CPL);
  const [removeMapping] = useMutation(REMOVE_CPMK_CPL, {
    refetchQueries: [GET_ALL_CPMK_CPL],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus mapping ini?')) {
      await removeMapping({ variables: { id } });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading mapping: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CPMK</TableHead>
            <TableHead>Mata Kuliah</TableHead>
            <TableHead>CPL</TableHead>
            <TableHead>Domain CPL</TableHead>
            <TableHead>Program Studi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.cpmkCpl.map((mapping) => (
            <TableRow key={mapping.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-medium">{mapping.cpmk?.kode}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {mapping.cpmk?.deskripsi}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-green-600" />
                  <div>
                    <div className="font-medium text-sm">
                      {mapping.cpmk?.mataKuliah?.kode}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {mapping.cpmk?.mataKuliah?.nama}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-orange-600" />
                  <div>
                    <div className="font-medium">{mapping.cpl?.kode}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                      {mapping.cpl?.deskripsi}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{mapping.cpl?.domain}</Badge>
              </TableCell>
              <TableCell>
                <div className="text-sm">{mapping.cpl?.prodi?.nama}</div>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(mapping.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {(!data?.cpmkCpl || data.cpmkCpl.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          <Link className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
          <p>Belum ada mapping CPMK-CPL yang dibuat</p>
          <p className="text-sm">Tambahkan mapping untuk menghubungkan CPMK dengan CPL</p>
        </div>
      )}
    </div>
  );
}

function MappingMatrix() {
  const { data: mappingData } = useQuery<CpmkCplData>(GET_ALL_CPMK_CPL);
  const { data: cpmkData } = useQuery<CpmkData>(GET_ALL_CPMK);
  const { data: cplData } = useQuery<CplData>(GET_ALL_CPL);

  if (!mappingData || !cpmkData || !cplData) {
    return <Skeleton className="h-64 w-full" />;
  }

  const mappingMatrix: Record<string, Record<string, boolean>> = {};

  // Build mapping matrix
  mappingData.cpmkCpl.forEach((mapping) => {
    if (mapping.cpmk?.id && mapping.cpl?.id) {
      if (!mappingMatrix[mapping.cpmk.id]) {
        mappingMatrix[mapping.cpmk.id] = {};
      }
      mappingMatrix[mapping.cpmk.id][mapping.cpl.id] = true;
    }
  });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[200px]">CPMK</TableHead>
            {cplData.cpl.map((cpl) => (
              <TableHead key={cpl.id} className="text-center min-w-[100px]">
                <div className="text-xs">{cpl.kode}</div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {cpmkData.cpmk.map((cpmk) => (
            <TableRow key={cpmk.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-sm">{cpmk.kode}</div>
                  <div className="text-xs text-muted-foreground">
                    {cpmk.mataKuliah?.kode}
                  </div>
                </div>
              </TableCell>
              {cplData.cpl.map((cpl) => (
                <TableCell key={cpl.id} className="text-center">
                  {mappingMatrix[cpmk.id]?.[cpl.id] ? (
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div>
                  ) : (
                    <div className="w-4 h-4 bg-gray-200 rounded-full mx-auto"></div>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function MappingPage() {
  const { refetch } = useQuery<CpmkCplData>(GET_ALL_CPMK_CPL);
  const [activeTab, setActiveTab] = useState<'table' | 'matrix'>('table');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mapping CPMK-CPL</h1>
            <p className="text-muted-foreground">
              Pemetaan hubungan antara CPMK dan CPL
            </p>
          </div>
          <CreateMappingDialog onSuccess={() => refetch()} />
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === 'table' ? 'default' : 'outline'}
            onClick={() => setActiveTab('table')}
          >
            Tabel Mapping
          </Button>
          <Button
            variant={activeTab === 'matrix' ? 'default' : 'outline'}
            onClick={() => setActiveTab('matrix')}
          >
            Matriks Mapping
          </Button>
        </div>

        {activeTab === 'table' ? (
          <Card>
            <CardHeader>
              <CardTitle>Daftar Mapping CPMK-CPL</CardTitle>
              <CardDescription>
                Hubungan yang telah dibuat antara CPMK dan CPL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MappingTable />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Matriks CPMK-CPL</CardTitle>
              <CardDescription>
                Visualisasi matriks hubungan antara CPMK dan CPL
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Terhubung</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                  <span>Tidak terhubung</span>
                </div>
              </div>
              <MappingMatrix />
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
