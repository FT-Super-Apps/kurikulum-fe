import { useQuery } from '@apollo/client';
import { useMockData, mockFakultas, mockCpl, mockMataKuliah, mockCpmk, mockProfilLulusan, mockStakeholder, mockSurvey } from './mock-data';

// Custom hook untuk handling fallback ke mock data
export function useQueryWithFallback(query: any, options: any = {}) {
  const { data, loading, error, ...rest } = useQuery(query, {
    ...options,
    errorPolicy: 'all',
  });

  // Jika ada network error atau loading terlalu lama, gunakan mock data
  const shouldUseMock = useMockData || (error && error.networkError);

  if (shouldUseMock) {
    // Return mock data berdasarkan query
    const queryName = query.definitions[0]?.name?.value;

    switch (queryName) {
      case 'GetAllFakultas':
        return {
          data: { fakultas: mockFakultas },
          loading: false,
          error: null,
          ...rest
        };
      case 'GetAllCpl':
        return {
          data: { allCpl: mockCpl },
          loading: false,
          error: null,
          ...rest
        };
      case 'GetAllMataKuliah':
        return {
          data: { allMataKuliah: mockMataKuliah },
          loading: false,
          error: null,
          ...rest
        };
      case 'GetAllCpmk':
        return {
          data: { allCpmk: mockCpmk },
          loading: false,
          error: null,
          ...rest
        };
      case 'GetAllProfilLulusan':
        return {
          data: { allProfilLulusan: mockProfilLulusan },
          loading: false,
          error: null,
          ...rest
        };
      case 'GetAllStakeholder':
        return {
          data: { allStakeholder: mockStakeholder },
          loading: false,
          error: null,
          ...rest
        };
      case 'GetAllSurvey':
        return {
          data: { allSurvey: mockSurvey },
          loading: false,
          error: null,
          ...rest
        };
      default:
        return {
          data: null,
          loading: false,
          error: null,
          ...rest
        };
    }
  }

  return { data, loading, error, ...rest };
}

// Custom hook untuk mutations dengan fallback
export function useMutationWithFallback(mutation: any, options: any = {}) {
  if (useMockData) {
    // Return mock mutation function
    const mockMutation = async (variables: any) => {
      console.log('Mock mutation called with:', variables);
      return { data: { success: true } };
    };

    return [mockMutation, { loading: false, error: null }];
  }

  // Use real mutation
  return [mutation, options];
}
