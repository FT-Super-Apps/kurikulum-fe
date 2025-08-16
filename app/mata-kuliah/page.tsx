'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GET_ALL_MATA_KULIAH, GET_ALL_PRODI } from '@/lib/graphql/queries';
import { CREATE_MATA_KULIAH, UPDATE_MATA_KULIAH, REMOVE_MATA_KULIAH } from '@/lib/graphql/mutations';
import { MataKuliah, Prodi, MataKuliahJenis, CreateMataKuliahInput, UpdateMataKuliahInput } from '@/lib/types';
import { BookOpen, Plus, Edit, Trash2, Clock, GraduationCap } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface MataKuliahData {
  mataKuliah: MataKuliah[];
}

interface ProdiData {
  prodi: Prodi[];
}

const jenisOptions = [
  { value: MataKuliahJenis.WAJIB, label: 'Wajib' },
  { value: MataKuliahJenis.PILIHAN, label: 'Pilihan' },
];

function CreateMataKuliahDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<CreateMataKuliahInput>();
  const { data: prodiData } = useQuery<ProdiData>(GET_ALL_PRODI);

  const [createMataKuliah, { loading }] = useMutation(CREATE_MATA_KULIAH, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_MATA_KULIAH],
  });

  const onSubmit = (data: CreateMataKuliahInput) => {
    createMataKuliah({
      variables: {
        createMataKuliahInput: {
          ...data,
          sks: Number(data.sks),
          semester: Number(data.semester),
        },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Mata Kuliah
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Mata Kuliah Baru</DialogTitle>
            <DialogDescription>
              Tambahkan mata kuliah baru ke sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode Mata Kuliah</Label>
              <Input
                id="kode"
                placeholder="IF101"
                {...register('kode', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Mata Kuliah</Label>
              <Input
                id="nama"
                placeholder="Algoritma dan Pemrograman"
                {...register('nama', { required: true })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sks">SKS</Label>
                <Input
                  id="sks"
                  type="number"
                  min="1"
                  max="10"
                  placeholder="3"
                  {...register('sks', { required: true })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="14"
                  placeholder="1"
                  {...register('semester', { required: true })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jenis">Jenis</Label>
              <Select onValueChange={(value) => setValue('jenis', value as MataKuliahJenis)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis mata kuliah" />
                </SelectTrigger>
                <SelectContent>
                  {jenisOptions.map((option) => (
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

function EditMataKuliahDialog({ mataKuliah, onSuccess }: { mataKuliah: MataKuliah; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<UpdateMataKuliahInput>({
    defaultValues: {
      nama: mataKuliah.nama,
      sks: mataKuliah.sks,
      semester: mataKuliah.semester,
      jenis: mataKuliah.jenis,
    },
  });

  const [updateMataKuliah, { loading }] = useMutation(UPDATE_MATA_KULIAH, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_MATA_KULIAH],
  });

  const onSubmit = (data: UpdateMataKuliahInput) => {
    updateMataKuliah({
      variables: {
        id: mataKuliah.id,
        updateMataKuliahInput: {
          ...data,
          sks: Number(data.sks),
          semester: Number(data.semester),
        },
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
            <DialogTitle>Edit Mata Kuliah</DialogTitle>
            <DialogDescription>
              Edit data mata kuliah
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Mata Kuliah</Label>
              <Input
                id="nama"
                placeholder="Algoritma dan Pemrograman"
                {...register('nama')}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sks">SKS</Label>
                <Input
                  id="sks"
                  type="number"
                  min="1"
                  max="10"
                  {...register('sks')}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  type="number"
                  min="1"
                  max="14"
                  {...register('semester')}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="jenis">Jenis</Label>
              <Select onValueChange={(value) => setValue('jenis', value as MataKuliahJenis)} defaultValue={mataKuliah.jenis}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis mata kuliah" />
                </SelectTrigger>
                <SelectContent>
                  {jenisOptions.map((option) => (
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

function MataKuliahList() {
  const { data, loading, error, refetch } = useQuery<MataKuliahData>(GET_ALL_MATA_KULIAH);
  const [removeMataKuliah] = useMutation(REMOVE_MATA_KULIAH, {
    refetchQueries: [GET_ALL_MATA_KULIAH],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
      await removeMataKuliah({ variables: { id } });
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
          Error loading mata kuliah: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {data?.mataKuliah.map((mataKuliah) => (
        <Card key={mataKuliah.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {mataKuliah.kode} - {mataKuliah.nama}
                </CardTitle>
                <CardDescription>
                  {mataKuliah.prodi?.nama}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{mataKuliah.jenis}</Badge>
                <EditMataKuliahDialog mataKuliah={mataKuliah} onSuccess={() => refetch()} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(mataKuliah.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                <span>{mataKuliah.sks} SKS</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Semester {mataKuliah.semester}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function MataKuliahPage() {
  const { refetch } = useQuery<MataKuliahData>(GET_ALL_MATA_KULIAH);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mata Kuliah</h1>
            <p className="text-muted-foreground">
              Manajemen data mata kuliah
            </p>
          </div>
          <CreateMataKuliahDialog onSuccess={() => refetch()} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Mata Kuliah</CardTitle>
            <CardDescription>
              Mata kuliah yang tersedia di sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MataKuliahList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
