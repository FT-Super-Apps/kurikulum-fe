## 📦 Module Documentation

### 1. Fakultas Module

**Purpose**: Mengelola data fakultas/schools dalam universitas.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `kode` | String (PK) | Kode unik fakultas (e.g., "01") |
| `nama` | String | Nama fakultas |
| `alias` | String | Singkatan fakultas |
| `program` | String | Jenis program |
| `jenjang` | String | Jenjang pendidikan |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### GraphQL Queries

```graphql
# Get all fakultas
query {
  fakultas {
    kode
    nama
    alias
    program
    jenjang
    prodi {
      kode
      nama
    }
  }
}

# Find fakultas by kode
query {
  findFakultasByKode(kode: "01") {
    kode
    nama
    alias
    prodi {
      kode
      nama
      gelar_pendek
    }
  }
}
```

#### GraphQL Mutations

**Note**: Fakultas adalah read-only resource. Tidak ada mutations yang tersedia.

#### Relations

- **One-to-Many** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)

---

### 2. Prodi Module

**Purpose**: Mengelola program studi dalam fakultas dengan informasi gelar.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik program studi |
| `kode` | String | Kode program studi |
| `nama` | String | Nama program studi (Indonesia) |
| `nama_eng` | String | Nama program studi (English) |
| `fakultas_kode` | String (FK) | Referensi ke fakultas |
| `gelar_pendek` | String | Gelar singkat (e.g., "S.Kom") |
| `gelar` | String | Gelar lengkap |
| `gelar_eng` | String | Gelar dalam bahasa Inggris |
| `jenjang` | Enum | Jenjang pendidikan (D3/S1/S2/S3) |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### GraphQL Queries

```graphql
# Get all prodi
query {
  prodi {
    id
    kode
    nama
    nama_eng
    gelar_pendek
    gelar
    fakultas {
      nama
      alias
    }
  }
}

# Find prodi by kode
query {
  findProdiByKode(kode: "55201") {
    id
    nama
    fakultas {
      nama
    }
  }
}

# Get prodi by fakultas
query {
  prodiByFakultas(fakultas_kode: "01") {
    kode
    nama
    gelar_pendek
  }
}
```

#### GraphQL Mutations

**Note**: Prodi adalah read-only resource. Tidak ada mutations yang tersedia.

#### Relations

- **Many-to-One** dengan [`Fakultas`](src/fakultas/entities/fakultas.entity.ts)
- **One-to-Many** dengan [`CPL`](src/cpl/entities/cpl.entity.ts)
- **One-to-Many** dengan [`MataKuliah`](src/mata-kuliah/entities/mata-kuliah.entity.ts)
- **One-to-Many** dengan [`ProfilLulusan`](src/profil-lulusan/entities/profil-lulusan.entity.ts)

---

### 3. Profil Lulusan Module

**Purpose**: Mendefinisikan profil lulusan dan jalur karir untuk program studi.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik profil |
| `nama` | String | Nama profil lulusan |
| `deskripsi` | String | Deskripsi detail profil |
| `prodi_id` | UUID (FK) | Referensi ke program studi |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### GraphQL Queries

```graphql
# Get all profil lulusan
query {
  allProfilLulusan {
    id
    nama
    deskripsi
    prodi {
      nama
      fakultas {
        nama
      }
    }
  }
}

# Find profil by ID
query {
  profilLulusan(id: "550e8400-e29b-41d4-a716-446655440000") {
    nama
    deskripsi
    prodi {
      nama
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create profil lulusan
mutation {
  createProfilLulusan(
    createProfilLulusanInput: {
      nama: "Software Engineer"
      deskripsi: "Profesional yang mampu merancang dan mengembangkan perangkat lunak"
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    nama
    deskripsi
  }
}

# Update profil lulusan
mutation {
  updateProfilLulusan(
    updateProfilLulusanInput: {
      id: "550e8400-e29b-41d4-a716-446655440000"
      nama: "Senior Software Engineer"
      deskripsi: "Profesional senior dalam pengembangan software"
    }
  ) {
    id
    nama
    deskripsi
  }
}

# Remove profil lulusan
mutation {
  removeProfilLulusan(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)

---

### 4. CPL Module

**Purpose**: Mengelola Capaian Pembelajaran Lulusan (Graduate Learning Outcomes) dengan klasifikasi domain.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik CPL |
| `kode` | String | Kode CPL (e.g., "CPL-01") |
| `deskripsi` | String | Deskripsi CPL |
| `domain` | Enum | Domain pembelajaran |
| `prodi_id` | UUID (FK) | Referensi ke program studi |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### Domain Types

- `SIKAP`: Domain sikap dan tata nilai
- `PENGETAHUAN`: Domain pengetahuan
- `KETERAMPILAN_UMUM`: Domain keterampilan umum
- `KETERAMPILAN_KHUSUS`: Domain keterampilan khusus

#### GraphQL Queries

```graphql
# Get all CPL
query {
  cpl {
    id
    kode
    deskripsi
    domain
    prodi {
      nama
      fakultas {
        nama
      }
    }
  }
}

# Find CPL by ID
query {
  findCplById(id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    domain
  }
}

# Find CPL by prodi
query {
  findCplByProdi(prodi_id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    domain
  }
}

# Find CPL by domain
query {
  findCplByDomain(domain: PENGETAHUAN) {
    kode
    deskripsi
    prodi {
      nama
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create CPL
mutation {
  createCpl(
    createCplInput: {
      kode: "CPL-01"
      deskripsi: "Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif"
      domain: KETERAMPILAN_UMUM
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    kode
    deskripsi
    domain
  }
}

# Update CPL
mutation {
  updateCpl(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateCplInput: {
      deskripsi: "Mampu menerapkan pemikiran logis dan kritis dalam pengembangan software"
    }
  ) {
    id
    kode
    deskripsi
  }
}

# Remove CPL
mutation {
  removeCpl(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)
- **Many-to-Many** dengan [`CPMK`](src/cpmk/entities/cpmk.entity.ts) melalui [`CpmkCpl`](src/cpmk-cpl/entities/cpmk-cpl.entity.ts)

---

### 5. Mata Kuliah Module

**Purpose**: Mengelola mata kuliah/courses dengan informasi SKS dan semester.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik mata kuliah |
| `kode` | String | Kode mata kuliah (e.g., "IF101") |
| `nama` | String | Nama mata kuliah |
| `sks` | Integer | Jumlah SKS (1-10) |
| `semester` | Integer | Semester (1-14) |
| `jenis` | Enum | Jenis mata kuliah |
| `prodi_id` | UUID (FK) | Referensi ke program studi |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### Jenis Mata Kuliah

- `WAJIB`: Mata kuliah wajib
- `PILIHAN`: Mata kuliah pilihan

#### GraphQL Queries

```graphql
# Get all mata kuliah
query {
  mataKuliah {
    id
    kode
    nama
    sks
    semester
    jenis
    prodi {
      nama
    }
  }
}

# Find mata kuliah by ID
query {
  findMataKuliahById(id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    nama
    sks
  }
}

# Find mata kuliah by prodi
query {
  findMataKuliahByProdi(prodi_id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    nama
    semester
    jenis
  }
}

# Find mata kuliah by semester
query {
  findMataKuliahBySemester(semester: 3) {
    kode
    nama
    sks
    jenis
  }
}

# Find mata kuliah by jenis
query {
  findMataKuliahByJenis(jenis: WAJIB) {
    kode
    nama
    semester
  }
}
```

#### GraphQL Mutations

```graphql
# Create mata kuliah
mutation {
  createMataKuliah(
    createMataKuliahInput: {
      kode: "IF101"
      nama: "Algoritma dan Pemrograman"
      sks: 3
      semester: 1
      jenis: WAJIB
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    kode
    nama
    sks
  }
}

# Update mata kuliah
mutation {
  updateMataKuliah(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateMataKuliahInput: {
      nama: "Algoritma dan Pemrograman Lanjut"
      sks: 4
    }
  ) {
    id
    nama
    sks
  }
}

# Remove mata kuliah
mutation {
  removeMataKuliah(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)
- **One-to-Many** dengan [`CPMK`](src/cpmk/entities/cpmk.entity.ts)

---

### 6. CPMK Module

**Purpose**: Mengelola Capaian Pembelajaran Mata Kuliah (Course Learning Outcomes) dengan klasifikasi Bloom's taxonomy.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik CPMK |
| `kode` | String | Kode CPMK (e.g., "CPMK-1") |
| `deskripsi` | String | Deskripsi CPMK |
| `level` | Enum | Level Bloom's taxonomy |
| `mata_kuliah_id` | UUID (FK) | Referensi ke mata kuliah |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### Bloom's Taxonomy Levels

- `MENGINGAT`: Kemampuan mengingat informasi
- `MEMAHAMI`: Kemampuan memahami makna
- `MENERAPKAN`: Kemampuan menggunakan informasi
- `MENGANALISIS`: Kemampuan memecah informasi
- `MENGEVALUASI`: Kemampuan menilai
- `MENCIPTA`: Kemampuan menciptakan sesuatu baru

#### GraphQL Queries

```graphql
# Get all CPMK
query {
  cpmk {
    id
    kode
    deskripsi
    level
    mataKuliah {
      kode
      nama
    }
  }
}

# Find CPMK by ID
query {
  findCpmkById(id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    level
  }
}

# Find CPMK by mata kuliah
query {
  findCpmkByMataKuliah(mata_kuliah_id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    level
  }
}

# Find CPMK by Bloom level
query {
  findCpmkByBloomLevel(bloomLevel: MEMAHAMI) {
    kode
    deskripsi
    mataKuliah {
      nama
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create CPMK
mutation {
  createCpmk(
    createCpmkInput: {
      kode: "CPMK-1"
      deskripsi: "Mahasiswa mampu memahami konsep dasar algoritma"
      level: MEMAHAMI
      mata_kuliah_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    kode
    deskripsi
    level
  }
}

# Update CPMK
mutation {
  updateCpmk(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateCpmkInput: {
      deskripsi: "Mahasiswa mampu menerapkan konsep algoritma dalam pemrograman"
      level: MENERAPKAN
    }
  ) {
    id
    deskripsi
    level
  }
}

# Remove CPMK
mutation {
  removeCpmk(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`MataKuliah`](src/mata-kuliah/entities/mata-kuliah.entity.ts)
- **Many-to-Many** dengan [`CPL`](src/cpl/entities/cpl.entity.ts) melalui [`CpmkCpl`](src/cpmk-cpl/entities/cpmk-cpl.entity.ts)

---

### 7. CPMK-CPL Module

**Purpose**: Mengelola mapping antara CPMK dan CPL (Many-to-Many relationship).

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik mapping |
| `cpmk_id` | UUID (FK) | Referensi ke CPMK |
| `cpl_id` | UUID (FK) | Referensi ke CPL |

#### GraphQL Queries

```graphql
# Get all CPMK-CPL mappings
query {
  cpmkCpl {
    id
    cpmk {
      kode
      deskripsi
      mataKuliah {
        nama
      }
    }
    cpl {
      kode
      deskripsi
      domain
    }
  }
}

# Find mapping by ID
query {
  findCpmkCplById(id: "550e8400-e29b-41d4-a716-446655440000") {
    cpmk {
      kode
    }
    cpl {
      kode
    }
  }
}

# Find mappings by CPMK
query {
  findCpmkCplByCpmk(cpmk_id: "550e8400-e29b-41d4-a716-446655440000") {
    cpl {
      kode
      deskripsi
      domain
    }
  }
}

# Find mappings by CPL
query {
  findCpmkCplByCpl(cpl_id: "550e8400-e29b-41d4-a716-446655440000") {
    cpmk {
      kode
      deskripsi
      mataKuliah {
        nama
      }
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create CPMK-CPL mapping
mutation {
  createCpmkCpl(
    createCpmkCplInput: {
      cpmk_id: "550e8400-e29b-41d4-a716-446655440000"
      cpl_id: "550e8400-e29b-41d4-a716-446655440001"
    }
  ) {
    id
    cpmk {
      kode
    }
    cpl {
      kode
    }
  }
}

# Update CPMK-CPL mapping
mutation {
  updateCpmkCpl(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateCpmkCplInput: {
      cpmk_id: "550e8400-e29b-41d4-a716-446655440002"
    }
  ) {
    id
    cpmk {
      kode
    }
  }
}

# Remove mapping by ID
mutation {
  removeCpmkCpl(id: "550e8400-e29b-41d4-a716-446655440000")
}

# Remove mapping by CPMK and CPL IDs
mutation {
  removeCpmkCplByIds(
    cpmk_id: "550e8400-e29b-41d4-a716-446655440000"
    cpl_id: "550e8400-e29b-41d4-a716-446655440001"
  )
}
```

#### Relations

- **Many-to-One** dengan [`CPMK`](src/cpmk/entities/cpmk.entity.ts)
- **Many-to-One** dengan [`CPL`](src/cpl/entities/cpl.entity.ts)

---

### 8. Stakeholder Module

**Purpose**: Mengelola data stakeholder yang berpartisipasi dalam survey evaluasi kurikulum.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik stakeholder |
| `nama` | String | Nama stakeholder |
| `tipe` | Enum | Tipe stakeholder |
| `organisasi` | String | Nama organisasi/perusahaan |
| `kontak` | String | Informasi kontak |
| `created_at` | DateTime | Timestamp pembuatan |

#### Stakeholder Types

- `PENGGUNA_LULUSAN`: Pengguna lulusan/employer
- `ALUMNI`: Alumni program studi
- `INDUSTRI`: Perwakilan industri
- `ASOSIASI`: Asosiasi profesi

#### GraphQL Queries

```graphql
# Get all stakeholders
query {
  stakeholder {
    id
    nama
    tipe
    organisasi
    kontak
  }
}

# Find stakeholder by ID
query {
  findStakeholderById(id: "550e8400-e29b-41d4-a716-446655440000") {
    nama
    tipe
    organisasi
  }
}

# Find stakeholders by type
query {
  findStakeholderByTipe(tipe: INDUSTRI) {
    nama
    organisasi
    kontak
  }
}
```

#### GraphQL Mutations

```graphql
# Create stakeholder
mutation {
  createStakeholder(
    createStakeholderInput: {
      nama: "PT Tech Innovate"
      tipe: PENGGUNA_LULUSAN
      organisasi: "Tech Company"
      kontak: "hr@techinnovate.com"
    }
  ) {
    id
    nama
    tipe
  }
}

# Update stakeholder
mutation {
  updateStakeholder(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateStakeholderInput: {
      kontak: "newemail@techinnovate.com"
    }
  ) {
    id
    nama
    kontak
  }
}

# Remove stakeholder
mutation {
  removeStakeholder(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **One-to-Many** dengan [`SurveyResponse`](src/survey-response/entities/survey-response.entity.ts)

---

### 9. Survey Module

**Purpose**: Mengelola instance survey untuk mengumpulkan feedback stakeholder.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik survey |
| `prodi_id` | UUID (FK) | Program studi yang melakukan survey |
| `judul` | String | Judul survey |
| `metode` | String | Metode pengumpulan data |
| `periode` | DateRange | Periode pelaksanaan survey |
| `catatan` | String | Catatan tambahan |
| `created_at` | DateTime | Timestamp pembuatan |

#### GraphQL Queries

```graphql
# Get all surveys
query {
  survey {
    id
    judul
    metode
    periode
    catatan
    prodi {
      nama
    }
  }
}

# Find survey by ID
query {
  findSurveyById(id: "550e8400-e29b-41d4-a716-446655440000") {
    judul
    metode
    prodi {
      nama
    }
  }
}

# Find surveys by prodi
query {
  findSurveyByProdi(prodi_id: "550e8400-e29b-41d4-a716-446655440000") {
    judul
    metode
    periode
  }
}

# Find surveys by method
query {
  findSurveyByMetode(metode: "FGD") {
    judul
    prodi {
      nama
    }
    periode
  }
}
```

#### GraphQL Mutations

```graphql
# Create survey
mutation {
  createSurvey(
    createSurveyInput: {
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
      judul: "Survey Kompetensi Lulusan 2025"
      metode: "FGD"
      periode: "[2025-01-01,2025-03-31)"
      catatan: "Focus group discussion dengan industri IT"
    }
  ) {
    id
    judul
    metode
  }
}

# Update survey
mutation {
  updateSurvey(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateSurveyInput: {
      periode: "[2025-02-01,2025-04-30)"
      catatan: "Diperpanjang hingga April"
    }
  ) {
    id
    periode
    catatan
  }
}

# Remove survey
mutation {
  removeSurvey(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)
- **One-to-Many** dengan [`SurveyQuestion`](src/survey-question/entities/survey-question.entity.ts)
- **One-to-Many** dengan [`SurveyResponse`](src/survey-response/entities/survey-response.entity.ts)

---

### 10. Survey Question Module

**Purpose**: Mengelola pertanyaan-pertanyaan dalam survey.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik pertanyaan |
| `survey_id` | UUID (FK) | Referensi ke survey |
| `nomor` | Integer | Nomor urut pertanyaan |
| `pertanyaan` | String | Teks pertanyaan |
| `tipe` | String | Tipe jawaban yang diharapkan |
| `created_at` | DateTime | Timestamp pembuatan |

#### GraphQL Queries

```graphql
# Get all survey questions
query {
  surveyQuestion {
    id
    nomor
    pertanyaan
    tipe
    survey {
      judul
    }
  }
}

# Find question by ID
query {
  findSurveyQuestionById(id: "550e8400-e29b-41d4-a716-446655440000") {
    pertanyaan
    tipe
  }
}

# Find questions by survey
query {
  findQuestionsBySurvey(survey_id: "550e8400-e29b-41d4-a716-446655440000") {
    nomor
    pertanyaan
    tipe
  }
}

# Find questions by type
query {
  findQuestionsByTipe(tipe: "likert") {
    pertanyaan
    survey {
      judul
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create survey question
mutation {
  createSurveyQuestion(
    createSurveyQuestionInput: {
      survey_id: "550e8400-e29b-41d4-a716-446655440000"
      nomor: 1
      pertanyaan: "Seberapa penting kemampuan programming bagi lulusan?"
      tipe: "likert"
    }
  ) {
    id
    nomor
    pertanyaan
  }
}

# Update survey question
mutation {
  updateSurveyQuestion(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateSurveyQuestionInput: {
      pertanyaan: "Seberapa penting kemampuan coding bagi lulusan IT?"
    }
  ) {
    id
    pertanyaan
  }
}

# Remove survey question
mutation {
  removeSurveyQuestion(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Survey`](src/survey/entities/survey.entity.ts)
- **One-to-Many** dengan [`SurveyResponse`](src/survey-response/entities/survey-response.entity.ts)

---

### 11. Survey Response Module

**Purpose**: Menyimpan jawaban stakeholder terhadap pertanyaan survey.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik response |
| `survey_id` | UUID (FK) | Referensi ke survey |
| `question_id` | UUID (FK) | Referensi ke pertanyaan |
| `stakeholder_id` | UUID (FK) | Referensi ke stakeholder |
| `ringkasan` | String | Ringkasan jawaban |
| `detail_json` | JSONB | Data jawaban terstruktur |
| `weight` | Float | Bobot suara stakeholder |
| `created_at` | DateTime | Timestamp pembuatan |

#### GraphQL Queries

```graphql
# Get all survey responses
query {
  surveyResponse {
    id
    ringkasan
    weight
    survey {
      judul
    }
    stakeholder {
      nama
      tipe
    }
    question {
      pertanyaan
    }
  }
}

# Find response by ID
query {
  findSurveyResponseById(id: "550e8400-e29b-41d4-a716-446655440000") {
    ringkasan
    detail_json
    weight
  }
}

# Find responses by survey
query {
  findResponsesBySurvey(survey_id: "550e8400-e29b-41d4-a716-446655440000") {
    stakeholder {
      nama
    }
    ringkasan
    weight
  }
}

# Find responses by stakeholder
query {
  findResponsesByStakeholder(stakeholder_id: "550e8400-e29b-41d4-a716-446655440000") {
    survey {
      judul
    }
    question {
      pertanyaan
    }
    ringkasan
  }
}
```

#### GraphQL Mutations

```graphql
# Create survey response
mutation {
  createSurveyResponse(
    createSurveyResponseInput: {
      survey_id: "550e8400-e29b-41d4-a716-446655440000"
      question_id: "550e8400-e29b-41d4-a716-446655440001"
      stakeholder_id: "550e8400-e29b-41d4-a716-446655440002"
      ringkasan: "Sangat penting untuk industri IT modern"
      detail_json: "{\"rating\": 5, \"skills\": [\"Python\", \"JavaScript\"]}"
      weight: 1.5
    }
  ) {
    id
    ringkasan
    weight
  }
}

# Update survey response
mutation {
  updateSurveyResponse(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateSurveyResponseInput: {
      weight: 2.0
      detail_json: "{\"rating\": 5, \"skills\": [\"Python\", \"JavaScript\", \"React\"]}"
    }
  ) {
    id
    weight
    detail_json
  }
}

# Remove survey response
mutation {
  removeSurveyResponse(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Survey`](src/survey/entities/survey.entity.ts)
- **Many-to-One** dengan [`SurveyQuestion`](src/survey-question/entities/survey-question.entity.ts)
- **Many-to-One** dengan [`Stakeholder`](src/stakeholder/entities/stakeholder.entity.ts)

---

## 🗄️ Database Schema

### PostgreSQL Tables

```sql
-- Enum Types
CREATE TYPE jenjang_type AS ENUM ('D3','S1','S2','S3');
CREATE TYPE cpl_domain AS ENUM ('Sikap','Pengetahuan','Keterampilan Umum','Keterampilan Khusus');
CREATE TYPE mk_jenis AS ENUM ('WAJIB','PILIHAN');
CREATE TYPE bloom_level AS ENUM ('MENGINGAT','MEMAHAMI','MENERAPKAN','MENGANALISIS','MENGEVALUASI','MENCIPTA');
CREATE TYPE stakeholder_type AS ENUM ('PENGGUNA_LULUSAN','ALUMNI','INDUSTRI','ASOSIASI');

-- Tables structure defined in sql/05_obe_curriculum.sql
```

### MongoDB Collections

- `logs`: Application logs
- `sessions`: User sessions

### Redis Keys

- `cache:fakultas:*`: Fakultas data cache
- `cache:prodi:*`: Prodi data cache
- `session:*`: User session data

---

## 🔌 API Endpoints

### GraphQL Endpoint

- **URL**: `http://localhost:3000/graphql`
- **Playground**: Available in development mode

### REST Endpoints

```
GET  /health          - Health check
GET  /metrics         - Prometheus metrics
GET  /api/v1/schema   - GraphQL schema
```

---

## 🔐 Authentication & Authorization

**Status**: Planned for future implementation

### Planned Features

- JWT-based authentication
- Role-based access control (RBAC)
- OAuth2 integration
- API key management

### Planned Roles

- `admin`: Full system access
- `kaprodi`: Program-specific access
- `dosen`: Course-specific access
- `mahasiswa`: Read-only access

---

## 💻 Development Guide

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Setup Steps

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd kurikulum-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start services**
   ```bash
   ./scripts/db.sh start dev
   ```

4. **Run application**
   ```bash
   npm run start:dev
   ```

5. **Access services**
   - GraphQL: http://localhost:3000/graphql
   - pgAdmin: http://localhost:8080
   - Mongo Express: http://localhost:8081

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test// filepath: /workspaces/kurikulum-backend/docs.md
# 📚 Kurikulum Backend - Complete Project Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Module Documentation](#module-documentation)
   - [Fakultas Module](#fakultas-module)
   - [Prodi Module](#prodi-module)
   - [Profil Lulusan Module](#profil-lulusan-module)
   - [CPL Module](#cpl-module)
   - [Mata Kuliah Module](#mata-kuliah-module)
   - [CPMK Module](#cpmk-module)
   - [CPMK-CPL Module](#cpmk-cpl-module)
   - [Stakeholder Module](#stakeholder-module)
   - [Survey Module](#survey-module)
   - [Survey Question Module](#survey-question-module)
   - [Survey Response Module](#survey-response-module)
4. [Database Schema](#database-schema)
5. [API Endpoints](#api-endpoints)
6. [Authentication & Authorization](#authentication--authorization)
7. [Development Guide](#development-guide)
8. [Deployment Guide](#deployment-guide)

---

## 🎯 Project Overview

**Kurikulum Backend** adalah sistem backend komprehensif untuk mengelola data kurikulum berbasis OBE (Outcome-Based Education) di perguruan tinggi Indonesia. Sistem ini dibangun menggunakan NestJS, GraphQL, TypeORM, dan mendukung multiple database.

### Key Features

- **OBE Curriculum Management**: Pengelolaan CPL, CPMK, dan mapping dengan Bloom's taxonomy
- **Academic Structure**: Manajemen fakultas, program studi, dan profil lulusan
- **Survey System**: Sistem survey stakeholder untuk evaluasi kurikulum
- **Multi-Database Support**: PostgreSQL (data utama), MongoDB (logs), Redis (cache)
- **GraphQL API**: API modern dengan dokumentasi otomatis

### Technology Stack

- **Framework**: NestJS 11 with TypeScript
- **API**: GraphQL (Apollo Server)
- **Database**: PostgreSQL 17, MongoDB 7.0, Redis 7.4
- **ORM**: TypeORM
- **Container**: Docker & Docker Compose
- **Testing**: Jest

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   GraphQL API   │────▶│   NestJS Core   │────▶│    TypeORM      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                          │
                               ▼                          ▼
                        ┌─────────────┐          ┌─────────────────┐
                        │   Services  │          │   PostgreSQL    │
                        └─────────────┘          └─────────────────┘
                               │                          │
                               ▼                          ▼
                        ┌─────────────┐          ┌─────────────────┐
                        │  Resolvers  │          │    MongoDB      │
                        └─────────────┘          └─────────────────┘
                                                         │
                                                         ▼
                                                 ┌─────────────────┐
                                                 │     Redis       │
                                                 └─────────────────┘
```

### Module Structure

```
src/
├── app.module.ts              # Root module
├── database/                  # Database configuration
├── fakultas/                  # Faculty module
├── prodi/                     # Study program module
├── profil-lulusan/           # Graduate profile module
├── cpl/                      # Graduate learning outcomes module
├── mata-kuliah/              # Course module
├── cpmk/                     # Course learning outcomes module
├── cpmk-cpl/                 # CPMK-CPL mapping module
├── stakeholder/              # Stakeholder module
├── survey/                   # Survey module
├── survey-question/          # Survey question module
└── survey-response/          # Survey response module
```

---

## 📦 Module Documentation

### 1. Fakultas Module

**Purpose**: Mengelola data fakultas/schools dalam universitas.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `kode` | String (PK) | Kode unik fakultas (e.g., "01") |
| `nama` | String | Nama fakultas |
| `alias` | String | Singkatan fakultas |
| `program` | String | Jenis program |
| `jenjang` | String | Jenjang pendidikan |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### GraphQL Queries

```graphql
# Get all fakultas
query {
  fakultas {
    kode
    nama
    alias
    program
    jenjang
    prodi {
      kode
      nama
    }
  }
}

# Find fakultas by kode
query {
  findFakultasByKode(kode: "01") {
    kode
    nama
    alias
    prodi {
      kode
      nama
      gelar_pendek
    }
  }
}
```

#### GraphQL Mutations

**Note**: Fakultas adalah read-only resource. Tidak ada mutations yang tersedia.

#### Relations

- **One-to-Many** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)

---

### 2. Prodi Module

**Purpose**: Mengelola program studi dalam fakultas dengan informasi gelar.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik program studi |
| `kode` | String | Kode program studi |
| `nama` | String | Nama program studi (Indonesia) |
| `nama_eng` | String | Nama program studi (English) |
| `fakultas_kode` | String (FK) | Referensi ke fakultas |
| `gelar_pendek` | String | Gelar singkat (e.g., "S.Kom") |
| `gelar` | String | Gelar lengkap |
| `gelar_eng` | String | Gelar dalam bahasa Inggris |
| `jenjang` | Enum | Jenjang pendidikan (D3/S1/S2/S3) |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### GraphQL Queries

```graphql
# Get all prodi
query {
  prodi {
    id
    kode
    nama
    nama_eng
    gelar_pendek
    gelar
    fakultas {
      nama
      alias
    }
  }
}

# Find prodi by kode
query {
  findProdiByKode(kode: "55201") {
    id
    nama
    fakultas {
      nama
    }
  }
}

# Get prodi by fakultas
query {
  prodiByFakultas(fakultas_kode: "01") {
    kode
    nama
    gelar_pendek
  }
}
```

#### GraphQL Mutations

**Note**: Prodi adalah read-only resource. Tidak ada mutations yang tersedia.

#### Relations

- **Many-to-One** dengan [`Fakultas`](src/fakultas/entities/fakultas.entity.ts)
- **One-to-Many** dengan [`CPL`](src/cpl/entities/cpl.entity.ts)
- **One-to-Many** dengan [`MataKuliah`](src/mata-kuliah/entities/mata-kuliah.entity.ts)
- **One-to-Many** dengan [`ProfilLulusan`](src/profil-lulusan/entities/profil-lulusan.entity.ts)

---

### 3. Profil Lulusan Module

**Purpose**: Mendefinisikan profil lulusan dan jalur karir untuk program studi.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik profil |
| `nama` | String | Nama profil lulusan |
| `deskripsi` | String | Deskripsi detail profil |
| `prodi_id` | UUID (FK) | Referensi ke program studi |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### GraphQL Queries

```graphql
# Get all profil lulusan
query {
  allProfilLulusan {
    id
    nama
    deskripsi
    prodi {
      nama
      fakultas {
        nama
      }
    }
  }
}

# Find profil by ID
query {
  profilLulusan(id: "550e8400-e29b-41d4-a716-446655440000") {
    nama
    deskripsi
    prodi {
      nama
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create profil lulusan
mutation {
  createProfilLulusan(
    createProfilLulusanInput: {
      nama: "Software Engineer"
      deskripsi: "Profesional yang mampu merancang dan mengembangkan perangkat lunak"
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    nama
    deskripsi
  }
}

# Update profil lulusan
mutation {
  updateProfilLulusan(
    updateProfilLulusanInput: {
      id: "550e8400-e29b-41d4-a716-446655440000"
      nama: "Senior Software Engineer"
      deskripsi: "Profesional senior dalam pengembangan software"
    }
  ) {
    id
    nama
    deskripsi
  }
}

# Remove profil lulusan
mutation {
  removeProfilLulusan(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)

---

### 4. CPL Module

**Purpose**: Mengelola Capaian Pembelajaran Lulusan (Graduate Learning Outcomes) dengan klasifikasi domain.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik CPL |
| `kode` | String | Kode CPL (e.g., "CPL-01") |
| `deskripsi` | String | Deskripsi CPL |
| `domain` | Enum | Domain pembelajaran |
| `prodi_id` | UUID (FK) | Referensi ke program studi |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### Domain Types

- `SIKAP`: Domain sikap dan tata nilai
- `PENGETAHUAN`: Domain pengetahuan
- `KETERAMPILAN_UMUM`: Domain keterampilan umum
- `KETERAMPILAN_KHUSUS`: Domain keterampilan khusus

#### GraphQL Queries

```graphql
# Get all CPL
query {
  cpl {
    id
    kode
    deskripsi
    domain
    prodi {
      nama
      fakultas {
        nama
      }
    }
  }
}

# Find CPL by ID
query {
  findCplById(id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    domain
  }
}

# Find CPL by prodi
query {
  findCplByProdi(prodi_id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    domain
  }
}

# Find CPL by domain
query {
  findCplByDomain(domain: PENGETAHUAN) {
    kode
    deskripsi
    prodi {
      nama
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create CPL
mutation {
  createCpl(
    createCplInput: {
      kode: "CPL-01"
      deskripsi: "Mampu menerapkan pemikiran logis, kritis, sistematis, dan inovatif"
      domain: KETERAMPILAN_UMUM
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    kode
    deskripsi
    domain
  }
}

# Update CPL
mutation {
  updateCpl(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateCplInput: {
      deskripsi: "Mampu menerapkan pemikiran logis dan kritis dalam pengembangan software"
    }
  ) {
    id
    kode
    deskripsi
  }
}

# Remove CPL
mutation {
  removeCpl(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)
- **Many-to-Many** dengan [`CPMK`](src/cpmk/entities/cpmk.entity.ts) melalui [`CpmkCpl`](src/cpmk-cpl/entities/cpmk-cpl.entity.ts)

---

### 5. Mata Kuliah Module

**Purpose**: Mengelola mata kuliah/courses dengan informasi SKS dan semester.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik mata kuliah |
| `kode` | String | Kode mata kuliah (e.g., "IF101") |
| `nama` | String | Nama mata kuliah |
| `sks` | Integer | Jumlah SKS (1-10) |
| `semester` | Integer | Semester (1-14) |
| `jenis` | Enum | Jenis mata kuliah |
| `prodi_id` | UUID (FK) | Referensi ke program studi |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### Jenis Mata Kuliah

- `WAJIB`: Mata kuliah wajib
- `PILIHAN`: Mata kuliah pilihan

#### GraphQL Queries

```graphql
# Get all mata kuliah
query {
  mataKuliah {
    id
    kode
    nama
    sks
    semester
    jenis
    prodi {
      nama
    }
  }
}

# Find mata kuliah by ID
query {
  findMataKuliahById(id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    nama
    sks
  }
}

# Find mata kuliah by prodi
query {
  findMataKuliahByProdi(prodi_id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    nama
    semester
    jenis
  }
}

# Find mata kuliah by semester
query {
  findMataKuliahBySemester(semester: 3) {
    kode
    nama
    sks
    jenis
  }
}

# Find mata kuliah by jenis
query {
  findMataKuliahByJenis(jenis: WAJIB) {
    kode
    nama
    semester
  }
}
```

#### GraphQL Mutations

```graphql
# Create mata kuliah
mutation {
  createMataKuliah(
    createMataKuliahInput: {
      kode: "IF101"
      nama: "Algoritma dan Pemrograman"
      sks: 3
      semester: 1
      jenis: WAJIB
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    kode
    nama
    sks
  }
}

# Update mata kuliah
mutation {
  updateMataKuliah(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateMataKuliahInput: {
      nama: "Algoritma dan Pemrograman Lanjut"
      sks: 4
    }
  ) {
    id
    nama
    sks
  }
}

# Remove mata kuliah
mutation {
  removeMataKuliah(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)
- **One-to-Many** dengan [`CPMK`](src/cpmk/entities/cpmk.entity.ts)

---

### 6. CPMK Module

**Purpose**: Mengelola Capaian Pembelajaran Mata Kuliah (Course Learning Outcomes) dengan klasifikasi Bloom's taxonomy.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik CPMK |
| `kode` | String | Kode CPMK (e.g., "CPMK-1") |
| `deskripsi` | String | Deskripsi CPMK |
| `level` | Enum | Level Bloom's taxonomy |
| `mata_kuliah_id` | UUID (FK) | Referensi ke mata kuliah |
| `created_at` | DateTime | Timestamp pembuatan |
| `updated_at` | DateTime | Timestamp update |

#### Bloom's Taxonomy Levels

- `MENGINGAT`: Kemampuan mengingat informasi
- `MEMAHAMI`: Kemampuan memahami makna
- `MENERAPKAN`: Kemampuan menggunakan informasi
- `MENGANALISIS`: Kemampuan memecah informasi
- `MENGEVALUASI`: Kemampuan menilai
- `MENCIPTA`: Kemampuan menciptakan sesuatu baru

#### GraphQL Queries

```graphql
# Get all CPMK
query {
  cpmk {
    id
    kode
    deskripsi
    level
    mataKuliah {
      kode
      nama
    }
  }
}

# Find CPMK by ID
query {
  findCpmkById(id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    level
  }
}

# Find CPMK by mata kuliah
query {
  findCpmkByMataKuliah(mata_kuliah_id: "550e8400-e29b-41d4-a716-446655440000") {
    kode
    deskripsi
    level
  }
}

# Find CPMK by Bloom level
query {
  findCpmkByBloomLevel(bloomLevel: MEMAHAMI) {
    kode
    deskripsi
    mataKuliah {
      nama
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create CPMK
mutation {
  createCpmk(
    createCpmkInput: {
      kode: "CPMK-1"
      deskripsi: "Mahasiswa mampu memahami konsep dasar algoritma"
      level: MEMAHAMI
      mata_kuliah_id: "550e8400-e29b-41d4-a716-446655440000"
    }
  ) {
    id
    kode
    deskripsi
    level
  }
}

# Update CPMK
mutation {
  updateCpmk(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateCpmkInput: {
      deskripsi: "Mahasiswa mampu menerapkan konsep algoritma dalam pemrograman"
      level: MENERAPKAN
    }
  ) {
    id
    deskripsi
    level
  }
}

# Remove CPMK
mutation {
  removeCpmk(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`MataKuliah`](src/mata-kuliah/entities/mata-kuliah.entity.ts)
- **Many-to-Many** dengan [`CPL`](src/cpl/entities/cpl.entity.ts) melalui [`CpmkCpl`](src/cpmk-cpl/entities/cpmk-cpl.entity.ts)

---

### 7. CPMK-CPL Module

**Purpose**: Mengelola mapping antara CPMK dan CPL (Many-to-Many relationship).

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik mapping |
| `cpmk_id` | UUID (FK) | Referensi ke CPMK |
| `cpl_id` | UUID (FK) | Referensi ke CPL |

#### GraphQL Queries

```graphql
# Get all CPMK-CPL mappings
query {
  cpmkCpl {
    id
    cpmk {
      kode
      deskripsi
      mataKuliah {
        nama
      }
    }
    cpl {
      kode
      deskripsi
      domain
    }
  }
}

# Find mapping by ID
query {
  findCpmkCplById(id: "550e8400-e29b-41d4-a716-446655440000") {
    cpmk {
      kode
    }
    cpl {
      kode
    }
  }
}

# Find mappings by CPMK
query {
  findCpmkCplByCpmk(cpmk_id: "550e8400-e29b-41d4-a716-446655440000") {
    cpl {
      kode
      deskripsi
      domain
    }
  }
}

# Find mappings by CPL
query {
  findCpmkCplByCpl(cpl_id: "550e8400-e29b-41d4-a716-446655440000") {
    cpmk {
      kode
      deskripsi
      mataKuliah {
        nama
      }
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create CPMK-CPL mapping
mutation {
  createCpmkCpl(
    createCpmkCplInput: {
      cpmk_id: "550e8400-e29b-41d4-a716-446655440000"
      cpl_id: "550e8400-e29b-41d4-a716-446655440001"
    }
  ) {
    id
    cpmk {
      kode
    }
    cpl {
      kode
    }
  }
}

# Update CPMK-CPL mapping
mutation {
  updateCpmkCpl(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateCpmkCplInput: {
      cpmk_id: "550e8400-e29b-41d4-a716-446655440002"
    }
  ) {
    id
    cpmk {
      kode
    }
  }
}

# Remove mapping by ID
mutation {
  removeCpmkCpl(id: "550e8400-e29b-41d4-a716-446655440000")
}

# Remove mapping by CPMK and CPL IDs
mutation {
  removeCpmkCplByIds(
    cpmk_id: "550e8400-e29b-41d4-a716-446655440000"
    cpl_id: "550e8400-e29b-41d4-a716-446655440001"
  )
}
```

#### Relations

- **Many-to-One** dengan [`CPMK`](src/cpmk/entities/cpmk.entity.ts)
- **Many-to-One** dengan [`CPL`](src/cpl/entities/cpl.entity.ts)

---

### 8. Stakeholder Module

**Purpose**: Mengelola data stakeholder yang berpartisipasi dalam survey evaluasi kurikulum.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik stakeholder |
| `nama` | String | Nama stakeholder |
| `tipe` | Enum | Tipe stakeholder |
| `organisasi` | String | Nama organisasi/perusahaan |
| `kontak` | String | Informasi kontak |
| `created_at` | DateTime | Timestamp pembuatan |

#### Stakeholder Types

- `PENGGUNA_LULUSAN`: Pengguna lulusan/employer
- `ALUMNI`: Alumni program studi
- `INDUSTRI`: Perwakilan industri
- `ASOSIASI`: Asosiasi profesi

#### GraphQL Queries

```graphql
# Get all stakeholders
query {
  stakeholder {
    id
    nama
    tipe
    organisasi
    kontak
  }
}

# Find stakeholder by ID
query {
  findStakeholderById(id: "550e8400-e29b-41d4-a716-446655440000") {
    nama
    tipe
    organisasi
  }
}

# Find stakeholders by type
query {
  findStakeholderByTipe(tipe: INDUSTRI) {
    nama
    organisasi
    kontak
  }
}
```

#### GraphQL Mutations

```graphql
# Create stakeholder
mutation {
  createStakeholder(
    createStakeholderInput: {
      nama: "PT Tech Innovate"
      tipe: PENGGUNA_LULUSAN
      organisasi: "Tech Company"
      kontak: "hr@techinnovate.com"
    }
  ) {
    id
    nama
    tipe
  }
}

# Update stakeholder
mutation {
  updateStakeholder(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateStakeholderInput: {
      kontak: "newemail@techinnovate.com"
    }
  ) {
    id
    nama
    kontak
  }
}

# Remove stakeholder
mutation {
  removeStakeholder(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **One-to-Many** dengan [`SurveyResponse`](src/survey-response/entities/survey-response.entity.ts)

---

### 9. Survey Module

**Purpose**: Mengelola instance survey untuk mengumpulkan feedback stakeholder.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik survey |
| `prodi_id` | UUID (FK) | Program studi yang melakukan survey |
| `judul` | String | Judul survey |
| `metode` | String | Metode pengumpulan data |
| `periode` | DateRange | Periode pelaksanaan survey |
| `catatan` | String | Catatan tambahan |
| `created_at` | DateTime | Timestamp pembuatan |

#### GraphQL Queries

```graphql
# Get all surveys
query {
  survey {
    id
    judul
    metode
    periode
    catatan
    prodi {
      nama
    }
  }
}

# Find survey by ID
query {
  findSurveyById(id: "550e8400-e29b-41d4-a716-446655440000") {
    judul
    metode
    prodi {
      nama
    }
  }
}

# Find surveys by prodi
query {
  findSurveyByProdi(prodi_id: "550e8400-e29b-41d4-a716-446655440000") {
    judul
    metode
    periode
  }
}

# Find surveys by method
query {
  findSurveyByMetode(metode: "FGD") {
    judul
    prodi {
      nama
    }
    periode
  }
}
```

#### GraphQL Mutations

```graphql
# Create survey
mutation {
  createSurvey(
    createSurveyInput: {
      prodi_id: "550e8400-e29b-41d4-a716-446655440000"
      judul: "Survey Kompetensi Lulusan 2025"
      metode: "FGD"
      periode: "[2025-01-01,2025-03-31)"
      catatan: "Focus group discussion dengan industri IT"
    }
  ) {
    id
    judul
    metode
  }
}

# Update survey
mutation {
  updateSurvey(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateSurveyInput: {
      periode: "[2025-02-01,2025-04-30)"
      catatan: "Diperpanjang hingga April"
    }
  ) {
    id
    periode
    catatan
  }
}

# Remove survey
mutation {
  removeSurvey(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Prodi`](src/prodi/entities/prodi.entity.ts)
- **One-to-Many** dengan [`SurveyQuestion`](src/survey-question/entities/survey-question.entity.ts)
- **One-to-Many** dengan [`SurveyResponse`](src/survey-response/entities/survey-response.entity.ts)

---

### 10. Survey Question Module

**Purpose**: Mengelola pertanyaan-pertanyaan dalam survey.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik pertanyaan |
| `survey_id` | UUID (FK) | Referensi ke survey |
| `nomor` | Integer | Nomor urut pertanyaan |
| `pertanyaan` | String | Teks pertanyaan |
| `tipe` | String | Tipe jawaban yang diharapkan |
| `created_at` | DateTime | Timestamp pembuatan |

#### GraphQL Queries

```graphql
# Get all survey questions
query {
  surveyQuestion {
    id
    nomor
    pertanyaan
    tipe
    survey {
      judul
    }
  }
}

# Find question by ID
query {
  findSurveyQuestionById(id: "550e8400-e29b-41d4-a716-446655440000") {
    pertanyaan
    tipe
  }
}

# Find questions by survey
query {
  findQuestionsBySurvey(survey_id: "550e8400-e29b-41d4-a716-446655440000") {
    nomor
    pertanyaan
    tipe
  }
}

# Find questions by type
query {
  findQuestionsByTipe(tipe: "likert") {
    pertanyaan
    survey {
      judul
    }
  }
}
```

#### GraphQL Mutations

```graphql
# Create survey question
mutation {
  createSurveyQuestion(
    createSurveyQuestionInput: {
      survey_id: "550e8400-e29b-41d4-a716-446655440000"
      nomor: 1
      pertanyaan: "Seberapa penting kemampuan programming bagi lulusan?"
      tipe: "likert"
    }
  ) {
    id
    nomor
    pertanyaan
  }
}

# Update survey question
mutation {
  updateSurveyQuestion(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateSurveyQuestionInput: {
      pertanyaan: "Seberapa penting kemampuan coding bagi lulusan IT?"
    }
  ) {
    id
    pertanyaan
  }
}

# Remove survey question
mutation {
  removeSurveyQuestion(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Survey`](src/survey/entities/survey.entity.ts)
- **One-to-Many** dengan [`SurveyResponse`](src/survey-response/entities/survey-response.entity.ts)

---

### 11. Survey Response Module

**Purpose**: Menyimpan jawaban stakeholder terhadap pertanyaan survey.

#### Entity Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | UUID (PK) | ID unik response |
| `survey_id` | UUID (FK) | Referensi ke survey |
| `question_id` | UUID (FK) | Referensi ke pertanyaan |
| `stakeholder_id` | UUID (FK) | Referensi ke stakeholder |
| `ringkasan` | String | Ringkasan jawaban |
| `detail_json` | JSONB | Data jawaban terstruktur |
| `weight` | Float | Bobot suara stakeholder |
| `created_at` | DateTime | Timestamp pembuatan |

#### GraphQL Queries

```graphql
# Get all survey responses
query {
  surveyResponse {
    id
    ringkasan
    weight
    survey {
      judul
    }
    stakeholder {
      nama
      tipe
    }
    question {
      pertanyaan
    }
  }
}

# Find response by ID
query {
  findSurveyResponseById(id: "550e8400-e29b-41d4-a716-446655440000") {
    ringkasan
    detail_json
    weight
  }
}

# Find responses by survey
query {
  findResponsesBySurvey(survey_id: "550e8400-e29b-41d4-a716-446655440000") {
    stakeholder {
      nama
    }
    ringkasan
    weight
  }
}

# Find responses by stakeholder
query {
  findResponsesByStakeholder(stakeholder_id: "550e8400-e29b-41d4-a716-446655440000") {
    survey {
      judul
    }
    question {
      pertanyaan
    }
    ringkasan
  }
}
```

#### GraphQL Mutations

```graphql
# Create survey response
mutation {
  createSurveyResponse(
    createSurveyResponseInput: {
      survey_id: "550e8400-e29b-41d4-a716-446655440000"
      question_id: "550e8400-e29b-41d4-a716-446655440001"
      stakeholder_id: "550e8400-e29b-41d4-a716-446655440002"
      ringkasan: "Sangat penting untuk industri IT modern"
      detail_json: "{\"rating\": 5, \"skills\": [\"Python\", \"JavaScript\"]}"
      weight: 1.5
    }
  ) {
    id
    ringkasan
    weight
  }
}

# Update survey response
mutation {
  updateSurveyResponse(
    id: "550e8400-e29b-41d4-a716-446655440000"
    updateSurveyResponseInput: {
      weight: 2.0
      detail_json: "{\"rating\": 5, \"skills\": [\"Python\", \"JavaScript\", \"React\"]}"
    }
  ) {
    id
    weight
    detail_json
  }
}

# Remove survey response
mutation {
  removeSurveyResponse(id: "550e8400-e29b-41d4-a716-446655440000")
}
```

#### Relations

- **Many-to-One** dengan [`Survey`](src/survey/entities/survey.entity.ts)
- **Many-to-One** dengan [`SurveyQuestion`](src/survey-question/entities/survey-question.entity.ts)
- **Many-to-One** dengan [`Stakeholder`](src/stakeholder/entities/stakeholder.entity.ts)

---
