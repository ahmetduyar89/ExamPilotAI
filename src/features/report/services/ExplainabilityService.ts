import { Explainable, SourceEngine } from '../models';

export class ExplainabilityService {
  /**
   * Wraps a calculated value in an Explainable container with reasoning and confidence.
   */
  static attach<T>(
    value: T, 
    reason: string[], 
    confidence: number, 
    source: SourceEngine
  ): Explainable<T> {
    return {
      value,
      explainability: {
        reason,
        confidence,
        source
      }
    };
  }

  /**
   * Generates coach notes based on extreme values found in the report.
   */
  static generateCoachNotes(
    masteries: Record<string, Explainable<number>>,
    priorities: Record<string, Explainable<number>>
  ): string[] {
    const notes: string[] = [];
    
    let criticalWeaknessCount = 0;
    
    Object.entries(masteries).forEach(([topicId, m]) => {
      if (m.value < 30) criticalWeaknessCount++;
    });

    if (criticalWeaknessCount > 3) {
      notes.push('Student is demonstrating foundational weakness across multiple topics. Recommend stepping back to prerequisites.');
    }

    const maxPriority = Object.values(priorities).reduce((max, p) => Math.max(max, p.value), 0);
    if (maxPriority > 90) {
      notes.push('Urgent intervention required on highest priority topics due to heavy historical error rates and dependency blockages.');
    }

    if (notes.length === 0) {
      notes.push('Student is tracking well with no critical anomalies detected.');
    }

    return notes;
  }
}
