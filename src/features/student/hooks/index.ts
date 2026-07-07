import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { studentRepo } from '../services/mockRepo';
import { CreateStudentDTO, UpdateStudentDTO } from '../types';

export const studentKeys = {
  all: ['students'] as const,
  detail: (id: string) => ['students', id] as const,
};

export function useStudents() {
  return useQuery({
    queryKey: studentKeys.all,
    queryFn: studentRepo.getAll,
  });
}

export function useStudent(id: string) {
  return useQuery({
    queryKey: studentKeys.detail(id),
    queryFn: () => studentRepo.getById(id),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateStudentDTO) => studentRepo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStudentDTO }) => studentRepo.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(data.id) });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => studentRepo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: studentKeys.all });
    },
  });
}
