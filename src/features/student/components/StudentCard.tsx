import { Student } from '../types';
import { Card, CardContent } from '@/components/ui/Card';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';

interface StudentCardProps {
  student: Student;
  onClick?: (student: Student) => void;
}

export function StudentCard({ student, onClick }: StudentCardProps) {
  return (
    <Card 
      variant="action" 
      onClick={() => onClick?.(student)}
    >
      <CardContent className="p-4 sm:p-6 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-h3">{student.name}</h3>
            <p className="text-sm text-text-secondary flex items-center mt-1">
              <GraduationCap className="w-4 h-4 mr-1" />
              Grade {student.grade}
            </p>
          </div>
          <Badge variant="neutral">{student.targetExam}</Badge>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-text-secondary">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate max-w-[120px]">{student.school}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Joined {new Date(student.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
