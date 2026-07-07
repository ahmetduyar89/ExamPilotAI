import { ProcessingStatus } from '../types';
import { Badge } from '@/components/ui/Badge';
import { Loader2, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ProcessingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeProps = () => {
    switch (status) {
      case 'uploaded':
      case 'processing':
      case 'optimized':
      case 'classified':
      case 'ocr_pending':
      case 'ocr_completed':
      case 'parsed':
      case 'validated':
        return { variant: 'warning' as const, icon: <Loader2 className="w-3 h-3 mr-1 animate-spin" /> };
      case 'ready_for_ai':
        return { variant: 'success' as const, icon: <CheckCircle2 className="w-3 h-3 mr-1" /> };
      case 'failed':
        return { variant: 'danger' as const, icon: <AlertCircle className="w-3 h-3 mr-1" /> };
      default:
        return { variant: 'neutral' as const, icon: <Clock className="w-3 h-3 mr-1" /> };
    }
  };

  const { variant, icon } = getBadgeProps();
  
  // Format string from snake_case to Title Case
  const formattedStatus = status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <Badge variant={variant}>
      <div className="flex items-center">
        {icon}
        <span>{formattedStatus}</span>
      </div>
    </Badge>
  );
}
