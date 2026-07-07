import { AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface WarningCardProps {
  title: string;
  description: string;
}

export function WarningCard({ title, description }: WarningCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="p-5 rounded-xl border border-warning/30 bg-warning/10 text-warning-foreground relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <AlertCircle className="w-24 h-24 transform translate-x-1/4 -translate-y-1/4" />
      </div>
      <div className="relative z-10 flex items-start">
        <AlertCircle className="w-5 h-5 text-warning mr-3 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-warning">{title}</h4>
          <p className="text-sm mt-1 opacity-90">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}
