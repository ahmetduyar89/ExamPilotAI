import { 
  AIReport, 
  StudentSection, 
  ExamSection, 
  PerformanceSection, 
  TopicDependency,
  Explainable
} from '../models';
import { ExplainabilityService } from '../services/ExplainabilityService';
import { reportSchema } from '../validators';

export class ReportBuilder {
  private report: Partial<AIReport> = {};

  constructor() {
    this.report = {
      mastery: {},
      priority: {},
      knowledgeDependencies: [],
      coachNotes: []
    };
  }

  setStudent(student: StudentSection): this {
    this.report.student = student;
    return this;
  }

  setExam(exam: ExamSection): this {
    this.report.exam = exam;
    return this;
  }

  setPerformance(performance: PerformanceSection[]): this {
    this.report.performance = performance;
    return this;
  }

  addMastery(topicId: string, score: number, consistency: number, trend: number): this {
    const reasons = [];
    if (consistency > 0.8) reasons.push('Highly consistent historical performance');
    else if (consistency < 0.4) reasons.push('Erratic historical performance');

    if (trend > 0.5) reasons.push('Strong positive trend in recent exams');
    else if (trend < -0.5) reasons.push('Concerning negative trend in recent exams');

    if (reasons.length === 0) reasons.push('Based on historical correctness ratio');

    this.report.mastery![topicId] = ExplainabilityService.attach(
      score,
      reasons,
      consistency, // Confidence is tied to consistency
      'intelligence_engine'
    );

    return this;
  }

  addPriority(topicId: string, score: number, engineReasons: string[]): this {
    // Confidence is generally high for deterministic priorities
    this.report.priority![topicId] = ExplainabilityService.attach(
      score,
      engineReasons,
      0.95, 
      'intelligence_engine'
    );
    return this;
  }

  addKnowledgeDependency(dependency: TopicDependency): this {
    this.report.knowledgeDependencies!.push(dependency);
    return this;
  }

  setPredictions(expectedNetGain: number, expectedScoreGain: number, confidence: number): this {
    this.report.predictions = ExplainabilityService.attach(
      { expectedNetGain, expectedScoreGain },
      ['Extrapolated from historical consistency and available room for growth in high priority topics'],
      confidence,
      'intelligence_engine'
    );
    return this;
  }

  setStudyPlan(plan: any): this {
    this.report.studyPlan = plan;
    return this;
  }

  build(): AIReport {
    // 1. Generate final coach notes based on the aggregated data
    this.report.coachNotes = ExplainabilityService.generateCoachNotes(
      this.report.mastery!, 
      this.report.priority!
    );

    // 2. Validate against schema to guarantee structural integrity
    try {
      const validatedReport = reportSchema.parse(this.report);
      return validatedReport as AIReport;
    } catch (error) {
      console.error("Failed to validate final AI Report:", error);
      throw new Error("Report generation failed due to strict schema violation.");
    }
  }
}
