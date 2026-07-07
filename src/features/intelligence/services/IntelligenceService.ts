import { MasteryCalculator } from '../calculators/MasteryCalculator';
import { KnowledgeGraphCalculator } from '../calculators/KnowledgeGraphCalculator';
import { PriorityCalculator } from '../calculators/PriorityCalculator';
import { PredictionCalculator } from '../calculators/PredictionCalculator';
import { StudyPlanner } from '../calculators/StudyPlanner';
import { KnowledgeNode, KnowledgeEdge, TopicHistory, WeeklyPlan, MasteryResult, PriorityResult } from '../models';

export class IntelligenceService {
  /**
   * The master orchestrator.
   * Consumes raw historical data and structural knowledge graph data,
   * then pipes it through the deterministic calculators to output a unified weekly plan.
   */
  static generateIntelligenceReport(
    studentId: string,
    historyData: TopicHistory[],
    nodes: KnowledgeNode[],
    edges: KnowledgeEdge[]
  ): WeeklyPlan {
    
    // 1. Calculate base masteries for all topics based purely on history
    const masteries: MasteryResult[] = historyData.map(history => 
      MasteryCalculator.calculate(history)
    );

    // 2. Adjust for structural dependencies
    const dependencyModifiers = KnowledgeGraphCalculator.calculateDependencyModifiers(
      nodes, 
      edges, 
      masteries
    );

    // 3. Calculate final priorities
    const priorities: PriorityResult[] = nodes.map(node => {
      const history = historyData.find(h => h.topicId === node.id) || { topicId: node.id, performances: [] };
      const mastery = masteries.find(m => m.topicId === node.id) || { topicId: node.id, score: 0, trend: 0, consistency: 1 };
      const modifier = dependencyModifiers[node.id] || 1.0;
      
      return PriorityCalculator.calculate(mastery, node, history, modifier);
    });

    // 4. Calculate predictions based on the current state
    const prediction = PredictionCalculator.calculate(masteries, priorities);

    // 5. Generate the actionable plan
    const plan = StudyPlanner.generateWeeklyPlan(studentId, priorities, masteries, prediction);

    return plan;
  }
}
