import { TopicPerformance } from '../models';

export class DifficultyCalculator {
  /**
   * Calculates a normalized difficulty multiplier based on the performance average difficulty.
   * If a topic is inherently harder (closer to 1), doing well is rewarded more.
   * Doing poorly on an easy topic is penalized more.
   * @returns multiplier between 0.8 (easy) to 1.2 (hard)
   */
  static calculateMultiplier(performance: TopicPerformance): number {
    // averageDifficulty ranges 0 to 1.
    // Map 0 -> 0.8, 1 -> 1.2
    return 0.8 + (performance.averageDifficulty * 0.4);
  }
}
