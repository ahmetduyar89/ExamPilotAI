import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Timeline } from './Timeline';
import { StatusBadge } from './StatusBadge';
import { DocumentSession } from '../types';

interface ProcessingCardProps {
  session: DocumentSession;
}

export function ProcessingCard({ session }: ProcessingCardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Document Pipeline</CardTitle>
        <StatusBadge status={session.status} />
      </CardHeader>
      <CardContent className="pt-6 pb-8 px-8">
        <Timeline currentStatus={session.status} />
      </CardContent>
    </Card>
  );
}
