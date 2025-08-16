import { gql } from '@apollo/client';

// Profil Lulusan Mutations
export const CREATE_PROFIL_LULUSAN = gql`
  mutation CreateProfilLulusan($createProfilLulusanInput: CreateProfilLulusanInput!) {
    createProfilLulusan(createProfilLulusanInput: $createProfilLulusanInput) {
      id
      nama
      deskripsi
    }
  }
`;

export const UPDATE_PROFIL_LULUSAN = gql`
  mutation UpdateProfilLulusan($updateProfilLulusanInput: UpdateProfilLulusanInput!) {
    updateProfilLulusan(updateProfilLulusanInput: $updateProfilLulusanInput) {
      id
      nama
      deskripsi
    }
  }
`;

export const REMOVE_PROFIL_LULUSAN = gql`
  mutation RemoveProfilLulusan($id: String!) {
    removeProfilLulusan(id: $id)
  }
`;

// CPL Mutations
export const CREATE_CPL = gql`
  mutation CreateCpl($createCplInput: CreateCplInput!) {
    createCpl(createCplInput: $createCplInput) {
      id
      kode
      deskripsi
      domain
    }
  }
`;

export const UPDATE_CPL = gql`
  mutation UpdateCpl($id: String!, $updateCplInput: UpdateCplInput!) {
    updateCpl(id: $id, updateCplInput: $updateCplInput) {
      id
      kode
      deskripsi
    }
  }
`;

export const REMOVE_CPL = gql`
  mutation RemoveCpl($id: String!) {
    removeCpl(id: $id)
  }
`;

// Mata Kuliah Mutations
export const CREATE_MATA_KULIAH = gql`
  mutation CreateMataKuliah($createMataKuliahInput: CreateMataKuliahInput!) {
    createMataKuliah(createMataKuliahInput: $createMataKuliahInput) {
      id
      kode
      nama
      sks
    }
  }
`;

export const UPDATE_MATA_KULIAH = gql`
  mutation UpdateMataKuliah($id: String!, $updateMataKuliahInput: UpdateMataKuliahInput!) {
    updateMataKuliah(id: $id, updateMataKuliahInput: $updateMataKuliahInput) {
      id
      nama
      sks
    }
  }
`;

export const REMOVE_MATA_KULIAH = gql`
  mutation RemoveMataKuliah($id: String!) {
    removeMataKuliah(id: $id)
  }
`;

// CPMK Mutations
export const CREATE_CPMK = gql`
  mutation CreateCpmk($createCpmkInput: CreateCpmkInput!) {
    createCpmk(createCpmkInput: $createCpmkInput) {
      id
      kode
      deskripsi
      bloom_level
    }
  }
`;

export const UPDATE_CPMK = gql`
  mutation UpdateCpmk($id: String!, $updateCpmkInput: UpdateCpmkInput!) {
    updateCpmk(id: $id, updateCpmkInput: $updateCpmkInput) {
      id
      deskripsi
      bloom_level
    }
  }
`;

export const REMOVE_CPMK = gql`
  mutation RemoveCpmk($id: String!) {
    removeCpmk(id: $id)
  }
`;

// CPMK-CPL Mutations
export const CREATE_CPMK_CPL = gql`
  mutation CreateCpmkCpl($createCpmkCplInput: CreateCpmkCplInput!) {
    createCpmkCpl(createCpmkCplInput: $createCpmkCplInput) {
      id
      cpmk {
        kode
      }
      cpl {
        kode
      }
    }
  }
`;

export const UPDATE_CPMK_CPL = gql`
  mutation UpdateCpmkCpl($id: String!, $updateCpmkCplInput: UpdateCpmkCplInput!) {
    updateCpmkCpl(id: $id, updateCpmkCplInput: $updateCpmkCplInput) {
      id
      cpmk {
        kode
      }
    }
  }
`;

export const REMOVE_CPMK_CPL = gql`
  mutation RemoveCpmkCpl($id: String!) {
    removeCpmkCpl(id: $id)
  }
`;

export const REMOVE_CPMK_CPL_BY_IDS = gql`
  mutation RemoveCpmkCplByIds($cpmk_id: String!, $cpl_id: String!) {
    removeCpmkCplByIds(cpmk_id: $cpmk_id, cpl_id: $cpl_id)
  }
`;

// Stakeholder Mutations
export const CREATE_STAKEHOLDER = gql`
  mutation CreateStakeholder($createStakeholderInput: CreateStakeholderInput!) {
    createStakeholder(createStakeholderInput: $createStakeholderInput) {
      id
      nama
      tipe
    }
  }
`;

export const UPDATE_STAKEHOLDER = gql`
  mutation UpdateStakeholder($id: String!, $updateStakeholderInput: UpdateStakeholderInput!) {
    updateStakeholder(id: $id, updateStakeholderInput: $updateStakeholderInput) {
      id
      nama
      kontak
    }
  }
`;

export const REMOVE_STAKEHOLDER = gql`
  mutation RemoveStakeholder($id: String!) {
    removeStakeholder(id: $id)
  }
`;

// Survey Mutations
export const CREATE_SURVEY = gql`
  mutation CreateSurvey($createSurveyInput: CreateSurveyInput!) {
    createSurvey(createSurveyInput: $createSurveyInput) {
      id
      judul
      metode
    }
  }
`;

export const UPDATE_SURVEY = gql`
  mutation UpdateSurvey($id: String!, $updateSurveyInput: UpdateSurveyInput!) {
    updateSurvey(id: $id, updateSurveyInput: $updateSurveyInput) {
      id
      periode
      catatan
    }
  }
`;

export const REMOVE_SURVEY = gql`
  mutation RemoveSurvey($id: String!) {
    removeSurvey(id: $id)
  }
`;

// Survey Question Mutations
export const CREATE_SURVEY_QUESTION = gql`
  mutation CreateSurveyQuestion($createSurveyQuestionInput: CreateSurveyQuestionInput!) {
    createSurveyQuestion(createSurveyQuestionInput: $createSurveyQuestionInput) {
      id
      nomor
      pertanyaan
    }
  }
`;

export const UPDATE_SURVEY_QUESTION = gql`
  mutation UpdateSurveyQuestion($id: String!, $updateSurveyQuestionInput: UpdateSurveyQuestionInput!) {
    updateSurveyQuestion(id: $id, updateSurveyQuestionInput: $updateSurveyQuestionInput) {
      id
      pertanyaan
    }
  }
`;

export const REMOVE_SURVEY_QUESTION = gql`
  mutation RemoveSurveyQuestion($id: String!) {
    removeSurveyQuestion(id: $id)
  }
`;

// Survey Response Mutations
export const CREATE_SURVEY_RESPONSE = gql`
  mutation CreateSurveyResponse($createSurveyResponseInput: CreateSurveyResponseInput!) {
    createSurveyResponse(createSurveyResponseInput: $createSurveyResponseInput) {
      id
      ringkasan
      weight
    }
  }
`;

export const UPDATE_SURVEY_RESPONSE = gql`
  mutation UpdateSurveyResponse($id: String!, $updateSurveyResponseInput: UpdateSurveyResponseInput!) {
    updateSurveyResponse(id: $id, updateSurveyResponseInput: $updateSurveyResponseInput) {
      id
      weight
      detail_json
    }
  }
`;

export const REMOVE_SURVEY_RESPONSE = gql`
  mutation RemoveSurveyResponse($id: String!) {
    removeSurveyResponse(id: $id)
  }
`;
