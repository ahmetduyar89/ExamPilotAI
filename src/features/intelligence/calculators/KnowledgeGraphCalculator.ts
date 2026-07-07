import { KnowledgeNode, KnowledgeEdge, MasteryResult } from '../models';

export class KnowledgeGraphCalculator {
  /**
   * Calculates dependency friction.
   * If a topic has prerequisites (dependencies) that the student has low mastery in,
   * the priority of studying the target topic is reduced, because they should study the prerequisites first.
   * Conversely, studying the prerequisite becomes highly prioritized.
   * 
   * @returns A modifier map keyed by topicId, representing a priority multiplier.
   */
  static calculateDependencyModifiers(
    nodes: KnowledgeNode[], 
    edges: KnowledgeEdge[], 
    masteries: MasteryResult[]
  ): Record<string, number> {
    const modifiers: Record<string, number> = {};
    
    // Initialize defaults to 1.0
    nodes.forEach(n => modifiers[n.id] = 1.0);

    // Build a map for quick mastery lookup
    const masteryMap = new Map<string, number>();
    masteries.forEach(m => masteryMap.set(m.topicId, m.score));

    // Iterate edges to adjust modifiers
    edges.forEach(edge => {
      const sourceMastery = masteryMap.get(edge.sourceId) || 0;
      
      if (sourceMastery < 50) {
        // If prerequisite is poorly understood:
        // 1. Penalize the target topic (they shouldn't study it yet)
        modifiers[edge.targetId] *= (0.5 * (1 - edge.weight)); // Reduced priority based on edge weight
        
        // 2. Boost the source topic (they need to study this foundation)
        modifiers[edge.sourceId] *= (1 + (0.5 * edge.weight)); 
      }
    });

    return modifiers;
  }
}
