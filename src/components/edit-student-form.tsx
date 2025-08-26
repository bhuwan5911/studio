'use client';

import { StudentForm } from '@/components/student-form';
import { useRouter } from 'next/navigation';
import type { Student } from '@/lib/types';
import { updateStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function EditStudentForm({ student }: { student: Student }) {
    const router = useRouter();
    const { toast } = useToast();

    const handleSubmit = async (data: Omit<Student, 'status'>) => {
        await updateStudent(student.id, { ...data, status: 'approved' });
        toast({ title: "Student Updated", description: `${data.name}'s details were updated.` });
        router.push('/students');
    };

    return (
        <StudentForm
            onSubmit={handleSubmit}
            defaultValues={student}
            isEditMode={true}
        />
    );
}
