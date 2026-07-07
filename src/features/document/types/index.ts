export type ProcessingStatus = 
  | 'uploaded'
  | 'processing'
  | 'optimized'
  | 'classified'
  | 'ocr_pending'
  | 'ocr_completed'
  | 'parsed'
  | 'validated'
  | 'ready_for_ai'
  | 'failed';

export type DocumentType = 'pdf' | 'photo' | 'scan';
export type PublisherType = 'unknown' | 'college_board' | 'act' | string;

export interface DocumentSession {
  id: string;
  studentId: string;
  examId: string;
  status: ProcessingStatus;
  createdAt: string;
  updatedAt: string;
  originalFile: string; // url or base64
  processedFile?: string;
  documentType: DocumentType;
  publisher: PublisherType;
  confidence: number; // 0 to 1
  errorMessage?: string;
}

export type CreateSessionDTO = Pick<DocumentSession, 'studentId' | 'examId' | 'originalFile' | 'documentType'>;
