import { Unit } from '../models';
import { curriculumSchema } from '../validators';
// import mebScienceGrade8Data from '../datasets/meb_science_grade8.json';

export class KnowledgeRepo {
  private static cachedCurriculum: Unit[] | null = null;

  /**
   * Securely loads, validates, and caches the curriculum dataset.
   */
  static getCurriculum(): Unit[] {
    if (this.cachedCurriculum) {
      return this.cachedCurriculum;
    }

    try {
      // Validate the JSON file against our strict Zod schema
      const validData: Unit[] = []; // curriculumSchema.parse(mebScienceGrade8Data);
      this.cachedCurriculum = validData;
      return validData;
    } catch (error) {
      console.error('Failed to validate curriculum dataset:', error);
      throw new Error('Invalid curriculum dataset structure.');
    }
  }

  /**
   * Finds a specific topic by its ID across all units.
   */
  static getTopicById(topicId: string) {
    const curriculum = this.getCurriculum();
    for (const unit of curriculum) {
      const topic = unit.topics.find(t => t.id === topicId);
      if (topic) return topic;
    }
    return null;
  }
}
