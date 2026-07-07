import { ProcessingStatus } from '../types';
import { motion } from 'framer-motion';
import { Check, Circle, Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

const PIPELINE_ORDER: { id: ProcessingStatus; label: string }[] = [
  { id: 'uploaded', label: 'Uploaded' },
  { id: 'processing', label: 'Processing Setup' },
  { id: 'optimized', label: 'Image Optimized' },
  { id: 'classified', label: 'Document Classified' },
  { id: 'ocr_pending', label: 'Waiting OCR...' },
  { id: 'ocr_completed', label: 'OCR Completed' },
  { id: 'parsed', label: 'Data Parsed' },
  { id: 'validated', label: 'Validated' },
  { id: 'ready_for_ai', label: 'Ready for AI' },
];

interface TimelineProps {
  currentStatus: ProcessingStatus;
}

export function Timeline({ currentStatus }: TimelineProps) {
  // Find index of current status. If failed, we stop at whatever index it was, but we won't show failed in the standard timeline steps (or we can just halt).
  let currentIndex = PIPELINE_ORDER.findIndex(step => step.id === currentStatus);
  const isFailed = currentStatus === 'failed';
  
  // If failed and not found (shouldn't happen) or just failed at unknown step, assume -1.
  // Actually, we need to know what step it failed on. For simplicity, if failed, we'll mark all unreached steps as grey.
  if (isFailed) currentIndex = -1; // We handle failure visually by halting. But wait, we don't store "failedAt". Let's assume if it fails, it halts.

  // Wait, if it's failed, it won't match any index, so currentIndex is -1.
  // If we just want a simple linear timeline, we can assume the highest reached state.
  // We don't have historical state in the UI. We'll just highlight up to the matched index.

  return (
    <div className="flex flex-col space-y-6 pl-2">
      {PIPELINE_ORDER.map((step, index) => {
        const isCompleted = index < currentIndex || currentStatus === 'ready_for_ai';
        const isActive = index === currentIndex && !isFailed;
        const isPending = index > currentIndex && !isFailed;

        return (
          <div key={step.id} className="relative flex items-start">
            {/* Connecting Line */}
            {index !== PIPELINE_ORDER.length - 1 && (
              <div 
                className={cn(
                  "absolute left-[11px] top-8 bottom-[-24px] w-[2px]",
                  isCompleted ? "bg-primary" : "bg-border"
                )} 
              />
            )}
            
            {/* Step Icon */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6 mr-4 bg-background">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground"
                >
                  <Check className="w-3.5 h-3.5" />
                </motion.div>
              ) : isActive ? (
                <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center text-primary">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </div>
              ) : (
                <Circle className="w-6 h-6 text-border" />
              )}
            </div>

            {/* Step Label */}
            <div className="flex flex-col">
              <span className={cn(
                "text-sm font-medium transition-colors duration-300",
                isCompleted || isActive ? "text-text-primary" : "text-text-secondary"
              )}>
                {step.label}
              </span>
              {isActive && (
                <motion.span 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-text-secondary mt-1"
                >
                  Working on it...
                </motion.span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
