import { gql } from '@apollo/client';

// Fakultas Queries
export const GET_ALL_FAKULTAS = gql`
  query AllFakultas {
    allFakultas {
      id
      kode
      nama
      alias
      program
      jenjang
    }
  }
`;

export const FIND_FAKULTAS_BY_KODE = gql`
  query FindFakultasByKode($kode: String!) {
    findFakultasByKode(kode: $kode) {
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
`;

// Prodi Queries
export const GET_ALL_PRODI = gql`
  query GetAllProdi {
    prodi {
      id
      kode
      nama
      nama_eng
      gelar_pendek
      gelar
    }
  }
`;

export const FIND_PRODI_BY_KODE = gql`
  query FindProdiByKode($kode: String!) {
    findProdiByKode(kode: $kode) {
      id
      nama
      fakultas {
        nama
      }
    }
  }
`;

export const GET_PRODI_BY_FAKULTAS = gql`
  query GetProdiByFakultas($fakultas_kode: String!) {
    prodiByFakultas(fakultas_kode: $fakultas_kode) {
      kode
      nama
      gelar_pendek
    }
  }
`;

// Profil Lulusan Queries
export const GET_ALL_PROFIL_LULUSAN = gql`
  query GetAllProfilLulusan {
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
`;

export const GET_PROFIL_LULUSAN = gql`
  query GetProfilLulusan($id: String!) {
    profilLulusan(id: $id) {
      nama
      deskripsi
      prodi {
        nama
      }
    }
  }
`;

// CPL Queries
export const GET_ALL_CPL = gql`
  query AllCpls {
    cpls {
      id
      kode
      deskripsi
      domain
    }
  }
`;

export const FIND_CPL_BY_ID = gql`
  query FindCplById($id: String!) {
    findCplById(id: $id) {
      kode
      deskripsi
      domain
    }
  }
`;

export const FIND_CPL_BY_PRODI = gql`
  query FindCplByProdi($prodi_id: String!) {
    findCplByProdi(prodi_id: $prodi_id) {
      kode
      deskripsi
      domain
    }
  }
`;

export const FIND_CPL_BY_DOMAIN = gql`
  query FindCplByDomain($domain: String!) {
    findCplByDomain(domain: $domain) {
      kode
      deskripsi
      prodi {
        nama
      }
    }
  }
`;

// Mata Kuliah Queries
export const GET_ALL_MATA_KULIAH = gql`
  query AllMataKuliah {
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
`;

export const FIND_MATA_KULIAH_BY_ID = gql`
  query FindMataKuliahById($id: String!) {
    findMataKuliahById(id: $id) {
      kode
      nama
      sks
    }
  }
`;

export const FIND_MATA_KULIAH_BY_PRODI = gql`
  query FindMataKuliahByProdi($prodi_id: String!) {
    findMataKuliahByProdi(prodi_id: $prodi_id) {
      kode
      nama
      semester
      jenis
    }
  }
`;

export const FIND_MATA_KULIAH_BY_SEMESTER = gql`
  query FindMataKuliahBySemester($semester: Int!) {
    findMataKuliahBySemester(semester: $semester) {
      kode
      nama
      sks
      jenis
    }
  }
`;

export const FIND_MATA_KULIAH_BY_JENIS = gql`
  query FindMataKuliahByJenis($jenis: String!) {
    findMataKuliahByJenis(jenis: $jenis) {
      kode
      nama
      semester
    }
  }
`;

// CPMK Queries
export const GET_ALL_CPMK = gql`
  query AllCpmk {
    cpmk {
      id
      kode
      deskripsi
      bloom_level
      mata_kuliah_id
      created_at
      updated_at
    }
  }
`;

export const FIND_CPMK_BY_ID = gql`
  query FindCpmkById($id: String!) {
    findCpmkById(id: $id) {
      kode
      deskripsi
      bloom_level
    }
  }
`;

export const FIND_CPMK_BY_MATA_KULIAH = gql`
  query FindCpmkByMataKuliah($mata_kuliah_id: String!) {
    findCpmkByMataKuliah(mata_kuliah_id: $mata_kuliah_id) {
      kode
      deskripsi
      bloom_level
    }
  }
`;

export const FIND_CPMK_BY_BLOOM_LEVEL = gql`
  query FindCpmkByBloomLevel($bloomLevel: String!) {
    findCpmkByBloomLevel(bloomLevel: $bloomLevel) {
      kode
      deskripsi
      mataKuliah {
        nama
      }
    }
  }
`;

// CPMK-CPL Queries
export const GET_ALL_CPMK_CPL = gql`
  query GetAllCpmkCpl {
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
`;

export const FIND_CPMK_CPL_BY_ID = gql`
  query FindCpmkCplById($id: String!) {
    findCpmkCplById(id: $id) {
      cpmk {
        kode
      }
      cpl {
        kode
      }
    }
  }
`;

export const FIND_CPMK_CPL_BY_CPMK = gql`
  query FindCpmkCplByCpmk($cpmk_id: String!) {
    findCpmkCplByCpmk(cpmk_id: $cpmk_id) {
      cpl {
        kode
        deskripsi
        domain
      }
    }
  }
`;

export const FIND_CPMK_CPL_BY_CPL = gql`
  query FindCpmkCplByCpl($cpl_id: String!) {
    findCpmkCplByCpl(cpl_id: $cpl_id) {
      cpmk {
        kode
        deskripsi
        mataKuliah {
          nama
        }
      }
    }
  }
`;

// Stakeholder Queries
export const GET_ALL_STAKEHOLDER = gql`
  query AllStakeholders {
    stakeholders {
      id
      nama
      tipe
      organisasi
      kontak
    }
  }
`;

export const FIND_STAKEHOLDER_BY_ID = gql`
  query FindStakeholderById($id: String!) {
    findStakeholderById(id: $id) {
      nama
      tipe
      organisasi
    }
  }
`;

export const FIND_STAKEHOLDER_BY_TIPE = gql`
  query FindStakeholderByTipe($tipe: String!) {
    findStakeholderByTipe(tipe: $tipe) {
      nama
      organisasi
      kontak
    }
  }
`;

// Survey Queries
export const GET_ALL_SURVEY = gql`
  query AllSurveys {
    surveys {
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
`;

export const FIND_SURVEY_BY_ID = gql`
  query FindSurveyById($id: String!) {
    findSurveyById(id: $id) {
      judul
      metode
      prodi {
        nama
      }
    }
  }
`;

export const FIND_SURVEY_BY_PRODI = gql`
  query FindSurveyByProdi($prodi_id: String!) {
    findSurveyByProdi(prodi_id: $prodi_id) {
      judul
      metode
      periode
    }
  }
`;

export const FIND_SURVEY_BY_METODE = gql`
  query FindSurveyByMetode($metode: String!) {
    findSurveyByMetode(metode: $metode) {
      judul
      prodi {
        nama
      }
      periode
    }
  }
`;

// Survey Question Queries
export const GET_ALL_SURVEY_QUESTION = gql`
  query AllSurveyQuestions {
    surveyQuestions {
      id
      nomor
      pertanyaan
      tipe
      survey {
        judul
      }
    }
  }
`;

export const FIND_SURVEY_QUESTION_BY_ID = gql`
  query FindSurveyQuestionById($id: String!) {
    findSurveyQuestionById(id: $id) {
      pertanyaan
      tipe
    }
  }
`;

export const FIND_QUESTIONS_BY_SURVEY = gql`
  query FindQuestionsBySurvey($survey_id: String!) {
    findQuestionsBySurvey(survey_id: $survey_id) {
      nomor
      pertanyaan
      tipe
    }
  }
`;

export const FIND_QUESTIONS_BY_TIPE = gql`
  query FindQuestionsByTipe($tipe: String!) {
    findQuestionsByTipe(tipe: $tipe) {
      pertanyaan
      survey {
        judul
      }
    }
  }
`;

// Survey Response Queries
export const GET_ALL_SURVEY_RESPONSE = gql`
  query AllSurveyResponses {
    surveyResponses {
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
`;

export const FIND_SURVEY_RESPONSE_BY_ID = gql`
  query FindSurveyResponseById($id: String!) {
    findSurveyResponseById(id: $id) {
      ringkasan
      detail_json
      weight
    }
  }
`;

export const FIND_RESPONSES_BY_SURVEY = gql`
  query FindResponsesBySurvey($survey_id: String!) {
    findResponsesBySurvey(survey_id: $survey_id) {
      stakeholder {
        nama
      }
      ringkasan
      weight
    }
  }
`;

export const FIND_RESPONSES_BY_STAKEHOLDER = gql`
  query FindResponsesByStakeholder($stakeholder_id: String!) {
    findResponsesByStakeholder(stakeholder_id: $stakeholder_id) {
      survey {
        judul
      }
      question {
        pertanyaan
      }
      ringkasan
    }
  }
`;
