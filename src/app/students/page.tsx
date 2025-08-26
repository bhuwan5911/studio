import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getApprovedStudents } from '@/lib/data';
import { StudentTable } from '@/components/student-table';

export default async function StudentsPage() {
  const approvedStudents = await getApprovedStudents();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage all student records.</p>
        </div>
        <Button asChild className="animate-pulse-subtle">
          <Link href="/students/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Student List</CardTitle>
           <CardDescription>A list of all approved students in the system.</CardDescription>
        </CardHeader>
        <CardContent>
            <StudentTable students={approvedStudents} isPaginated={true} />
        </CardContent>
      </Card>
    </div>
  );
}
