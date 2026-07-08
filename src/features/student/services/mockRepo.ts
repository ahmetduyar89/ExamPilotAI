import { Student, CreateStudentDTO, UpdateStudentDTO } from '../types';
import { PersistenceRegistry } from '@/core/persistence';

const getRepo = () => PersistenceRegistry.getProvider().getRepository<Student>('students');

export const studentRepo = {
  getAll: async (): Promise<Student[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getRepo().findAll();
  },

  getById: async (id: string): Promise<Student | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const result = await getRepo().findById(id);
    return result || undefined;
  },

  create: async (data: CreateStudentDTO): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStudent: Student = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    return getRepo().save(newStudent);
  },

  update: async (id: string, data: UpdateStudentDTO): Promise<Student> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const existing = await getRepo().findById(id);
    if (!existing) throw new Error('Student not found');

    const updatedStudent = { ...existing, ...data };
    return getRepo().save(updatedStudent);
  },

  delete: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    await getRepo().delete(id);
  }
};
