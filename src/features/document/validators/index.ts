import { z } from 'zod';

export const documentSessionSchema = z.object({
  id: z.string().uuid(),
  studentId: z.string(),
  examId: z.string(),
  status: z.enum([
    'uploaded',
    'processing',
    'optimized',
    'classified',
    'ocr_pending',
    'ocr_completed',
    'parsed',
    'validated',
    'ready_for_ai',
    'failed'
  ]),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  originalFile: z.string(),
  processedFile: z.string().optional(),
  documentType: z.enum(['pdf', 'photo', 'scan']),
  publisher: z.string(),
  confidence: z.number().min(0).max(1),
  errorMessage: z.string().optional(),
});
