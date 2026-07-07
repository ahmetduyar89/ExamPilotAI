import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  grade: z.string().min(1, 'Grade is required'),
  school: z.string().min(2, 'School name is required'),
  targetExam: z.string().min(2, 'Target exam is required'),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
