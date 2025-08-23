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
import { GET_ALL_PROFIL_LULUSAN, GET_ALL_PRODI } from '@/lib/graphql/queries';
import { CREATE_PROFIL_LULUSAN, UPDATE_PROFIL_LULUSAN, REMOVE_PROFIL_LULUSAN } from '@/lib/graphql/mutations';
import { ProfilLulusan, Prodi, CreateProfilLulusanInput, UpdateProfilLulusanInput } from '@/lib/types';
import { Target, Plus, Edit, Trash2, Building, Users } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface ProfilLulusanData {
  allProfilLulusan: ProfilLulusan[];
}

interface ProdiData {
  prodi: Prodi[];
}

function CreateProfilLulusanDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<CreateProfilLulusanInput>();
  const { data: prodiData } = useQuery<ProdiData>(GET_ALL_PRODI);

  const [createProfilLulusan, { loading }] = useMutation(CREATE_PROFIL_LULUSAN, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_PROFIL_LULUSAN],
  });

  const onSubmit = (data: CreateProfilLulusanInput) => {
    createProfilLulusan({
      variables: {
        createProfilLulusanInput: data,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Profil Lulusan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Profil Lulusan Baru</DialogTitle>
            <DialogDescription>
              Tambahkan profil lulusan dan jalur karir baru
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Profil</Label>
              <Input
                id="nama"
                placeholder="Software Engineer"
                {...register('nama', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Profesional yang mampu merancang dan mengembangkan perangkat lunak..."
                {...register('deskripsi', { required: true })}
              />
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

function EditProfilLulusanDialog({ profilLulusan, onSuccess }: { profilLulusan: ProfilLulusan; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<UpdateProfilLulusanInput>({
    defaultValues: {
      id: profilLulusan.id,
      nama: profilLulusan.nama,
      deskripsi: profilLulusan.deskripsi,
    },
  });

  const [updateProfilLulusan, { loading }] = useMutation(UPDATE_PROFIL_LULUSAN, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_PROFIL_LULUSAN],
  });

  const onSubmit = (data: UpdateProfilLulusanInput) => {
    updateProfilLulusan({
      variables: {
        updateProfilLulusanInput: data,
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
            <DialogTitle>Edit Profil Lulusan</DialogTitle>
            <DialogDescription>
              Edit data profil lulusan
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Profil</Label>
              <Input
                id="nama"
                placeholder="Software Engineer"
                {...register('nama')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Profesional yang mampu merancang dan mengembangkan perangkat lunak..."
                {...register('deskripsi')}
              />
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

function ProfilLulusanList() {
  const { data, loading, error, refetch } = useQuery<ProfilLulusanData>(GET_ALL_PROFIL_LULUSAN);
  const [removeProfilLulusan] = useMutation(REMOVE_PROFIL_LULUSAN, {
    refetchQueries: [GET_ALL_PROFIL_LULUSAN],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus profil lulusan ini?')) {
      await removeProfilLulusan({ variables: { id } });
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
          Error loading profil lulusan: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Group by prodi
  const groupedProfilLulusan = data?.allProfilLulusan.reduce((acc, profil) => {
    const prodiKey = profil.prodi?.nama || 'Unknown';
    if (!acc[prodiKey]) {
      acc[prodiKey] = {
        prodi: profil.prodi,
        profiles: [],
      };
    }
    acc[prodiKey].profiles.push(profil);
    return acc;
  }, {} as Record<string, { prodi?: Prodi; profiles: ProfilLulusan[] }>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedProfilLulusan || {}).map(([prodiName, group]) => (
        <Card key={prodiName}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              {prodiName}
            </CardTitle>
            <CardDescription>
              {group.profiles.length} profil lulusan terdefinisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.profiles.map((profil) => (
                <div key={profil.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{profil.nama}</span>
                        <Badge variant="secondary">
                          {group.prodi?.fakultas?.nama || 'Unknown'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{profil.deskripsi}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <EditProfilLulusanDialog profilLulusan={profil} onSuccess={() => refetch()} />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(profil.id)}
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

      {(!data?.allProfilLulusan || data.allProfilLulusan.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <h3 className="text-lg font-medium mb-2">Belum ada profil lulusan</h3>
            <p className="text-muted-foreground">
              Profil lulusan akan muncul di sini ketika sudah ditambahkan
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ProfilLulusanPage() {
  const { refetch } = useQuery<ProfilLulusanData>(GET_ALL_PROFIL_LULUSAN);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profil Lulusan</h1>
            <p className="text-muted-foreground">
              Manajemen profil lulusan dan jalur karir
            </p>
          </div>
          <CreateProfilLulusanDialog onSuccess={() => refetch()} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Daftar Profil Lulusan</CardTitle>
            <CardDescription>
              Profil lulusan yang terdefinisi, dikelompokkan berdasarkan program studi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfilLulusanList />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
