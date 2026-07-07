import { z } from 'zod';

export const aiResponseSchema = z.object({
  analysisSummary: z.string().min(10),
  encouragementMessage: z.string().min(10),
  recommendedFocusTopicId: z.string(),
  actionableSteps: z.array(z.string()).min(1),
});
