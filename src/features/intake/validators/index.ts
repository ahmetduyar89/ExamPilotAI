import { z } from 'zod';

export const imageQualitySchema = z.object({
  blur: z.number().min(0).max(1),
  brightness: z.number().min(0).max(1),
  contrast: z.number().min(0).max(1),
  rotation: z.number(),
  crop: z.number().min(0).max(1),
  noise: z.number().min(0).max(1),
});

export const intakeSessionSchema = z.object({
  id: z.string().uuid(),
  documentSessionId: z.string().uuid(),
  publisher: z.enum(['unknown']),
  layout: z.enum(['single_column', 'double_column', 'table', 'mixed']),
  documentCategory: z.enum(['exam_report', 'answer_sheet', 'score_report', 'unknown']),
  qualityScore: z.number().min(0).max(100),
  imageQuality: imageQualitySchema,
  confidence: z.number().min(0).max(1),
  createdAt: z.string().datetime(),
});
