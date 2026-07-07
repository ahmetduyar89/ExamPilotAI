import { Exam, CreateExamDTO } from '../types';
import { PersistenceRegistry } from '@/core/persistence';

const getRepo = () => PersistenceRegistry.getProvider().getRepository<Exam>('exams');

export const examRepo = {
  getAll: async (): Promise<Exam[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getRepo().findAll();
  },

  getByStudentId: async (studentId: string): Promise<Exam[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getRepo().query(e => e.studentId === studentId);
  },

  create: async (data: CreateExamDTO): Promise<Exam> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate upload delay
    const newExam: Exam = {
      ...data,
      id: crypto.randomUUID(),
      status: 'completed', // Immediately complete since no AI
      createdAt: new Date().toISOString(),
    };
    return getRepo().save(newExam);
  }
};
