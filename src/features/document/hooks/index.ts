import { useQuery, useMutation } from '@tanstack/react-query';
import { documentRepo } from '../repositories/mockRepo';
import { pipelineService } from '../services/pipelineService';
import { CreateSessionDTO } from '../types';

export const documentKeys = {
  detail: (id: string) => ['document_session', id] as const,
};

export function useDocumentSession(id: string) {
  return useQuery({
    queryKey: documentKeys.detail(id),
    queryFn: () => documentRepo.getById(id),
    enabled: !!id,
    refetchInterval: (query) => {
      // Poll every 500ms while processing, stop polling when terminal state is reached
      const status = query.state?.data?.status;
      if (!status) return 500;
      if (status === 'ready_for_ai' || status === 'failed') return false;
      return 500;
    },
  });
}

export function useStartProcessing() {
  return useMutation({
    mutationFn: async (data: CreateSessionDTO) => {
      const session = await documentRepo.create(data);
      // Kick off the background pipeline
      pipelineService.startPipeline(session.id);
      return session;
    },
  });
}
