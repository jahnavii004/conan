import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createSampleContract,
  getContractAnalysis,
  uploadContract,
} from '../lib/api';
import type { Analysis, UploadResponse } from '../types/api';

export function useContractAnalysis(
  contractId: string | undefined,
  isOffline: boolean = false
) {
  return useQuery<Analysis, Error>({
    queryKey: ['contract-analysis', contractId, isOffline],
    queryFn: async () => {
      if (isOffline) {
        const res = await fetch('/offline_fixture.json');
        if (!res.ok) {
          throw new Error('Failed to load offline demo data');
        }
        return res.json() as Promise<Analysis>;
      }
      return getContractAnalysis(contractId!);
    },
    enabled: Boolean(contractId),
  });
}

export function useCreateSampleContract() {
  return useMutation<UploadResponse, Error>({
    mutationFn: () => createSampleContract(),
  });
}

export function useUploadContract() {
  return useMutation<UploadResponse, Error, File>({
    mutationFn: (file: File) => uploadContract(file),
  });
}
