import { PriorityResult, StudyTask, WeeklyPlan, PredictionResult, MasteryResult } from '../models';
import { MAX_STUDY_HOURS_PER_DAY, MINUTES_PER_TASK } from '../constants';

export class StudyPlanner {
  /**
   * Distributes high priority topics across a 7-day plan, respecting maximum daily limits.
   */
  static generateWeeklyPlan(
    studentId: string,
    priorities: PriorityResult[],
    masteries: MasteryResult[],
    prediction: PredictionResult
  ): WeeklyPlan {
    // Sort topics strictly by priority score descending
    const sortedTopics = [...priorities].sort((a, b) => b.score - a.score);
    
    const tasksByDay: Record<string, StudyTask[]> = {};
    const today = new Date();
    
    let topicIndex = 0;
    
    // Generate for 7 days
    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const currentDay = new Date(today);
      currentDay.setDate(today.getDate() + dayOffset);
      const dateString = currentDay.toISOString().split('T')[0];
      
      const dailyTasks: StudyTask[] = [];
      let minutesAllocated = 0;
      const maxMinutes = MAX_STUDY_HOURS_PER_DAY * 60;
      
      // Fill the day until max hours reached or run out of priority topics
      while (minutesAllocated < maxMinutes && topicIndex < sortedTopics.length) {
        const priority = sortedTopics[topicIndex];
        
        // Find mastery to determine task type
        const mastery = masteries.find(m => m.topicId === priority.topicId);
        let taskType: 'review' | 'practice' | 'learn' = 'practice';
        
        if (!mastery || mastery.score < 30) {
          taskType = 'learn'; // Foundation is weak
        } else if (mastery.score > 80) {
          taskType = 'review'; // Keeping it fresh
        }
        
        dailyTasks.push({
          id: crypto.randomUUID(),
          topicId: priority.topicId,
          taskType,
          durationMinutes: MINUTES_PER_TASK,
          priorityScore: priority.score
        });
        
        minutesAllocated += MINUTES_PER_TASK;
        
        // We can optionally reuse topics later in the week, but for this simple version, 
        // we just move down the priority list.
        topicIndex++;
      }
      
      tasksByDay[dateString] = dailyTasks;
    }
    
    return {
      id: crypto.randomUUID(),
      studentId,
      startDate: today.toISOString(),
      tasksByDay,
      expectedPrediction: prediction
    };
  }
}
