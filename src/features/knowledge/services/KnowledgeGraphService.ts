import { KnowledgeRepo } from '../repositories/knowledgeRepo';
import { Topic } from '../models';

export class KnowledgeGraphService {
  /**
   * Retrieves all immediate prerequisites for a given topic.
   */
  static getPrerequisites(topicId: string): Topic[] {
    const topic = KnowledgeRepo.getTopicById(topicId);
    if (!topic) return [];

    return topic.prerequisites
      .map(id => KnowledgeRepo.getTopicById(id))
      .filter((t): t is Topic => t !== null);
  }

  /**
   * Retrieves all related topics for a given topic.
   */
  static getRelatedTopics(topicId: string): Topic[] {
    const topic = KnowledgeRepo.getTopicById(topicId);
    if (!topic) return [];

    return topic.relatedTopics
      .map(id => KnowledgeRepo.getTopicById(id))
      .filter((t): t is Topic => t !== null);
  }

  /**
   * Performs a BFS to find the full prerequisite chain (deep traversal).
   */
  static getFullPrerequisiteChain(topicId: string): Topic[] {
    const topic = KnowledgeRepo.getTopicById(topicId);
    if (!topic) return [];

    const visited = new Set<string>();
    const chain: Topic[] = [];
    const queue: string[] = [...topic.prerequisites];

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      if (!visited.has(currentId)) {
        visited.add(currentId);
        const currentTopic = KnowledgeRepo.getTopicById(currentId);
        if (currentTopic) {
          chain.push(currentTopic);
          queue.push(...currentTopic.prerequisites);
        }
      }
    }

    // Reverse to put foundational topics first
    return chain.reverse();
  }
}
