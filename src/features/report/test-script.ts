import { ReportBuilder } from './builders';

// Simple execution script to verify the builder and schema works.
const generateMockReport = () => {
  try {
    const builder = new ReportBuilder();
    
    const report = builder
      .setStudent({ studentId: 's-123', name: 'John Doe', grade: '8th Grade' })
      .setExam({ examId: 'e-1', examName: 'Practice Test 1', publisher: 'MEB', intakeQualityScore: 85 })
      .setPerformance([{ topicId: 't3_1', correct: 8, wrong: 2, blank: 0 }])
      .addMastery('t3_1', 80, 0.9, 0.2)
      .addMastery('t3_2', 40, 0.5, -0.6)
      .addPriority('t3_2', 92, ['Repeated mistakes', 'Knowledge dependency'])
      .addKnowledgeDependency({ topicId: 't3_2', blocks: ['t3_3'], blockedBy: ['t3_1'] })
      .setPredictions(15, 22, 0.85)
      .setStudyPlan({ id: 'plan-1', tasksByDay: {} })
      .build();

    console.log('✅ AI Report successfully generated and strictly validated:');
    console.log(JSON.stringify(report, null, 2));
  } catch (err) {
    console.error('❌ Failed to generate report:', err);
  }
};

generateMockReport();
