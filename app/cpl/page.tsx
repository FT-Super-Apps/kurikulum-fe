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
import { GET_ALL_CPL, GET_ALL_PRODI } from '@/lib/graphql/queries';
import { CREATE_CPL, UPDATE_CPL, REMOVE_CPL } from '@/lib/graphql/mutations';
import { CPL, Prodi, CplDomain, CreateCplInput, UpdateCplInput } from '@/lib/types';
import { Target, Plus, Edit, Trash2, Building } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface CplData {
  cpls: CPL[];
}

interface ProdiData {
  prodi: Prodi[];
}

const domainOptions = [
  { value: CplDomain.SIKAP, label: 'Sikap' },
  { value: CplDomain.PENGETAHUAN, label: 'Pengetahuan' },
  { value: CplDomain.KETERAMPILAN_UMUM, label: 'Keterampilan Umum' },
  { value: CplDomain.KETERAMPILAN_KHUSUS, label: 'Keterampilan Khusus' },
];

function CreateCplDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, watch, reset } = useForm<CreateCplInput>();
  const { data: prodiData } = useQuery<ProdiData>(GET_ALL_PRODI);

  const [createCpl, { loading }] = useMutation(CREATE_CPL, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_CPL],
  });

  const onSubmit = (data: CreateCplInput) => {
    createCpl({
      variables: {
        createCplInput: data,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah CPL
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah CPL Baru</DialogTitle>
            <DialogDescription>
              Tambahkan Capaian Pembelajaran Lulusan baru
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode CPL</Label>
              <Input
                id="kode"
                placeholder="CPL-01"
                {...register('kode', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi capaian pembelajaran..."
                {...register('deskripsi', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Select onValueChange={(value) => setValue('domain', value as CplDomain)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="prodi_id">Program Studi</Label>
              <Select onValueChange={(value) => setValue('prodi_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih program studi" />
                </SelectTrigger>
                <SelectContent>
                  {prodiData?.prodi.map((prodi) => (
                    <SelectItem key={prodi.id} value={prodi.id}>
                      {prodi.nama}
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

function EditCplDialog({ cpl, onSuccess }: { cpl: CPL; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<UpdateCplInput>({
    defaultValues: {
      deskripsi: cpl.deskripsi,
    },
  });

  const [updateCpl, { loading }] = useMutation(UPDATE_CPL, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_CPL],
  });

  const onSubmit = (data: UpdateCplInput) => {
    updateCpl({
      variables: {
        id: cpl.id,
        updateCplInput: data,
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
            <DialogTitle>Edit CPL</DialogTitle>
            <DialogDescription>
              Edit Capaian Pembelajaran Lulusan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi capaian pembelajaran..."
                {...register('deskripsi')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="domain">Domain</Label>
              <Select onValueChange={(value) => setValue('domain', value as CplDomain)} defaultValue={cpl.domain}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih domain" />
                </SelectTrigger>
                <SelectContent>
                  {domainOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
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

function CplList() {
  const { data, loading, error, refetch } = useQuery<CplData>(GET_ALL_CPL);
  const [removeCpl] = useMutation(REMOVE_CPL, {
    refetchQueries: [GET_ALL_CPL],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus CPL ini?')) {
      await removeCpl({ variables: { id } });
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
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading CPL: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {data?.cpls?.map((cpl: any) => (
        <Card key={cpl.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {cpl.kode}
                </CardTitle>
                <CardDescription>
                  Domain: {cpl.domain}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{cpl.domain}</Badge>
                <EditCplDialog cpl={cpl} onSuccess={() => refetch()} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(cpl.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{cpl.deskripsi}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function CplPage() {
  const { refetch } = useQuery<CplData>(GET_ALL_CPL);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CPL</h1>
            <p className="text-muted-foreground">
              Manajemen Capaian Pembelajaran Lulusan
            </p>
          </div>
          <CreateCplDialog onSuccess={() => refetch()} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar CPL</CardTitle>
            <CardDescription>
              Capaian Pembelajaran Lulusan yang terdefinisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CplList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
