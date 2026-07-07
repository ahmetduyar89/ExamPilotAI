export interface KnowledgeNode {
  id: string;
  name: string;
  domain: string;
  importance: number; // 0 to 1, how important is this for the exam
}

export interface KnowledgeEdge {
  sourceId: string; // The prerequisite topic
  targetId: string; // The dependent topic
  weight: number; // 0 to 1, how strong is the dependency
}

export interface TopicPerformance {
  topicId: string;
  totalQuestions: number;
  correct: number;
  wrong: number;
  blank: number;
  averageDifficulty: number; // 0 to 1
  lastTestedAt: string; // ISO date
}

export interface TopicHistory {
  topicId: string;
  performances: TopicPerformance[]; // Historical performances ordered chronologically
}

export interface MasteryResult {
  topicId: string;
  score: number; // 0 to 100
  trend: number; // Slope of recent changes (-1 to 1)
  consistency: number; // 0 to 1
}

export interface PriorityResult {
  topicId: string;
  score: number; // 0 to 100
  reasoning: string[];
}

export interface PredictionResult {
  expectedNetGain: number; // e.g. +15 points
  expectedScoreGain: number; // The actual estimated exam score increase
  confidence: number; // 0 to 1
}

export interface StudyTask {
  id: string;
  topicId: string;
  taskType: 'review' | 'practice' | 'learn';
  durationMinutes: number;
  priorityScore: number;
}

export interface WeeklyPlan {
  id: string;
  studentId: string;
  startDate: string;
  tasksByDay: Record<string, StudyTask[]>; // Keyed by ISO date string (YYYY-MM-DD)
  expectedPrediction: PredictionResult;
}
