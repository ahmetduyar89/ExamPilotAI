import { MasteryResult, PriorityResult, PredictionResult } from '../models';

export class PredictionCalculator {
  /**
   * Estimates the expected score gain and confidence if the generated study plan is completed.
   */
  static calculate(
    masteries: MasteryResult[], 
    priorities: PriorityResult[]
  ): PredictionResult {
    
    // Find the top 5 high-priority topics
    const topPriorities = [...priorities].sort((a, b) => b.score - a.score).slice(0, 5);
    
    let expectedNetGain = 0;
    let avgConsistency = 0;
    
    topPriorities.forEach(p => {
      const mastery = masteries.find(m => m.topicId === p.topicId);
      if (mastery) {
        // Gain is roughly proportional to how much room there is to grow (100 - mastery)
        // Scaled down since studying for a week doesn't guarantee 100% mastery.
        const potentialGain = (100 - mastery.score) * 0.15; 
        expectedNetGain += potentialGain;
        
        avgConsistency += mastery.consistency;
      }
    });

    avgConsistency = topPriorities.length > 0 ? avgConsistency / topPriorities.length : 1;

    // Confidence is heavily based on historical consistency. Erractic scores = low confidence in predictions.
    const confidence = Math.max(0.1, Math.min(0.95, avgConsistency));

    return {
      expectedNetGain: Math.round(expectedNetGain),
      expectedScoreGain: Math.round(expectedNetGain * 1.5), // Assuming specific exam scaling
      confidence
    };
  }
}
