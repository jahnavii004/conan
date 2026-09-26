import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createSampleContract,
  getContractAnalysis,
  uploadContract,
} from '../lib/api';
import type { Analysis, UploadResponse } from '../types/api';

export function useContractAnalysis(contractId: string | undefined) {
  return useQuery<Analysis, Error>({
    queryKey: ['contract-analysis', contractId],
    queryFn: () => getContractAnalysis(contractId!),
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
