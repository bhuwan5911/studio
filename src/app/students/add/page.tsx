'use client';

import { StudentForm } from '@/components/student-form';
import { useRouter } from 'next/navigation';
import type { Student } from '@/lib/types';
import { addStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


export default function AddStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Student, 'status' | 'averageScore' | 'id'>) => {
    try {
      await addStudent(data);
      toast({ title: "Student Added", description: `${data.name} has been added to the student list.` });
      router.push('/students');
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: "Could not add student. Please try again."})
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}
