'use client';

import { StudentForm } from '@/components/student-form';
import { useStudentStore } from '@/hooks/use-student-store';
import { useRouter } from 'next/navigation';
import type { Student } from '@/lib/types';

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const { students, dispatch } = useStudentStore();
  const router = useRouter();
  
  const student = students.find((s) => s.id === params.id);

  if (!student) {
    return <div className="text-center">Student not found.</div>;
  }

  const handleSubmit = (data: Omit<Student, 'status'>) => {
    dispatch({ type: 'UPDATE_STUDENT', payload: { ...data, status: 'approved' } });
    router.push('/students');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StudentForm
        onSubmit={handleSubmit}
        defaultValues={student}
        isEditMode={true}
      />
    </div>
  );
}
