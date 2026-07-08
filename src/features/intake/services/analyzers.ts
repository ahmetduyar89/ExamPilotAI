import { IntakeSession, ImageQuality } from '../types';

/**
 * Synthesizes a pre-flight intake analysis for a document session.
 *
 * This is a mock analyzer — there is no OCR or AI. It produces plausible
 * image-quality metrics and a derived quality score so the Inspector screen
 * has realistic data to render.
 */
export class IntakeService {
  static async processDocument(documentSessionId: string): Promise<IntakeSession> {
    // Simulate analysis latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const imageQuality: ImageQuality = {
      blur: round(0.05 + Math.random() * 0.25),
      brightness: round(0.55 + Math.random() * 0.3),
      contrast: round(0.6 + Math.random() * 0.3),
      rotation: round(-3 + Math.random() * 6, 1),
      crop: round(Math.random() * 0.12),
      noise: round(0.1 + Math.random() * 0.2),
    };

    const qualityScore = this.computeQualityScore(imageQuality);

    return {
      id: crypto.randomUUID(),
      documentSessionId,
      publisher: 'unknown',
      layout: 'single_column',
      documentCategory: 'answer_sheet',
      qualityScore,
      imageQuality,
      confidence: round(0.8 + Math.random() * 0.18),
      createdAt: new Date().toISOString(),
    };
  }

  private static computeQualityScore(q: ImageQuality): number {
    const sharpness = 1 - q.blur;
    const framing = 1 - q.crop;
    const cleanliness = 1 - q.noise;
    const alignment = 1 - Math.min(1, Math.abs(q.rotation) / 15);

    const score =
      sharpness * 30 + q.contrast * 20 + cleanliness * 20 + framing * 15 + alignment * 15;

    return Math.round(Math.min(100, Math.max(0, score)));
  }
}

function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
