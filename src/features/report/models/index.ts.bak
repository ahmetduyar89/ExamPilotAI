export type SourceEngine = 'intelligence_engine' | 'knowledge_graph' | 'intake_analyzer' | 'system';

export interface Explainability {
  reason: string[];
  confidence: number;
  source: SourceEngine;
}

export interface Explainable<T> {
  value: T;
  explainability: Explainability;
}

export interface StudentSection {
  studentId: string;
  name: string;
  grade: string;
}

export interface ExamSection {
  examId: string;
  examName: string;
  publisher: string;
  intakeQualityScore: number;
}

export interface PerformanceSection {
  topicId: string;
  correct: number;
  wrong: number;
  blank: number;
}

export interface TopicDependency {
  topicId: string;
  blocks: string[]; // Topics this topic blocks
  blockedBy: string[]; // Topics that block this topic
}

export interface AIReport {
  student: StudentSection;
  exam: ExamSection;
  performance: PerformanceSection[];
  mastery: Record<string, Explainable<number>>; // topicId -> Explainable Mastery
  priority: Record<string, Explainable<number>>; // topicId -> Explainable Priority
  knowledgeDependencies: TopicDependency[];
  predictions: Explainable<{ expectedNetGain: number; expectedScoreGain: number }>;
  studyPlan: any; // Using any for simplicity in mapping the WeeklyPlan object
  coachNotes: string[];
}
