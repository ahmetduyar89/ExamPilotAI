import { TopicHistory } from '../models';

export class TrendCalculator {
  /**
   * Calculates the linear trend (slope) of performance over time.
   * @returns slope between -1 (rapid decay) to +1 (rapid improvement). 0 is stagnant.
   */
  static calculate(history: TopicHistory): number {
    const performances = history.performances;
    if (performances.length < 2) return 0; // Not enough data for a trend

    // Map performances to a simple accuracy ratio
    const scores = performances.map(p => {
      if (p.totalQuestions === 0) return 0;
      return p.correct / p.totalQuestions;
    });

    // Simple Linear Regression (y = mx + b)
    const n = scores.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    for (let i = 0; i < n; i++) {
      sumX += i;
      sumY += scores[i];
      sumXY += i * scores[i];
      sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    // Clamp slope between -1 and 1
    return Math.max(-1, Math.min(1, slope));
  }
}
