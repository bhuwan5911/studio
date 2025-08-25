'use client';

import * as React from 'react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, PlusCircle, ArrowUpDown, Edit, Trash2, Users } from 'lucide-react';
import { useStudentStore } from '@/hooks/use-student-store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeleteStudentDialog } from '@/components/delete-student-dialog';
import type { Student } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';


type SortKey = keyof Student;
type SortDirection = 'asc' | 'desc';

export default function StudentsPage() {
  const { students, dispatch } = useStudentStore();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'name', direction: 'asc' });

  const approvedStudents = students.filter(s => s.status === 'approved');

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...approvedStudents];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [approvedStudents, sortConfig]);

  const filteredStudents = sortedStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    dispatch({ type: 'DELETE_STUDENT', payload: id });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">Manage all student records.</p>
        </div>
        <Button asChild>
          <Link href="/students/add">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
           <CardTitle>Student List</CardTitle>
            <CardDescription>A list of all approved students in the system.</CardDescription>
             <div className="py-4">
              <Input
                placeholder="Filter by name or ID..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="max-w-sm"
              />
            </div>
        </CardHeader>
        <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('name')}>
                        Name <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Age</TableHead>
                    <TableHead>
                      <Button variant="ghost" onClick={() => handleSort('marks')}>
                        Marks <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell><Badge variant="secondary">{student.id}</Badge></TableCell>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.age}</TableCell>
                        <TableCell>{student.marks}</TableCell>
                        <TableCell>{student.department}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => router.push(`/students/edit/${student.id}`)}>
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DeleteStudentDialog
                                onConfirm={() => handleDelete(student.id)}
                                trigger={
                                  <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-destructive hover:!bg-destructive/10">
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </div>
                                }
                              />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <Users className="h-12 w-12 text-muted-foreground" />
                            <div className="space-y-1">
                                <h3 className="font-semibold">No students found</h3>
                                <p className="text-sm text-muted-foreground">
                                    There are no approved students to display.
                                </p>
                            </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
