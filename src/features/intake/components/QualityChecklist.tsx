import { ImageQuality } from '../types';
import { Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface QualityChecklistProps {
  imageQuality: ImageQuality;
}

export function QualityChecklist({ imageQuality }: QualityChecklistProps) {
  // Thresholds for passing
  const checks = [
    { label: 'Not blurry', passed: imageQuality.blur < 0.2 },
    { label: 'Enough brightness', passed: imageQuality.brightness > 0.4 && imageQuality.brightness < 0.9 },
    { label: 'Good contrast', passed: imageQuality.contrast > 0.5 },
    { label: 'Proper rotation', passed: Math.abs(imageQuality.rotation) < 2 },
    { label: 'Entire page visible', passed: imageQuality.crop > 0.9 },
    { label: 'Low noise', passed: imageQuality.noise < 0.3 },
  ];

  return (
    <div className="space-y-3">
      {checks.map((check, index) => (
        <motion.div 
          key={check.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center space-x-3 text-sm"
        >
          <div className={`flex items-center justify-center w-5 h-5 rounded-full ${check.passed ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
            {check.passed ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
          </div>
          <span className={check.passed ? 'text-text-primary' : 'text-danger font-medium'}>
            {check.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
