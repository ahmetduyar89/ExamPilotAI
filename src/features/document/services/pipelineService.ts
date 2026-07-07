import { documentRepo } from '../repositories/mockRepo';
import { ProcessingStatus } from '../types';

const PIPELINE_STEPS: { status: ProcessingStatus; durationMs: number }[] = [
  { status: 'processing', durationMs: 1500 },
  { status: 'optimized', durationMs: 2000 },
  { status: 'classified', durationMs: 1500 },
  { status: 'ocr_pending', durationMs: 1000 },
  { status: 'ocr_completed', durationMs: 3000 },
  { status: 'parsed', durationMs: 2000 },
  { status: 'validated', durationMs: 1000 },
  { status: 'ready_for_ai', durationMs: 500 },
];

export const pipelineService = {
  /**
   * Starts a background mock pipeline for a given session.
   * Updates the repo asynchronously over time.
   */
  startPipeline: async (sessionId: string) => {
    // Fire and forget asynchronous pipeline
    (async () => {
      try {
        for (const step of PIPELINE_STEPS) {
          // Wait for the duration of the current step simulation
          await new Promise(resolve => setTimeout(resolve, step.durationMs));
          
          // Verify session still exists and hasn't failed
          const session = await documentRepo.getById(sessionId);
          if (!session || session.status === 'failed') break;
          
          // Move to the next step
          await documentRepo.update(sessionId, { status: step.status });
        }
      } catch (error) {
        console.error('Pipeline failed', error);
        await documentRepo.update(sessionId, { 
          status: 'failed', 
          errorMessage: 'An unexpected error occurred during processing.' 
        });
      }
    })();
  }
};
