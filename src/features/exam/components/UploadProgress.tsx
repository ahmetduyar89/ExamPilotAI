import { Progress } from '@/components/ui/Progress';
import { Card, CardContent } from '@/components/ui/Card';
import { FileText, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UploadProgressProps {
  fileName: string;
  isComplete: boolean;
}

export function UploadProgress({ fileName, isComplete }: UploadProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isComplete) {
      setProgress(100);
      return;
    }
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 90) return p;
        return p + Math.floor(Math.random() * 10) + 5;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isComplete]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="p-2 bg-secondary rounded-lg text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{fileName}</p>
            <p className="text-xs text-text-secondary mt-1">
              {isComplete ? 'Upload complete' : 'Uploading...'}
            </p>
          </div>
          {isComplete && (
            <CheckCircle2 className="w-6 h-6 text-success animate-in zoom-in duration-300" />
          )}
        </div>
        <Progress value={progress} className="h-2" />
      </CardContent>
    </Card>
  );
}
