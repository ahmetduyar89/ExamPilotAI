import { motion } from 'framer-motion';

interface AnimatedGaugeProps {
  value: number; // 0 to 100
  label: string;
  size?: number;
  strokeWidth?: number;
  colorClass?: string; // Tailwind text color class, e.g. text-success
}

export function AnimatedGauge({ 
  value, 
  label, 
  size = 120, 
  strokeWidth = 8, 
  colorClass = "text-primary" 
}: AnimatedGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-secondary fill-none"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={`fill-none stroke-current ${colorClass}`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: "easeOut", type: "spring", bounce: 0.2 }}
          style={{ strokeDasharray: circumference }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-2xl font-bold text-text-primary"
        >
          {Math.round(value)}
        </motion.span>
        <span className="text-[10px] uppercase font-semibold text-text-secondary tracking-wider mt-0.5">{label}</span>
      </div>
    </div>
  );
}
