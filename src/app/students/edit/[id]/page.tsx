import { StudentForm } from '@/components/student-form';
import type { Student } from '@/lib/types';
import { getStudentById } from '@/lib/data';
import { EditStudentForm } from '@/components/edit-student-form';

export default async function EditStudentPage({ params }: { params: { id: string } }) {
  const student = await getStudentById(params.id);

  if (!student) {
    return <div className="text-center">Student not found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <EditStudentForm student={student} />
    </div>
  );
}
