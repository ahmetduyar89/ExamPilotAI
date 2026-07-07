import { useParams, useNavigate } from 'react-router-dom';
import { useIntakeSession, useProcessIntake } from '@/features/intake/hooks';
import { AnimatedGauge } from '@/features/intake/components/AnimatedGauge';
import { QualityChecklist } from '@/features/intake/components/QualityChecklist';
import { StatusIndicator } from '@/features/intake/components/StatusIndicator';
import { WarningCard } from '@/features/intake/components/WarningCard';
import { PageTransition } from '@/components/ui/Transitions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useEffect } from 'react';

export default function Inspector() {
  const { intakeId } = useParams<{ intakeId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading, error } = useIntakeSession(intakeId!);
  const processIntake = useProcessIntake();

  // For testing purposes: if ID is "test", generate a mock session and redirect to it
  useEffect(() => {
    if (intakeId === 'test') {
      processIntake.mutateAsync('test-doc-id').then(mockSession => {
        navigate(`/inspector/${mockSession.id}`, { replace: true });
      });
    }
  }, [intakeId, navigate, processIntake]);

  if (isLoading || intakeId === 'test' || processIntake.isPending) {
    return (
      <PageTransition locationKey="inspector-loading">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-text-secondary">Analyzing document characteristics...</p>
        </div>
      </PageTransition>
    );
  }

  if (error || !session) {
    return (
      <PageTransition locationKey="inspector-error">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-danger" />
          <h2 className="text-2xl font-bold">Report Not Found</h2>
          <p className="text-text-secondary max-w-sm">
            We couldn't locate the intake analysis report.
          </p>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </PageTransition>
    );
  }

  const isLowQuality = session.qualityScore < 70;

  return (
    <PageTransition locationKey="inspector-content">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-text-secondary font-medium">
            Intake Report ID: <span className="font-mono">{session.id.split('-')[0]}</span>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-2">Processing Inspector</h1>
          <p className="text-text-secondary">
            Pre-flight analysis of document characteristics and quality metrics before OCR.
          </p>
        </div>

        {isLowQuality && (
          <WarningCard 
            title="Low Quality Warning" 
            description="This document has a low quality score. OCR results may be degraded. Consider re-uploading a clearer, properly rotated photo."
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Gauges */}
          <Card className="md:col-span-1">
            <CardContent className="p-8 flex flex-col items-center justify-center space-y-8 h-full">
              <AnimatedGauge 
                value={session.qualityScore} 
                label="Quality Score" 
                size={160} 
                strokeWidth={12}
                colorClass={session.qualityScore >= 80 ? "text-success" : session.qualityScore >= 70 ? "text-warning" : "text-danger"}
              />
              <AnimatedGauge 
                value={session.confidence * 100} 
                label="Confidence" 
                size={120} 
                strokeWidth={8}
                colorClass="text-primary"
              />
            </CardContent>
          </Card>

          {/* Details & Checklist */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Classification</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <StatusIndicator type="category" value={session.documentCategory} />
                  <StatusIndicator type="layout" value={session.layout} />
                  <StatusIndicator type="publisher" value={session.publisher} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  <QualityChecklist imageQuality={session.imageQuality} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
