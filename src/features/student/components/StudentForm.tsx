import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { studentSchema, StudentFormValues } from '../validators';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Student } from '../types';
import { useEffect } from 'react';

interface StudentFormProps {
  initialData?: Student;
  onSubmit: (data: StudentFormValues) => void;
  isLoading?: boolean;
}

export function StudentForm({ initialData, onSubmit, isLoading }: StudentFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormValues>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      name: '',
      grade: '',
      school: '',
      targetExam: '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        grade: initialData.grade,
        school: initialData.school,
        targetExam: initialData.targetExam,
      });
    } else {
      reset({
        name: '',
        grade: '',
        school: '',
        targetExam: '',
      });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">Name</label>
        <Input 
          {...register('name')} 
          placeholder="e.g. John Doe"
          className={errors.name ? 'border-danger focus-visible:ring-danger' : ''}
        />
        {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Grade</label>
          <Input 
            {...register('grade')} 
            placeholder="e.g. 10th"
            className={errors.grade ? 'border-danger focus-visible:ring-danger' : ''}
          />
          {errors.grade && <p className="text-xs text-danger">{errors.grade.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-text-primary">Target Exam</label>
          <Input 
            {...register('targetExam')} 
            placeholder="e.g. SAT"
            className={errors.targetExam ? 'border-danger focus-visible:ring-danger' : ''}
          />
          {errors.targetExam && <p className="text-xs text-danger">{errors.targetExam.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-text-primary">School</label>
        <Input 
          {...register('school')} 
          placeholder="e.g. Lincoln High School"
          className={errors.school ? 'border-danger focus-visible:ring-danger' : ''}
        />
        {errors.school && <p className="text-xs text-danger">{errors.school.message}</p>}
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit" 
          disabled={isSubmitting || isLoading}
          isLoading={isSubmitting || isLoading}
        >
          {initialData ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </form>
  );
}
