export type AIPayloadDTO = Record<string, unknown>;

export interface LLMPromptPayload {
  systemPrompt: string;
  userPrompt: string;
}

export interface LLMProvider {
  /**
   * Executes the prompt against the LLM and returns a JSON string.
   */
  execute(payload: LLMPromptPayload): Promise<string>;
  
  getProviderName(): string;
}

export interface AIGatewayOptions {
  retries?: number;
  timeoutMs?: number;
}

export interface AIResponse {
  analysisSummary: string;
  encouragementMessage: string;
  recommendedFocusTopicId: string;
  actionableSteps: string[];
}
