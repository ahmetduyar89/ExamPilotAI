export interface Exam {
  id: string;
  studentId: string;
  publisher: string;
  examName: string;
  examDate: string;
  fileType: 'image' | 'pdf';
  imageUrl: string; // Will store base64 or a local path for now
  status: 'processing' | 'completed' | 'failed';
  createdAt: string;
}

export type CreateExamDTO = Omit<Exam, 'id' | 'createdAt' | 'status'>;
