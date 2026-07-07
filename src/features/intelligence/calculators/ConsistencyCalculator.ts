import { TopicHistory } from '../models';

export class ConsistencyCalculator {
  /**
   * Measures the variance (standard deviation) of scores over time.
   * Higher consistency means lower variance.
   * @returns value between 0 (highly erratic) and 1 (highly consistent)
   */
  static calculate(history: TopicHistory): number {
    const performances = history.performances;
    if (performances.length < 2) return 1;

    const scores = performances.map(p => {
      if (p.totalQuestions === 0) return 0;
      return p.correct / p.totalQuestions;
    });

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Calculate variance
    const variance = scores.reduce((acc, score) => {
      return acc + Math.pow(score - mean, 2);
    }, 0) / scores.length;

    const standardDeviation = Math.sqrt(variance);

    // Map SD to a 0-1 scale where 0 variance = 1 consistency
    // Max theoretical SD of values between 0 and 1 is 0.5.
    const normalizedSD = Math.min(standardDeviation / 0.5, 1);
    
    return 1 - normalizedSD;
  }
}
