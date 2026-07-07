import * as React from 'react';
import { useExams } from '@/features/exam/hooks';
import { useStudents } from '@/features/student/hooks';
import { ExamCard } from '@/features/exam/components/ExamCard';
import { Exam } from '@/features/exam/types';
import { BottomSheet } from '@/components/ui/BottomSheet';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader2, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export default function Dashboard() {
  const { data: exams, isLoading: isLoadingExams } = useExams();
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  
  const [selectedExam, setSelectedExam] = React.useState<Exam | null>(null);

  const isLoading = isLoadingExams || isLoadingStudents;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-text-secondary">Total Students</h3>
          <p className="mt-2 text-3xl font-bold">{students?.length || 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold text-text-secondary">Exams Uploaded</h3>
          <p className="mt-2 text-3xl font-bold">{exams?.length || 0}</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm flex flex-col justify-center">
          <h3 className="font-semibold text-text-secondary mb-4">Development Tools</h3>
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/inspector/test'}
          >
            Test Intake Inspector
          </Button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Recent Exams</h2>
        
        {isLoading ? (
          <div className="flex h-[300px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !exams || exams.length === 0 ? (
          <EmptyState
            icon={<FileText />}
            title="No exams yet"
            description="Upload an exam to see it listed here."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onClick={setSelectedExam}
              />
            ))}
          </div>
        )}
      </div>

      <BottomSheet
        isOpen={!!selectedExam}
        onClose={() => setSelectedExam(null)}
      >
        {selectedExam && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedExam.examName}</h2>
                <p className="text-text-secondary mt-1">{selectedExam.publisher}</p>
              </div>
              <Badge variant={selectedExam.status === 'completed' ? 'success' : selectedExam.status === 'failed' ? 'danger' : 'warning'}>
                {selectedExam.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-sm text-text-secondary mb-1">Student</p>
                <p className="font-medium">
                  {students?.find(s => s.id === selectedExam.studentId)?.name || 'Unknown'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Date Taken</p>
                <p className="font-medium">{new Date(selectedExam.examDate).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-6 rounded-xl overflow-hidden border border-border bg-secondary/50 flex items-center justify-center min-h-[300px]">
              {selectedExam.fileType === 'image' ? (
                <img src={selectedExam.imageUrl} alt="Exam" className="max-w-full max-h-[400px] object-contain" />
              ) : (
                <div className="flex flex-col items-center text-text-secondary">
                  <FileText className="w-16 h-16 mb-4 opacity-50" />
                  <p>PDF Document</p>
                  <p className="text-sm opacity-70 mt-1">Preview not available for mock data</p>
                </div>
              )}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
