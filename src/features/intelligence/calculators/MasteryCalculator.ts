import { TopicHistory, MasteryResult } from '../models';
import { WEIGHTS } from '../constants';
import { DifficultyCalculator } from './DifficultyCalculator';
import { TrendCalculator } from './TrendCalculator';
import { ConsistencyCalculator } from './ConsistencyCalculator';

export class MasteryCalculator {
  /**
   * Calculates the overall mastery score for a topic.
   * Incorporates correct/wrong ratios, difficulty multipliers, and historical decay.
   */
  static calculate(history: TopicHistory): MasteryResult {
    const performances = history.performances;
    
    if (performances.length === 0) {
      return { topicId: history.topicId, score: 0, trend: 0, consistency: 0 };
    }

    let weightedScoreSum = 0;
    let weightSum = 0;

    // Iterate backwards (newest to oldest) applying exponential decay
    for (let i = 0; i < performances.length; i++) {
      const p = performances[performances.length - 1 - i];
      if (p.totalQuestions === 0) continue;

      // Base accuracy calculation
      const accuracyScore = 
        (p.correct * WEIGHTS.MASTERY_CORRECT) + 
        (p.wrong * WEIGHTS.MASTERY_WRONG) + 
        (p.blank * WEIGHTS.MASTERY_BLANK);
      
      const rawAccuracy = Math.max(0, accuracyScore / p.totalQuestions);
      
      // Apply difficulty multiplier
      const difficultyMultiplier = DifficultyCalculator.calculateMultiplier(p);
      const sessionScore = rawAccuracy * difficultyMultiplier * 100;

      // Apply historical decay weight (most recent = 1.0, older gets exponentially smaller)
      const historicalWeight = Math.pow(WEIGHTS.RECENT_PERFORMANCE_DECAY, i);
      
      weightedScoreSum += sessionScore * historicalWeight;
      weightSum += historicalWeight;
    }

    // Final calculations
    const rawMastery = weightSum > 0 ? weightedScoreSum / weightSum : 0;
    const finalScore = Math.max(0, Math.min(100, Math.round(rawMastery)));

    const trend = TrendCalculator.calculate(history);
    const consistency = ConsistencyCalculator.calculate(history);

    return {
      topicId: history.topicId,
      score: finalScore,
      trend,
      consistency
    };
  }
}
