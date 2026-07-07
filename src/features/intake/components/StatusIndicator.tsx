import { Badge } from '@/components/ui/Badge';
import { LayoutDashboard, FileText, Building } from 'lucide-react';

export function StatusIndicator({ type, value }: { type: 'layout' | 'category' | 'publisher', value: string }) {
  const getProps = () => {
    switch (type) {
      case 'layout': return { icon: <LayoutDashboard className="w-3.5 h-3.5 mr-1.5" />, variant: 'neutral' as const };
      case 'category': return { icon: <FileText className="w-3.5 h-3.5 mr-1.5" />, variant: 'primary' as const };
      case 'publisher': return { icon: <Building className="w-3.5 h-3.5 mr-1.5" />, variant: 'secondary' as const };
    }
  };

  const { icon, variant } = getProps();
  const formattedValue = value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <Badge variant={variant} className="px-3 py-1.5">
      <div className="flex items-center">
        {icon}
        <span>{formattedValue}</span>
      </div>
    </Badge>
  );
}
