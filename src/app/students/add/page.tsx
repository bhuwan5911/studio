'use client';

import { StudentForm } from '@/components/student-form';
import { useRouter } from 'next/navigation';
import type { Student } from '@/lib/types';
import { addStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


export default function AddStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (data: Omit<Student, 'status' | 'averageScore'>) => {
    const totalScore = data.subjects.reduce((acc, s) => acc + s.score, 0);
    const averageScore = data.subjects.length > 0 ? Math.round(totalScore / data.subjects.length) : 0;
    
    await addStudent({ ...data, averageScore, status: 'approved' });

    toast({ title: "Student Added", description: `${data.name} has been added to the student list.` });
    router.push('/students');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <StudentForm onSubmit={handleSubmit} />
    </div>
  );
}
