import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentSession } from '@/features/document/hooks';
import { ProcessingCard } from '@/features/document/components/ProcessingCard';
import { Button } from '@/components/ui/Button';
import { Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { PageTransition } from '@/components/ui/Transitions';

export default function Processing() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();

  const { data: session, isLoading, error } = useDocumentSession(sessionId!);

  if (isLoading) {
    return (
      <PageTransition locationKey="processing-loading">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-text-secondary">Locating session...</p>
        </div>
      </PageTransition>
    );
  }

  if (error || !session) {
    return (
      <PageTransition locationKey="processing-error">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center">
          <AlertCircle className="w-12 h-12 text-danger" />
          <h2 className="text-2xl font-bold">Session Not Found</h2>
          <p className="text-text-secondary max-w-sm">
            We couldn't find the requested document processing session.
          </p>
          <Button variant="outline" onClick={() => navigate('/dashboard')} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </PageTransition>
    );
  }

  const isTerminal = session.status === 'ready_for_ai' || session.status === 'failed';

  return (
    <PageTransition locationKey="processing-content">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Dashboard
          </Button>
          {isTerminal && (
            <Button variant="primary" onClick={() => navigate(`/students`)}>
              View Results
            </Button>
          )}
        </div>

        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Document Processing</h1>
          <p className="text-text-secondary">
            {isTerminal 
              ? "Processing complete." 
              : "Please wait while we process the document through our pipeline."}
          </p>
        </div>

        <ProcessingCard session={session} />
        
        {session.status === 'failed' && session.errorMessage && (
          <div className="max-w-md mx-auto p-4 bg-danger/10 border border-danger/20 rounded-lg text-danger text-sm text-center">
            {session.errorMessage}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
