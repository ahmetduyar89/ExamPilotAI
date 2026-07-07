import { Exam } from '../types';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface ExamCardProps {
  exam: Exam;
  onClick?: (exam: Exam) => void;
}

export function ExamCard({ exam, onClick }: ExamCardProps) {
  const getStatusIcon = () => {
    switch (exam.status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 mr-1 text-success" />;
      case 'processing':
        return <Clock className="w-4 h-4 mr-1 text-warning" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 mr-1 text-danger" />;
    }
  };

  const getStatusColor = () => {
    switch (exam.status) {
      case 'completed': return 'success';
      case 'processing': return 'warning';
      case 'failed': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <Card variant="action" onClick={() => onClick?.(exam)}>
      <CardContent className="p-4 sm:p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-secondary rounded-lg text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">{exam.examName}</h3>
              <p className="text-sm text-text-secondary">{exam.publisher}</p>
            </div>
          </div>
          <Badge variant={getStatusColor()}>
            <div className="flex items-center">
              {getStatusIcon()}
              <span className="capitalize">{exam.status}</span>
            </div>
          </Badge>
        </div>
        
        <div className="flex justify-between text-sm text-text-secondary pt-2 border-t border-border/50">
          <span>{new Date(exam.examDate).toLocaleDateString()}</span>
          <span className="uppercase">{exam.fileType}</span>
        </div>
      </CardContent>
    </Card>
  );
}
