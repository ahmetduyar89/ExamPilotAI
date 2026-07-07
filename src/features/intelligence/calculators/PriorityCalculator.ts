import { MasteryResult, KnowledgeNode, PriorityResult, TopicHistory } from '../models';
import { WEIGHTS } from '../constants';

export class PriorityCalculator {
  /**
   * Calculates the priority score (0-100) for a topic.
   * Higher score = Student should study this immediately.
   */
  static calculate(
    mastery: MasteryResult, 
    node: KnowledgeNode, 
    history: TopicHistory,
    dependencyModifier: number
  ): PriorityResult {
    const reasoning: string[] = [];
    
    // 1. Inverse Mastery (lower mastery = higher priority)
    const inverseMastery = 100 - mastery.score;
    let priority = inverseMastery * WEIGHTS.PRIORITY_MASTERY_INVERSE;
    if (inverseMastery > 70) reasoning.push("Low mastery level.");

    // 2. Importance of the topic
    const importanceScore = (node.importance * 100) * WEIGHTS.PRIORITY_IMPORTANCE;
    priority += importanceScore;
    if (node.importance > 0.8) reasoning.push("High yield exam topic.");

    // 3. Frequency of Mistakes (Error rate penalty)
    const totalWrong = history.performances.reduce((sum, p) => sum + p.wrong, 0);
    const totalQ = history.performances.reduce((sum, p) => sum + p.totalQuestions, 0);
    const errorRate = totalQ > 0 ? (totalWrong / totalQ) * 100 : 0;
    
    priority += errorRate * WEIGHTS.PRIORITY_MISTAKE_FREQ;
    if (errorRate > 30) reasoning.push("High frequency of historical mistakes.");

    // 4. Knowledge Graph Dependency Modifier
    priority *= dependencyModifier;
    
    if (dependencyModifier > 1.2) {
      reasoning.push("Critical foundational prerequisite.");
    } else if (dependencyModifier < 0.8) {
      reasoning.push("Postponed: Prerequisites not met.");
    }

    // 5. Trend modifier (If trend is negative, boost priority to stop knowledge decay)
    if (mastery.trend < -0.3) {
      priority *= 1.1; // 10% boost
      reasoning.push("Recent performance is declining.");
    }

    // Clamp between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(priority)));

    if (reasoning.length === 0) reasoning.push("Standard review.");

    return {
      topicId: node.id,
      score: finalScore,
      reasoning
    };
  }
}
