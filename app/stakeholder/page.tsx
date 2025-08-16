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
import { GET_ALL_STAKEHOLDER } from '@/lib/graphql/queries';
import { CREATE_STAKEHOLDER, UPDATE_STAKEHOLDER, REMOVE_STAKEHOLDER } from '@/lib/graphql/mutations';
import { Stakeholder, StakeholderType, CreateStakeholderInput, UpdateStakeholderInput } from '@/lib/types';
import { Users, Plus, Edit, Trash2, Building, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface StakeholderData {
  stakeholders: Stakeholder[];
}

const stakeholderTypeOptions = [
  { value: StakeholderType.PENGGUNA_LULUSAN, label: 'Pengguna Lulusan', color: 'bg-blue-100 text-blue-800' },
  { value: StakeholderType.ALUMNI, label: 'Alumni', color: 'bg-green-100 text-green-800' },
  { value: StakeholderType.INDUSTRI, label: 'Industri', color: 'bg-orange-100 text-orange-800' },
  { value: StakeholderType.ASOSIASI, label: 'Asosiasi', color: 'bg-purple-100 text-purple-800' },
];

function getStakeholderTypeColor(type: StakeholderType) {
  return stakeholderTypeOptions.find(option => option.value === type)?.color || 'bg-gray-100 text-gray-800';
}

function CreateStakeholderDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<CreateStakeholderInput>();

  const [createStakeholder, { loading }] = useMutation(CREATE_STAKEHOLDER, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_STAKEHOLDER],
  });

  const onSubmit = (data: CreateStakeholderInput) => {
    createStakeholder({
      variables: {
        createStakeholderInput: data,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Stakeholder
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Stakeholder Baru</DialogTitle>
            <DialogDescription>
              Tambahkan stakeholder baru ke sistem
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                placeholder="PT Tech Innovate"
                {...register('nama', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipe">Tipe Stakeholder</Label>
              <Select onValueChange={(value) => setValue('tipe', value as StakeholderType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholderTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organisasi">Organisasi</Label>
              <Input
                id="organisasi"
                placeholder="Tech Company"
                {...register('organisasi', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kontak">Kontak</Label>
              <Input
                id="kontak"
                placeholder="hr@techinnovate.com"
                {...register('kontak', { required: true })}
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

function EditStakeholderDialog({ stakeholder, onSuccess }: { stakeholder: Stakeholder; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<UpdateStakeholderInput>({
    defaultValues: {
      nama: stakeholder.nama,
      tipe: stakeholder.tipe,
      organisasi: stakeholder.organisasi,
      kontak: stakeholder.kontak,
    },
  });

  const [updateStakeholder, { loading }] = useMutation(UPDATE_STAKEHOLDER, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_STAKEHOLDER],
  });

  const onSubmit = (data: UpdateStakeholderInput) => {
    updateStakeholder({
      variables: {
        id: stakeholder.id,
        updateStakeholderInput: data,
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
            <DialogTitle>Edit Stakeholder</DialogTitle>
            <DialogDescription>
              Edit data stakeholder
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nama">Nama</Label>
              <Input
                id="nama"
                placeholder="PT Tech Innovate"
                {...register('nama')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipe">Tipe Stakeholder</Label>
              <Select onValueChange={(value) => setValue('tipe', value as StakeholderType)} defaultValue={stakeholder.tipe}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe stakeholder" />
                </SelectTrigger>
                <SelectContent>
                  {stakeholderTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="organisasi">Organisasi</Label>
              <Input
                id="organisasi"
                placeholder="Tech Company"
                {...register('organisasi')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="kontak">Kontak</Label>
              <Input
                id="kontak"
                placeholder="hr@techinnovate.com"
                {...register('kontak')}
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

function StakeholderList() {
  const { data, loading, error, refetch } = useQuery<StakeholderData>(GET_ALL_STAKEHOLDER);
  const [removeStakeholder] = useMutation(REMOVE_STAKEHOLDER, {
    refetchQueries: [GET_ALL_STAKEHOLDER],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus stakeholder ini?')) {
      await removeStakeholder({ variables: { id } });
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
          Error loading stakeholder: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Group stakeholders by type
  const groupedStakeholders = data?.stakeholders?.reduce((acc, stakeholder) => {
    if (!acc[stakeholder.tipe]) {
      acc[stakeholder.tipe] = [];
    }
    acc[stakeholder.tipe].push(stakeholder);
    return acc;
  }, {} as Record<StakeholderType, Stakeholder[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedStakeholders || {}).map(([type, stakeholders]) => {
        const typeOption = stakeholderTypeOptions.find(opt => opt.value === type);
        return (
          <Card key={type}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {typeOption?.label}
                <Badge className={typeOption?.color}>{stakeholders.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stakeholders.map((stakeholder) => (
                  <div key={stakeholder.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{stakeholder.nama}</span>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Building className="h-3 w-3" />
                            <span>{stakeholder.organisasi}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            <span>{stakeholder.kontak}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <EditStakeholderDialog stakeholder={stakeholder} onSuccess={() => refetch()} />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(stakeholder.id)}
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
        );
      })}
    </div>
  );
}

export default function StakeholderPage() {
  const { refetch } = useQuery<StakeholderData>(GET_ALL_STAKEHOLDER);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Stakeholder</h1>
            <p className="text-muted-foreground">
              Manajemen data stakeholder untuk evaluasi kurikulum
            </p>
          </div>
          <CreateStakeholderDialog onSuccess={() => refetch()} />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daftar Stakeholder</CardTitle>
              <CardDescription>
                Stakeholder yang terdaftar di sistem, dikelompokkan berdasarkan tipe
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium">Tipe Stakeholder:</span>
                  {stakeholderTypeOptions.map((option) => (
                    <Badge key={option.value} className={option.color}>
                      {option.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <StakeholderList />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
