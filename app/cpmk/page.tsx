'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GET_ALL_CPMK, GET_ALL_MATA_KULIAH } from '@/lib/graphql/queries';
import { CREATE_CPMK, UPDATE_CPMK, REMOVE_CPMK } from '@/lib/graphql/mutations';
import { CPMK, MataKuliah, CreateCpmkInput, UpdateCpmkInput, BloomLevel } from '@/lib/types';
import { getBloomColor, bloomLevelInfo } from '@/lib/bloom-colors';
import { Target, Plus, Edit, Trash2, BookOpen } from 'lucide-react';
import { useForm } from 'react-hook-form';

const bloomLevelOptions = Object.entries(bloomLevelInfo).map(([value, info]) => ({
  value: value as BloomLevel,
  label: info.label,
  description: info.description,
  keywords: info.keywords,
  color: getBloomColor(value as BloomLevel)
}));

interface CpmkData {
  cpmk: CPMK[];
}

interface MataKuliahData {
  mataKuliah: MataKuliah[];
}

function CreateCpmkDialog({ onSuccess, disabled = false }: { onSuccess: () => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<CreateCpmkInput>();
  const { data: mataKuliahData } = useQuery<MataKuliahData>(GET_ALL_MATA_KULIAH);

  const [createCpmk, { loading }] = useMutation(CREATE_CPMK, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_CPMK],
  });

  const onSubmit = (data: CreateCpmkInput) => {
    createCpmk({
      variables: {
        createCpmkInput: data,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah CPMK
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah CPMK Baru</DialogTitle>
            <DialogDescription>
              Tambahkan Capaian Pembelajaran Mata Kuliah baru
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode CPMK</Label>
              <Input
                id="kode"
                placeholder="CPMK-1"
                {...register('kode', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Mahasiswa mampu..."
                {...register('deskripsi', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level Bloom</Label>
              <Select onValueChange={(value) => setValue('level', value as BloomLevel)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih level Bloom" />
                </SelectTrigger>
                <SelectContent>
                  {bloomLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="mata_kuliah_id">Mata Kuliah</Label>
              <Select onValueChange={(value) => setValue('mata_kuliah_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih mata kuliah" />
                </SelectTrigger>
                <SelectContent>
                  {mataKuliahData?.mataKuliah.map((mk) => (
                    <SelectItem key={mk.id} value={mk.id}>
                      {mk.kode} - {mk.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditCpmkDialog({ cpmk, onSuccess }: { cpmk: CPMK; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<UpdateCpmkInput>({
    defaultValues: {
      deskripsi: cpmk.deskripsi,
      level: cpmk.level,
    },
  });

  const [updateCpmk, { loading }] = useMutation(UPDATE_CPMK, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_CPMK],
  });

  const onSubmit = (data: UpdateCpmkInput) => {
    updateCpmk({
      variables: {
        id: cpmk.id,
        updateCpmkInput: data,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit CPMK</DialogTitle>
            <DialogDescription>
              Edit Capaian Pembelajaran Mata Kuliah
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Mahasiswa mampu..."
                {...register('deskripsi')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="level">Level Bloom</Label>
              <Select onValueChange={(value) => setValue('level', value as BloomLevel)} defaultValue={cpmk.level || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih level Bloom" />
                </SelectTrigger>
                <SelectContent>
                  {bloomLevelOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function CpmkList() {
  const { data, loading, error, refetch } = useQuery<CpmkData>(GET_ALL_CPMK);
  const { data: mataKuliahData } = useQuery<MataKuliahData>(GET_ALL_MATA_KULIAH);
  const [removeCpmk] = useMutation(REMOVE_CPMK, {
    refetchQueries: [GET_ALL_CPMK],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus CPMK ini?')) {
      await removeCpmk({ variables: { id } });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
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
    const isDbSchemaError = error.message.includes('bloom_level does not exist') || 
                           error.message.includes('column Cpmk.bloom_level');
    
    return (
      <Alert variant="destructive">
        <AlertDescription>
          {isDbSchemaError ? (
            <div className="space-y-3">
              <div className="font-semibold">🔧 Backend Configuration Issue</div>
              <div>
                CPMK feature tidak dapat digunakan karena ada masalah di backend GraphQL resolver.
                Backend mencoba mengakses field 'bloom_level' yang tidak ada di database.
              </div>
              <div className="text-sm p-3 bg-muted rounded">
                <strong>📋 Untuk Administrator Backend:</strong>
                <br />1. Periksa CPMK GraphQL resolver
                <br />2. Pastikan mapping field database sesuai dengan schema
                <br />3. Field di database harus konsisten dengan resolver implementation
                <br />4. Berdasarkan dokumentasi, gunakan field 'level' bukan 'bloom_level'
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Error: {error.message}
              </div>
            </div>
          ) : (
            `Error loading CPMK: ${error.message}`
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Group CPMK by mata kuliah ID and join with mata kuliah data
  const groupedCpmk = data?.cpmk.reduce((acc, cpmk) => {
    const mkKey = cpmk.mata_kuliah_id || 'unknown';
    if (!acc[mkKey]) {
      const mataKuliah = mataKuliahData?.mataKuliah.find(mk => mk.id === cpmk.mata_kuliah_id);
      acc[mkKey] = {
        mataKuliah: mataKuliah,
        cpmkList: [],
      };
    }
    acc[mkKey].cpmkList.push(cpmk);
    return acc;
  }, {} as Record<string, { mataKuliah?: MataKuliah; cpmkList: CPMK[] }>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedCpmk || {}).map(([mkId, group]) => (
        <Card key={mkId}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              {group.mataKuliah?.kode || 'Unknown'} - {group.mataKuliah?.nama || 'Mata Kuliah Tidak Ditemukan'}
            </CardTitle>
            <CardDescription>
              {group.cpmkList.length} CPMK terdefinisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.cpmkList.map((cpmk) => (
                <div key={cpmk.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4" />
                        <span className="font-medium">{cpmk.kode}</span>
                        {cpmk.level && (
                          <Badge className={getBloomColor(cpmk.level)}>
                            {bloomLevelOptions.find(opt => opt.value === cpmk.level)?.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{cpmk.deskripsi}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <EditCpmkDialog cpmk={cpmk} onSuccess={() => refetch()} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(cpmk.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CpmkPage() {
  const { data, loading, error, refetch } = useQuery<CpmkData>(GET_ALL_CPMK);
  const hasError = !!error;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CPMK</h1>
            <p className="text-muted-foreground">
              Manajemen Capaian Pembelajaran Mata Kuliah
            </p>
          </div>
          <CreateCpmkDialog onSuccess={() => refetch()} disabled={hasError} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar CPMK</CardTitle>
              <CardDescription>
                Capaian Pembelajaran Mata Kuliah yang terdefinisi, dikelompokkan berdasarkan mata kuliah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CpmkList />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
