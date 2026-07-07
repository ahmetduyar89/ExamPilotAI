export interface Student {
  id: string;
  name: string;
  grade: string;
  school: string;
  targetExam: string;
  createdAt: string;
}

export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt'>;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;
