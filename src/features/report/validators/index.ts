import { z } from 'zod';

export const explainabilitySchema = z.object({
  reason: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  source: z.enum(['intelligence_engine', 'knowledge_graph', 'intake_analyzer', 'system']),
});

export const explainableNumberSchema = z.object({
  value: z.number(),
  explainability: explainabilitySchema,
});

export const studentSectionSchema = z.object({
  studentId: z.string(),
  name: z.string(),
  grade: z.string(),
});

export const examSectionSchema = z.object({
  examId: z.string(),
  examName: z.string(),
  publisher: z.string(),
  intakeQualityScore: z.number().min(0).max(100),
});

export const performanceSectionSchema = z.object({
  topicId: z.string(),
  correct: z.number(),
  wrong: z.number(),
  blank: z.number(),
});

export const topicDependencySchema = z.object({
  topicId: z.string(),
  blocks: z.array(z.string()),
  blockedBy: z.array(z.string()),
});

export const reportSchema = z.any();
