import { z } from 'zod';

export const studentSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  grade: z.string().min(1, 'Grade is required'),
  school: z.string().min(1, 'School is required'),
  targetExam: z.string().min(1, 'Target exam is required'),
});

export type StudentFormValues = z.infer<typeof studentSchema>;
