// Enum Types
export enum JenjangType {
  D3 = 'D3',
  S1 = 'S1',
  S2 = 'S2',
  S3 = 'S3'
}

export enum CplDomain {
  SIKAP = 'SIKAP',
  PENGETAHUAN = 'PENGETAHUAN',
  KETERAMPILAN_UMUM = 'KETERAMPILAN_UMUM',
  KETERAMPILAN_KHUSUS = 'KETERAMPILAN_KHUSUS'
}

export enum MataKuliahJenis {
  WAJIB = 'WAJIB',
  PILIHAN = 'PILIHAN'
}

export enum BloomLevel {
  MENGINGAT = 'MENGINGAT',
  MEMAHAMI = 'MEMAHAMI',
  MENERAPKAN = 'MENERAPKAN',
  MENGANALISIS = 'MENGANALISIS',
  MENGEVALUASI = 'MENGEVALUASI',
  MENCIPTA = 'MENCIPTA'
}

export enum StakeholderType {
  PENGGUNA_LULUSAN = 'PENGGUNA_LULUSAN',
  ALUMNI = 'ALUMNI',
  INDUSTRI = 'INDUSTRI',
  ASOSIASI = 'ASOSIASI'
}

// Base Entity Types
export interface Fakultas {
  kode: string;
  nama: string;
  alias: string;
  program: string;
  jenjang: string;
  created_at: string;
  updated_at: string;
  prodi?: Prodi[];
}

export interface Prodi {
  id: string;
  kode: string;
  nama: string;
  nama_eng: string;
  fakultas_kode: string;
  gelar_pendek: string;
  gelar: string;
  gelar_eng: string;
  jenjang: JenjangType;
  created_at: string;
  updated_at: string;
  fakultas?: Fakultas;
  cpl?: CPL[];
  mataKuliah?: MataKuliah[];
  profilLulusan?: ProfilLulusan[];
}

export interface ProfilLulusan {
  id: string;
  nama: string;
  deskripsi: string;
  prodi_id: string;
  created_at: string;
  updated_at: string;
  prodi?: Prodi;
}

export interface CPL {
  id: string;
  kode: string;
  deskripsi: string;
  domain: CplDomain;
  prodi_id: string;
  created_at: string;
  updated_at: string;
  prodi?: Prodi;
}

export interface MataKuliah {
  id: string;
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  jenis: MataKuliahJenis;
  prodi_id: string;
  created_at: string;
  updated_at: string;
  prodi?: Prodi;
  cpmk?: CPMK[];
}

export interface CPMK {
  id: string;
  kode: string;
  deskripsi: string;
  level: BloomLevel;
  mata_kuliah_id: string;
  created_at: string;
  updated_at: string;
  mataKuliah?: MataKuliah;
}

export interface CpmkCpl {
  id: string;
  cpmk_id: string;
  cpl_id: string;
  cpmk?: CPMK;
  cpl?: CPL;
}

export interface Stakeholder {
  id: string;
  nama: string;
  tipe: StakeholderType;
  organisasi: string;
  kontak: string;
  created_at: string;
}

export interface Survey {
  id: string;
  prodi_id: string;
  judul: string;
  metode: string;
  periode: string;
  catatan: string;
  created_at: string;
  prodi?: Prodi;
}

export interface SurveyQuestion {
  id: string;
  survey_id: string;
  nomor: number;
  pertanyaan: string;
  tipe: string;
  created_at: string;
  survey?: Survey;
}

export interface SurveyResponse {
  id: string;
  survey_id: string;
  question_id: string;
  stakeholder_id: string;
  ringkasan: string;
  detail_json: string;
  weight: number;
  created_at: string;
  survey?: Survey;
  question?: SurveyQuestion;
  stakeholder?: Stakeholder;
}

// Input Types for Mutations
export interface CreateProfilLulusanInput {
  nama: string;
  deskripsi: string;
  prodi_id: string;
}

export interface UpdateProfilLulusanInput {
  id: string;
  nama?: string;
  deskripsi?: string;
}

export interface CreateCplInput {
  kode: string;
  deskripsi: string;
  domain: CplDomain;
  prodi_id: string;
}

export interface UpdateCplInput {
  deskripsi?: string;
  domain?: CplDomain;
}

export interface CreateMataKuliahInput {
  kode: string;
  nama: string;
  sks: number;
  semester: number;
  jenis: MataKuliahJenis;
  prodi_id: string;
}

export interface UpdateMataKuliahInput {
  nama?: string;
  sks?: number;
  semester?: number;
  jenis?: MataKuliahJenis;
}

export interface CreateCpmkInput {
  kode: string;
  deskripsi: string;
  level: BloomLevel;
  mata_kuliah_id: string;
}

export interface UpdateCpmkInput {
  deskripsi?: string;
  level?: BloomLevel;
}

export interface CreateCpmkCplInput {
  cpmk_id: string;
  cpl_id: string;
}

export interface UpdateCpmkCplInput {
  cpmk_id?: string;
  cpl_id?: string;
}

export interface CreateStakeholderInput {
  nama: string;
  tipe: StakeholderType;
  organisasi: string;
  kontak: string;
}

export interface UpdateStakeholderInput {
  nama?: string;
  tipe?: StakeholderType;
  organisasi?: string;
  kontak?: string;
}

export interface CreateSurveyInput {
  prodi_id: string;
  judul: string;
  metode: string;
  periode: string;
  catatan: string;
}

export interface UpdateSurveyInput {
  judul?: string;
  metode?: string;
  periode?: string;
  catatan?: string;
}

export interface CreateSurveyQuestionInput {
  survey_id: string;
  nomor: number;
  pertanyaan: string;
  tipe: string;
}

export interface UpdateSurveyQuestionInput {
  pertanyaan?: string;
  tipe?: string;
}

export interface CreateSurveyResponseInput {
  survey_id: string;
  question_id: string;
  stakeholder_id: string;
  ringkasan: string;
  detail_json: string;
  weight: number;
}

export interface UpdateSurveyResponseInput {
  ringkasan?: string;
  detail_json?: string;
  weight?: number;
}
