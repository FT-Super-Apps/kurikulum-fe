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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GET_ALL_SURVEY, GET_ALL_SURVEY_QUESTION, GET_ALL_SURVEY_RESPONSE, GET_ALL_PRODI } from '@/lib/graphql/queries';
import { CREATE_SURVEY, UPDATE_SURVEY, REMOVE_SURVEY } from '@/lib/graphql/mutations';
import { Survey, SurveyQuestion, SurveyResponse, Prodi, CreateSurveyInput, UpdateSurveyInput } from '@/lib/types';
import { FileText, Plus, Edit, Trash2, Calendar, Users, BarChart3, MessageCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

interface SurveyData {
  survey: Survey[];
}

interface SurveyQuestionData {
  surveyQuestion: SurveyQuestion[];
}

interface SurveyResponseData {
  surveyResponse: SurveyResponse[];
}

interface ProdiData {
  prodi: Prodi[];
}

function CreateSurveyDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<CreateSurveyInput>();
  const { data: prodiData } = useQuery<ProdiData>(GET_ALL_PRODI);

  const [createSurvey, { loading }] = useMutation(CREATE_SURVEY, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_SURVEY],
  });

  const onSubmit = (data: CreateSurveyInput) => {
    createSurvey({
      variables: {
        createSurveyInput: data,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Survey
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tambah Survey Baru</DialogTitle>
            <DialogDescription>
              Buat survey baru untuk evaluasi kurikulum
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="judul">Judul Survey</Label>
              <Input
                id="judul"
                placeholder="Survey Kompetensi Lulusan 2025"
                {...register('judul', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metode">Metode</Label>
              <Select onValueChange={(value) => setValue('metode', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode survey" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FGD">Focus Group Discussion (FGD)</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="QUESTIONNAIRE">Kuesioner</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="periode">Periode</Label>
              <Input
                id="periode"
                placeholder="[2025-01-01,2025-03-31)"
                {...register('periode', { required: true })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                placeholder="Focus group discussion dengan industri IT..."
                {...register('catatan')}
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

function EditSurveyDialog({ survey, onSuccess }: { survey: Survey; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, setValue, reset } = useForm<UpdateSurveyInput>({
    defaultValues: {
      judul: survey.judul,
      metode: survey.metode,
      periode: survey.periode,
      catatan: survey.catatan,
    },
  });

  const [updateSurvey, { loading }] = useMutation(UPDATE_SURVEY, {
    onCompleted: () => {
      setOpen(false);
      reset();
      onSuccess();
    },
    refetchQueries: [GET_ALL_SURVEY],
  });

  const onSubmit = (data: UpdateSurveyInput) => {
    updateSurvey({
      variables: {
        id: survey.id,
        updateSurveyInput: data,
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
            <DialogTitle>Edit Survey</DialogTitle>
            <DialogDescription>
              Edit data survey
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="judul">Judul Survey</Label>
              <Input
                id="judul"
                placeholder="Survey Kompetensi Lulusan 2025"
                {...register('judul')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="metode">Metode</Label>
              <Select onValueChange={(value) => setValue('metode', value)} defaultValue={survey.metode}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih metode survey" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FGD">Focus Group Discussion (FGD)</SelectItem>
                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                  <SelectItem value="QUESTIONNAIRE">Kuesioner</SelectItem>
                  <SelectItem value="WORKSHOP">Workshop</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="periode">Periode</Label>
              <Input
                id="periode"
                placeholder="[2025-01-01,2025-03-31)"
                {...register('periode')}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="catatan">Catatan</Label>
              <Textarea
                id="catatan"
                placeholder="Focus group discussion dengan industri IT..."
                {...register('catatan')}
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

function SurveyList() {
  const { data, loading, error, refetch } = useQuery<SurveyData>(GET_ALL_SURVEY);
  const [removeSurvey] = useMutation(REMOVE_SURVEY, {
    refetchQueries: [GET_ALL_SURVEY],
  });

  const handleDelete = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus survey ini?')) {
      await removeSurvey({ variables: { id } });
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
          Error loading survey: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {data?.survey.map((survey) => (
        <Card key={survey.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {survey.judul}
                </CardTitle>
                <CardDescription>
                  {survey.prodi?.nama}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{survey.metode}</Badge>
                <EditSurveyDialog survey={survey} onSuccess={() => refetch()} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(survey.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Periode:</span>
                <span>{survey.periode}</span>
              </div>
              {survey.catatan && (
                <div className="flex items-start gap-2 text-sm">
                  <MessageCircle className="h-4 w-4 mt-0.5" />
                  <div>
                    <span className="font-medium">Catatan:</span>
                    <p className="text-muted-foreground mt-1">{survey.catatan}</p>
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

function SurveyQuestionList() {
  const { data, loading, error } = useQuery<SurveyQuestionData>(GET_ALL_SURVEY_QUESTION);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
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
          Error loading survey questions: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  // Group questions by survey
  const groupedQuestions = data?.surveyQuestion.reduce((acc, question) => {
    const surveyId = question.survey?.id || 'unknown';
    if (!acc[surveyId]) {
      acc[surveyId] = {
        survey: question.survey,
        questions: [],
      };
    }
    acc[surveyId].questions.push(question);
    return acc;
  }, {} as Record<string, { survey?: Survey; questions: SurveyQuestion[] }>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedQuestions || {}).map(([surveyId, group]) => (
        <Card key={surveyId}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {group.survey?.judul}
            </CardTitle>
            <CardDescription>
              {group.questions.length} pertanyaan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {group.questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Badge variant="outline" className="mt-1">
                      {question.nomor}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{question.pertanyaan}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {question.tipe}
                        </Badge>
                      </div>
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

function SurveyResponseList() {
  const { data, loading, error } = useQuery<SurveyResponseData>(GET_ALL_SURVEY_RESPONSE);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
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
          Error loading survey responses: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {data?.surveyResponse.map((response) => (
        <Card key={response.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">{response.survey?.judul}</CardTitle>
                <CardDescription>
                  {response.stakeholder?.nama} - {response.stakeholder?.tipe}
                </CardDescription>
              </div>
              <Badge variant="outline">
                Weight: {response.weight}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium text-sm">Pertanyaan:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {response.question?.pertanyaan}
                </p>
              </div>
              <div>
                <span className="font-medium text-sm">Ringkasan:</span>
                <p className="text-sm text-muted-foreground mt-1">
                  {response.ringkasan}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function SurveyPage() {
  const { refetch } = useQuery<SurveyData>(GET_ALL_SURVEY);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Survey</h1>
            <p className="text-muted-foreground">
              Manajemen survey evaluasi kurikulum
            </p>
          </div>
          <CreateSurveyDialog onSuccess={() => refetch()} />
        </div>

        <Tabs defaultValue="surveys" className="space-y-4">
          <TabsList>
            <TabsTrigger value="surveys" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Survey
            </TabsTrigger>
            <TabsTrigger value="questions" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Pertanyaan
            </TabsTrigger>
            <TabsTrigger value="responses" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Respons
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surveys">
            <Card>
              <CardHeader>
                <CardTitle>Daftar Survey</CardTitle>
                <CardDescription>
                  Survey yang telah dibuat untuk evaluasi kurikulum
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SurveyList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="questions">
            <Card>
              <CardHeader>
                <CardTitle>Pertanyaan Survey</CardTitle>
                <CardDescription>
                  Pertanyaan yang terdefinisi dalam setiap survey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SurveyQuestionList />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>Respons Survey</CardTitle>
                <CardDescription>
                  Jawaban yang diberikan oleh stakeholder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SurveyResponseList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
