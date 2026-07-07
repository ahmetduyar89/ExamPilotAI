import { Card, CardContent } from '@/components/ui/Card';
import { Camera, Image as ImageIcon, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import { FilePicker } from '@capawesome/capacitor-file-picker';

interface UploadCardProps {
  onFileSelected: (file: { data: string; type: 'image' | 'pdf'; name: string }) => void;
  onError: (error: string) => void;
}

export function UploadCard({ onFileSelected, onError }: UploadCardProps) {
  
  const handleCamera = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
      });

      if (image.base64String) {
        onFileSelected({
          data: `data:image/jpeg;base64,${image.base64String}`,
          type: 'image',
          name: `camera_${Date.now()}.jpg`
        });
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled photos app') {
        onError('Failed to open camera');
      }
    }
  };

  const handleGallery = async () => {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
      });

      if (image.base64String) {
        onFileSelected({
          data: `data:image/jpeg;base64,${image.base64String}`,
          type: 'image',
          name: `gallery_${Date.now()}.jpg`
        });
      }
    } catch (error: any) {
      if (error.message !== 'User cancelled photos app') {
        onError('Failed to open gallery');
      }
    }
  };

  const handlePDF = async () => {
    try {
      const result = await FilePicker.pickFiles({
        types: ['application/pdf'],
        multiple: false,
        readData: true,
      });

      const file = result.files[0];
      if (file && file.data) {
        onFileSelected({
          data: `data:application/pdf;base64,${file.data}`,
          type: 'pdf',
          name: file.name
        });
      }
    } catch (error: any) {
      if (error.message !== 'pickFiles canceled.') {
        onError('Failed to pick PDF');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UploadOption 
        icon={<Camera className="w-8 h-8" />} 
        title="Take Photo" 
        description="Use camera to scan exam" 
        onClick={handleCamera} 
      />
      <UploadOption 
        icon={<ImageIcon className="w-8 h-8" />} 
        title="Photo Library" 
        description="Choose from gallery" 
        onClick={handleGallery} 
      />
      <UploadOption 
        icon={<FileText className="w-8 h-8" />} 
        title="Upload PDF" 
        description="Select a PDF file" 
        onClick={handlePDF} 
      />
    </div>
  );
}

function UploadOption({ icon, title, description, onClick }: { icon: React.ReactNode, title: string, description: string, onClick: () => void }) {
  return (
    <Card variant="action" onClick={onClick} className="h-full">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full min-h-[160px] space-y-3">
        <div className="p-3 bg-secondary rounded-full text-primary">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-text-primary">{title}</h4>
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
