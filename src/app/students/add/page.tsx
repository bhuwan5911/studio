'use client';

import { StudentForm } from '@/components/student-form';
import { useStudentStore } from '@/hooks/use-student-store';
import { useRouter } from 'next/navigation';
import type { Student } from '@/lib/types';

export default function AddStudentPage() {
  const { dispatch } = useStudentStore();
  const router = useRouter();

  const handleSubmit = (data: Omit<Student, 'status'>) => {
    dispatch({ type: 'ADD_STUDENT', payload: { ...data, status: 'pending' } });
    router.push('/approvals');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}
