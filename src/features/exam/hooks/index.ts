import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { examRepo } from '../services/mockRepo';
import { CreateExamDTO } from '../types';

export const examKeys = {
  all: ['exams'] as const,
  byStudent: (studentId: string) => ['exams', { studentId }] as const,
};

export function useExams() {
  return useQuery({
    queryKey: examKeys.all,
    queryFn: examRepo.getAll,
  });
}

export function useStudentExams(studentId: string) {
  return useQuery({
    queryKey: examKeys.byStudent(studentId),
    queryFn: () => examRepo.getByStudentId(studentId),
    enabled: !!studentId,
  });
}

export function useCreateExam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateExamDTO) => examRepo.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: examKeys.all });
      queryClient.invalidateQueries({ queryKey: examKeys.byStudent(data.studentId) });
    },
  });
}
