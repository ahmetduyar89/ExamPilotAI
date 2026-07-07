import { KnowledgeRepo } from '../repositories/knowledgeRepo';
import { KnowledgeGraphService } from './KnowledgeGraphService';
import type { StudyRecommendation } from '../models';

export class RecommendationEngine {
  /**
   * Generates a study recommendation tailored for a student who is weak in a specific topic.
   * Deterministically schedules prerequisites first, then related topics.
   */
  static generateRecommendationForWeakTopic(weakTopicId: string): StudyRecommendation | null {
    const weakTopic = KnowledgeRepo.getTopicById(weakTopicId);
    
    if (!weakTopic) {
      console.warn(`Attempted to generate recommendation for unknown topic: ${weakTopicId}`);
      return null;
    }

    // 1. Identify foundational knowledge gaps (Prerequisites)
    // If they are weak here, they likely missed the foundation.
    const prerequisites = KnowledgeGraphService.getFullPrerequisiteChain(weakTopicId);

    // 2. Identify laterally related topics for reinforcement
    const related = KnowledgeGraphService.getRelatedTopics(weakTopicId);

    // 3. Calculate total estimated study time
    // Time includes prerequisites + the weak topic itself + related topics
    let totalMinutes = weakTopic.estimatedStudyMinutes;
    prerequisites.forEach(p => totalMinutes += p.estimatedStudyMinutes);
    related.forEach(r => totalMinutes += r.estimatedStudyMinutes);

    return {
      weakTopicId,
      suggestedPrerequisiteIds: prerequisites.map(p => p.id),
      suggestedRelatedIds: related.map(r => r.id),
      estimatedStudyMinutes: totalMinutes
    };
  }
}
