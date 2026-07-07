import { DocumentCategory, ImageQuality, Layout, Publisher, IntakeSession } from '../types';

const ImageQualityAnalyzer = {
  analyze: async (): Promise<ImageQuality> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return {
      blur: Math.random() * 0.3, // Mostly sharp
      brightness: 0.6 + Math.random() * 0.4, // Good brightness
      contrast: 0.7 + Math.random() * 0.3, // Good contrast
      rotation: Math.random() > 0.8 ? (Math.random() * 10 - 5) : 0, // Slight rotation sometimes
      crop: 0.95 + Math.random() * 0.05, // Mostly full page
      noise: Math.random() * 0.2, // Low noise
    };
  }
};

const LayoutAnalyzer = {
  analyze: async (): Promise<Layout> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const layouts: Layout[] = ['single_column', 'double_column', 'table', 'mixed'];
    return layouts[Math.floor(Math.random() * layouts.length)];
  }
};

const PublisherDetector = {
  detect: async (): Promise<Publisher> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return 'unknown';
  }
};

const DocumentClassifier = {
  classify: async (): Promise<DocumentCategory> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const categories: DocumentCategory[] = ['exam_report', 'answer_sheet', 'score_report', 'unknown'];
    return categories[Math.floor(Math.random() * (categories.length - 1))]; // Bias towards known
  }
};

export const IntakeService = {
  processDocument: async (documentSessionId: string): Promise<IntakeSession> => {
    const [imageQuality, layout, publisher, documentCategory] = await Promise.all([
      ImageQualityAnalyzer.analyze(),
      LayoutAnalyzer.analyze(),
      PublisherDetector.detect(),
      DocumentClassifier.classify(),
    ]);

    // Calculate a mock overall quality score based on image metrics
    // Ideal: blur=0, brightness=1, contrast=1, rotation=0, crop=1, noise=0
    const score = 100 - (
      (imageQuality.blur * 20) + 
      ((1 - imageQuality.brightness) * 15) + 
      ((1 - imageQuality.contrast) * 15) + 
      (Math.abs(imageQuality.rotation) * 2) + 
      ((1 - imageQuality.crop) * 20) + 
      (imageQuality.noise * 20)
    );

    return {
      id: crypto.randomUUID(),
      documentSessionId,
      publisher,
      layout,
      documentCategory,
      qualityScore: Math.max(0, Math.min(100, Math.round(score))),
      imageQuality,
      confidence: 0.85 + (Math.random() * 0.15),
      createdAt: new Date().toISOString(),
    };
  }
};
