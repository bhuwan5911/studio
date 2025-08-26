'use client';

import { StudentForm } from '@/components/student-form';
import { useRouter } from 'next/navigation';
import type { Student } from '@/lib/types';
import { addStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


export default function AddStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Student, 'status'>) => {
    await addStudent({ ...data, status: 'pending' });
    toast({ title: "Student Added", description: `${data.name} is waiting for approval.` });
    router.push('/approvals');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}
