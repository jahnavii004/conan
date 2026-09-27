import { useQuery } from '@tanstack/react-query';
import { getJob } from '../lib/api';
import type { JobOut } from '../types/api';

export function useJob(jobId: string | undefined) {
  return useQuery<JobOut, Error>({
    queryKey: ['job', jobId],
    queryFn: () => getJob(jobId!),
    enabled: Boolean(jobId),
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data) {
        return query.state.error ? false : 1000;
      }
      if (data.state === 'queued' || data.state === 'running') {
        return 1000;
      }
      return false;
    },
  });
}
