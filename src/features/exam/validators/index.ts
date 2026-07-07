import { z } from 'zod';

export const examSchema = z.object({
  studentId: z.string().min(1, 'Please select a student'),
  publisher: z.string().min(2, 'Publisher is required'),
  examName: z.string().min(2, 'Exam name is required'),
  examDate: z.string().min(1, 'Exam date is required'),
});

export type ExamFormValues = z.infer<typeof examSchema>;
