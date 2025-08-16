// Mock data untuk development ketika backend tidak tersedia
export const mockFakultas = [
  {
    id: '1',
    nama: 'Fakultas Teknik',
    prodi: [
      { id: '1', nama: 'Teknik Informatika', fakultas_id: '1' },
      { id: '2', nama: 'Sistem Informasi', fakultas_id: '1' },
    ]
  },
  {
    id: '2',
    nama: 'Fakultas Ekonomi',
    prodi: [
      { id: '3', nama: 'Manajemen', fakultas_id: '2' },
      { id: '4', nama: 'Akuntansi', fakultas_id: '2' },
    ]
  }
];

export const mockCpl = [
  {
    id: '1',
    kode: 'S1',
    deskripsi: 'Bertakwa kepada Tuhan Yang Maha Esa dan mampu menunjukkan sikap religius',
    prodi_id: '1',
    prodi: { id: '1', nama: 'Teknik Informatika' }
  },
  {
    id: '2',
    kode: 'P1',
    deskripsi: 'Menguasai konsep teoritis bidang pengetahuan tertentu secara umum',
    prodi_id: '1',
    prodi: { id: '1', nama: 'Teknik Informatika' }
  }
];

export const mockMataKuliah = [
  {
    id: '1',
    kode: 'IF101',
    nama: 'Pemrograman Dasar',
    sks: 3,
    semester: 1,
    prodi_id: '1',
    prodi: { id: '1', nama: 'Teknik Informatika' }
  },
  {
    id: '2',
    kode: 'IF102',
    nama: 'Struktur Data',
    sks: 3,
    semester: 2,
    prodi_id: '1',
    prodi: { id: '1', nama: 'Teknik Informatika' }
  }
];

export const mockCpmk = [
  {
    id: '1',
    kode: 'CPMK1',
    deskripsi: 'Mahasiswa mampu memahami konsep dasar pemrograman',
    mata_kuliah_id: '1',
    mataKuliah: { id: '1', nama: 'Pemrograman Dasar', kode: 'IF101' }
  },
  {
    id: '2',
    kode: 'CPMK2',
    deskripsi: 'Mahasiswa mampu implementasi algoritma sorting',
    mata_kuliah_id: '2',
    mataKuliah: { id: '2', nama: 'Struktur Data', kode: 'IF102' }
  }
];

export const mockProfilLulusan = [
  {
    id: '1',
    nama: 'Software Engineer',
    deskripsi: 'Profesional yang mampu merancang dan mengembangkan perangkat lunak',
    prodi_id: '1',
    prodi: { id: '1', nama: 'Teknik Informatika' }
  },
  {
    id: '2',
    nama: 'Data Analyst',
    deskripsi: 'Profesional yang mampu menganalisis dan menginterpretasi data',
    prodi_id: '1',
    prodi: { id: '1', nama: 'Teknik Informatika' }
  }
];

export const mockStakeholder = [
  {
    id: '1',
    nama: 'PT. Technology Indonesia',
    jenis: 'Industri',
    kontak: 'contact@techindo.com',
    alamat: 'Jakarta'
  },
  {
    id: '2',
    nama: 'Alumni Informatika',
    jenis: 'Alumni',
    kontak: 'alumni@if.unismuh.ac.id',
    alamat: 'Makassar'
  }
];

export const mockSurvey = [
  {
    id: '1',
    judul: 'Survey Kepuasan Mahasiswa',
    deskripsi: 'Survey untuk mengukur kepuasan mahasiswa terhadap kurikulum',
    tanggal_mulai: '2024-01-01',
    tanggal_selesai: '2024-12-31'
  },
  {
    id: '2',
    judul: 'Survey Industri',
    deskripsi: 'Survey untuk mendapatkan feedback dari industri',
    tanggal_mulai: '2024-01-01',
    tanggal_selesai: '2024-12-31'
  }
];

export const useMockData = false; // Set ke false ketika backend siap
