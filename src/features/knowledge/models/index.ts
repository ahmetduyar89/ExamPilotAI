export interface LearningOutcome {
  id: string;
  description: string;
}

export interface Subtopic {
  id: string;
  name: string;
  learningOutcomes: LearningOutcome[];
}

export interface QuestionDistribution {
  level: 'easy' | 'medium' | 'hard';
  percentage: number;
}

export interface KnowledgeDependency {
  topicId: string;
  type: 'prerequisite' | 'related';
}

export interface Topic {
  id: string;
  unitId: string;
  name: string;
  subtopics: Subtopic[];
  difficulty: 1 | 2 | 3 | 4 | 5; // 1 = Easiest, 5 = Hardest
  importance: 1 | 2 | 3 | 4 | 5; // 1 = Low yield, 5 = High yield
  estimatedStudyMinutes: number;
  prerequisites: string[]; // Topic IDs that must be learned first
  relatedTopics: string[]; // Topic IDs that are conceptually linked
  tags: string[];
}

export interface Unit {
  id: string;
  name: string;
  gradeLevel: number;
  subject: string;
  topics: Topic[];
}

export interface StudyRecommendation {
  weakTopicId: string;
  suggestedPrerequisiteIds: string[];
  suggestedRelatedIds: string[];
  estimatedStudyMinutes: number;
}
