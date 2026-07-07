import { AIPayloadDTO, LLMPromptPayload } from '../types';
import { SYSTEM_PROMPTS, USER_PROMPT_TEMPLATES } from '../prompts';

export class PromptBuilder {
  /**
   * Constructs the final payload to send to the LLM.
   */
  static buildCoachingPrompt(report: AIPayloadDTO): LLMPromptPayload {
    const reportJson = JSON.stringify(report, null, 2);
    
    // Very naive token estimation: ~4 chars per token
    const estimatedTokens = reportJson.length / 4;
    if (estimatedTokens > 8000) {
      console.warn(`[PromptBuilder] Warning: Estimated token count (${Math.round(estimatedTokens)}) is very high.`);
    }

    return {
      systemPrompt: SYSTEM_PROMPTS.COACH,
      userPrompt: USER_PROMPT_TEMPLATES.STUDY_PLAN_REQUEST(reportJson)
    };
  }
}
