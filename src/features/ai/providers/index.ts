import { LLMProvider, LLMPromptPayload } from '../types';

/**
 * Mock Provider for local deterministic testing without spending API credits.
 */
export class MockProvider implements LLMProvider {
  async execute(payload: LLMPromptPayload): Promise<string> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return a perfect mock response conforming to the schema
    return JSON.stringify({
      analysisSummary: "Based on the report, the student is struggling heavily with the prerequisites for Gas Pressure.",
      encouragementMessage: "You are doing great! Let's just review some of the basics and you will master this in no time.",
      recommendedFocusTopicId: "t3_1",
      actionableSteps: [
        "Review Solid Pressure concepts.",
        "Take a 15-minute practice quiz.",
        "Proceed to Gas Pressure."
      ]
    });
  }

  getProviderName(): string {
    return 'MockProvider';
  }
}

/**
 * Stub for future OpenAI Implementation
 */
export class OpenAIProvider implements LLMProvider {
  async execute(payload: LLMPromptPayload): Promise<string> {
    throw new Error('OpenAIProvider not yet implemented with live API keys.');
  }

  getProviderName(): string {
    return 'OpenAIProvider';
  }
}

/**
 * Stub for future Gemini Implementation
 */
export class GeminiProvider implements LLMProvider {
  async execute(payload: LLMPromptPayload): Promise<string> {
    throw new Error('GeminiProvider not yet implemented with live API keys.');
  }

  getProviderName(): string {
    return 'GeminiProvider';
  }
}
