import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { intakeRepo } from '../repositories/mockRepo';
import { IntakeService } from '../services/analyzers';

export const intakeKeys = {
  detail: (id: string) => ['intake', id] as const,
  byDocument: (docSessionId: string) => ['intake', 'document', docSessionId] as const,
};

export function useIntakeSession(id?: string) {
  return useQuery({
    queryKey: intakeKeys.detail(id!),
    queryFn: () => intakeRepo.getById(id!),
    enabled: !!id,
  });
}

export function useIntakeSessionByDocument(docSessionId?: string) {
  return useQuery({
    queryKey: intakeKeys.byDocument(docSessionId!),
    queryFn: () => intakeRepo.getByDocumentSessionId(docSessionId!),
    enabled: !!docSessionId,
  });
}

export function useProcessIntake() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (documentSessionId: string) => {
      const session = await IntakeService.processDocument(documentSessionId);
      return intakeRepo.create(session);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: intakeKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: intakeKeys.byDocument(data.documentSessionId) });
    },
  });
}
