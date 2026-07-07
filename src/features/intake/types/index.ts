export type DocumentCategory = 'exam_report' | 'answer_sheet' | 'score_report' | 'unknown';
export type Publisher = 'unknown';
export type Layout = 'single_column' | 'double_column' | 'table' | 'mixed';

export interface ImageQuality {
  blur: number; // 0 to 1
  brightness: number; // 0 to 1
  contrast: number; // 0 to 1
  rotation: number; // Degrees
  crop: number; // 0 to 1
  noise: number; // 0 to 1
}

export interface IntakeSession {
  id: string;
  documentSessionId: string;
  publisher: Publisher;
  layout: Layout;
  documentCategory: DocumentCategory;
  qualityScore: number; // 0 to 100
  imageQuality: ImageQuality;
  confidence: number; // 0 to 1
  createdAt: string;
}

export type CreateIntakeDTO = Pick<IntakeSession, 'documentSessionId'>;
