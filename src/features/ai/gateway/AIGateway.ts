import { LLMProvider, AIGatewayOptions, AIResponse, AIPayloadDTO } from '../types';
import { PromptBuilder } from '../builders/PromptBuilder';
import { aiResponseSchema } from '../schemas';

export class AIGateway {
  private provider: LLMProvider;
  private options: Required<AIGatewayOptions>;

  constructor(provider: LLMProvider, options?: AIGatewayOptions) {
    this.provider = provider;
    this.options = {
      retries: options?.retries ?? 3,
      timeoutMs: options?.timeoutMs ?? 15000,
    };
  }

  /**
   * Executes the prompt with timeout and retry logic, then validates the JSON response.
   */
  async generateCoachingPlan(report: AIPayloadDTO): Promise<AIResponse> {
    const payload = PromptBuilder.buildCoachingPrompt(report);
    let lastError: Error | unknown;

    for (let attempt = 1; attempt <= this.options.retries; attempt++) {
      try {
        console.log(`[AIGateway] Attempt ${attempt} via ${this.provider.getProviderName()}...`);
        
        const rawJsonString = await this.executeWithTimeout(payload);
        
        // Parse JSON
        let parsedJson;
        try {
          parsedJson = JSON.parse(rawJsonString);
        } catch (e) {
          throw new Error('LLM returned malformed JSON string.');
        }

        // Validate via Zod schema
        const validatedResponse = aiResponseSchema.parse(parsedJson);
        
        console.log(`[AIGateway] Success on attempt ${attempt}.`);
        return validatedResponse;

      } catch (error) {
        lastError = error;
        console.warn(`[AIGateway] Attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
        
        if (attempt < this.options.retries) {
          // Exponential backoff
          await new Promise(res => setTimeout(res, attempt * 1000));
        }
      }
    }

    throw new Error(`AIGateway failed after ${this.options.retries} attempts. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
  }

  /**
   * Wraps the provider execution in a strict timeout.
   */
  private async executeWithTimeout(payload: any): Promise<string> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`LLM Provider timed out after ${this.options.timeoutMs}ms`));
      }, this.options.timeoutMs);

      this.provider.execute(payload)
        .then(res => {
          clearTimeout(timer);
          resolve(res);
        })
        .catch(err => {
          clearTimeout(timer);
          reject(err);
        });
    });
  }
}
