import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UploadCard } from '@/features/exam/components/UploadCard';
import { UploadProgress } from '@/features/exam/components/UploadProgress';
import { useStudents } from '@/features/student/hooks';
import { useCreateExam } from '@/features/exam/hooks';
import { useStartProcessing } from '@/features/document/hooks';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ExamUpload() {
  const { data: students, isLoading: isLoadingStudents } = useStudents();
  const createExam = useCreateExam();
  const startProcessing = useStartProcessing();
  const navigate = useNavigate();

  const [studentId, setStudentId] = React.useState('');
  const [publisher, setPublisher] = React.useState('');
  const [examName, setExamName] = React.useState('');
  const [examDate, setExamDate] = React.useState('');

  const [selectedFile, setSelectedFile] = React.useState<{ data: string; type: 'image' | 'pdf'; name: string } | null>(null);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [isSuccess, setIsSuccess] = React.useState(false);

  const canUpload = studentId && publisher && examName && examDate;

  const handleFileSelected = async (file: { data: string; type: 'image' | 'pdf'; name: string }) => {
    setUploadError(null);
    setSelectedFile(file);
    setIsSuccess(false);
    
    try {
      const exam = await createExam.mutateAsync({
        studentId,
        publisher,
        examName,
        examDate,
        fileType: file.type,
        imageUrl: file.data, // Storing base64 as mock url
      });
      
      const session = await startProcessing.mutateAsync({
        studentId,
        examId: exam.id,
        originalFile: file.data,
        documentType: file.type === 'pdf' ? 'pdf' : 'scan',
      });
      
      setIsSuccess(true);
      // Navigate to processing screen
      setTimeout(() => {
        navigate(`/processing/${session.id}`);
      }, 1500);
    } catch (err) {
      setUploadError('Failed to upload exam. Please try again.');
      setSelectedFile(null);
    }
  };

  const resetForm = () => {
    setPublisher('');
    setExamName('');
    setExamDate('');
    setSelectedFile(null);
    setIsSuccess(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Upload Exam</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exam Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Student</label>
              <select 
                className="flex h-11 w-full rounded-md border border-border bg-transparent px-3 py-2 text-sm text-text-primary outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-50"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoadingStudents || createExam.isPending}
              >
                <option value="" disabled>Select a student</option>
                {students?.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.grade})</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Publisher</label>
              <Input 
                placeholder="e.g. College Board" 
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                disabled={createExam.isPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Exam Name</label>
              <Input 
                placeholder="e.g. Practice Test 1" 
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                disabled={createExam.isPending || startProcessing.isPending}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Date Taken</label>
              <Input 
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                disabled={createExam.isPending || startProcessing.isPending}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <div className="space-y-6">
          <div className={!canUpload ? 'opacity-50 pointer-events-none' : ''}>
            <h3 className="text-h3 mb-4">Upload Document</h3>
            {!canUpload && (
              <p className="text-sm text-text-secondary mb-4">Please fill in exam details before uploading.</p>
            )}
            
            {!selectedFile && !isSuccess && (
              <UploadCard 
                onFileSelected={handleFileSelected} 
                onError={setUploadError} 
              />
            )}

            {selectedFile && !isSuccess && (
              <UploadProgress 
                fileName={selectedFile.name} 
                isComplete={false} 
              />
            )}

            {isSuccess && selectedFile && (
              <div className="flex flex-col items-center justify-center p-8 bg-success/10 text-success rounded-xl border border-success/20 animate-in zoom-in">
                <CheckCircle2 className="w-16 h-16 mb-4" />
                <h3 className="text-xl font-bold">Upload Successful!</h3>
                <p className="text-sm mt-2 text-center opacity-80">
                  The exam for {students?.find(s => s.id === studentId)?.name} has been securely saved.
                </p>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="flex items-center p-4 bg-danger/10 text-danger rounded-lg text-sm">
              <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
              {uploadError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
