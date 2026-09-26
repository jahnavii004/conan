import { useMutation, useQuery } from '@tanstack/react-query';
import {
  getHealth,
  patchEdge,
  patchObligation,
  reviewObligation,
  updateEvent,
} from '../lib/api';
import type {
  Analysis,
  EdgeOut,
  EdgeReviewRequest,
  EventDateRequest,
  EventOut,
  Health,
  ObligationOut,
  ObligationPatch,
  ObligationReviewRequest,
} from '../types/api';

export function usePatchObligation() {
  return useMutation<
    ObligationOut,
    Error,
    { obligationId: string; patch: ObligationPatch }
  >({
    mutationFn: ({ obligationId, patch }) =>
      patchObligation(obligationId, patch),
  });
}

export function useReviewObligation() {
  return useMutation<
    Analysis,
    Error,
    { obligationId: string; body: ObligationReviewRequest }
  >({
    mutationFn: ({ obligationId, body }) =>
      reviewObligation(obligationId, body),
  });
}

export function usePatchEdge() {
  return useMutation<
    EdgeOut,
    Error,
    { edgeId: string; body: EdgeReviewRequest }
  >({
    mutationFn: ({ edgeId, body }) => patchEdge(edgeId, body),
  });
}

export function useUpdateEvent() {
  return useMutation<
    EventOut,
    Error,
    { contractId: string; key: string; body: EventDateRequest }
  >({
    mutationFn: ({ contractId, key, body }) =>
      updateEvent(contractId, key, body),
  });
}

export function useHealth() {
  return useQuery<Health, Error>({
    queryKey: ['health'],
    queryFn: () => getHealth(),
    staleTime: 60 * 1000,
  });
}
