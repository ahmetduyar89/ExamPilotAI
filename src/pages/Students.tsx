import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Modal } from '@/components/ui/Modal';
import { Loader2, Users, AlertCircle } from 'lucide-react';

import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/features/student/hooks';
import { StudentCard } from '@/features/student/components/StudentCard';
import { StudentForm } from '@/features/student/components/StudentForm';
import { Student } from '@/features/student/types';

export default function Students() {
  const { data: students, isLoading, error } = useStudents();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();

  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [selectedStudent, setSelectedStudent] = React.useState<Student | undefined>(undefined);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);

  const handleOpenCreate = () => {
    setSelectedStudent(undefined);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (selectedStudent) {
        await updateStudent.mutateAsync({ id: selectedStudent.id, data });
      } else {
        await createStudent.mutateAsync(data);
      }
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to save student', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedStudent) return;
    try {
      await deleteStudent.mutateAsync(selectedStudent.id);
      setIsDeleteModalOpen(false);
      setIsFormOpen(false);
    } catch (err) {
      console.error('Failed to delete student', err);
    }
  };

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center text-danger">
        <AlertCircle className="mr-2 h-5 w-5" />
        Failed to load students.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Students</h1>
        <Button onClick={handleOpenCreate}>Add Student</Button>
      </div>

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : !students || students.length === 0 ? (
        <EmptyState
          icon={<Users />}
          title="No students yet"
          description="Add your first student to start tracking their progress and uploading exams."
          action={<Button onClick={handleOpenCreate}>Add Student</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onClick={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isFormOpen && !isDeleteModalOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedStudent ? 'Edit Student' : 'Add Student'}
      >
        <StudentForm
          initialData={selectedStudent}
          onSubmit={handleFormSubmit}
          isLoading={createStudent.isPending || updateStudent.isPending}
        />
        {selectedStudent && (
          <div className="mt-6 border-t border-border pt-4">
            <Button
              variant="danger"
              className="w-full"
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete Student
            </Button>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p className="text-body text-text-secondary">
            Are you sure you want to delete <strong>{selectedStudent?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              isLoading={deleteStudent.isPending}
            >
              Yes, delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
