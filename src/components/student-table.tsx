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
import { MoreHorizontal, ArrowUpDown, Edit, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DeleteStudentDialog } from '@/components/delete-student-dialog';
import type { Student } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { deleteStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';

type SortKey = keyof Student;
type SortDirection = 'asc' | 'desc';

const StudentTableRow = React.memo(({ student, onDelete, onEdit, isSelected, onSelectionChange }: { student: Student; onDelete: (id: string) => void; onEdit: (id: string) => void; isSelected: boolean; onSelectionChange: (id: string, checked: boolean) => void; }) => (
    <TableRow data-state={isSelected ? "selected" : ""}>
        <TableCell>
            <Checkbox
                checked={isSelected}
                onCheckedChange={(checked) => onSelectionChange(student.id, !!checked)}
                aria-label="Select row"
            />
        </TableCell>
        <TableCell className="hidden md:table-cell"><Badge variant="secondary">{student.id}</Badge></TableCell>
        <TableCell className="font-medium">{student.name}</TableCell>
        <TableCell className="hidden sm:table-cell">{student.age}</TableCell>
        <TableCell className="hidden md:table-cell">{student.department}</TableCell>
        <TableCell className="hidden md:table-cell">{student.subject}</TableCell>
        <TableCell>{student.score}</TableCell>
        <TableCell>
            <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(student.id)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DeleteStudentDialog
                    onConfirm={() => onDelete(student.id)}
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
));
StudentTableRow.displayName = 'StudentTableRow';

const ITEMS_PER_PAGE = 10;

export function StudentTable({ students, isPaginated }: { students: Student[], isPaginated?: boolean }) {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<{ key: SortKey; direction: SortDirection } | null>({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedRows, setSelectedRows] = React.useState<Record<string, boolean>>({});

  const handleSort = (key: SortKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedStudents = React.useMemo(() => {
    let sortableItems = [...students];
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
  }, [students, sortConfig]);

  const filteredStudents = sortedStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const paginatedStudents = isPaginated ? filteredStudents.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE) : filteredStudents;
  const totalPages = isPaginated ? Math.ceil(filteredStudents.length / ITEMS_PER_PAGE) : 1;
  
  const numSelected = Object.values(selectedRows).filter(Boolean).length;

  const handleSelectAll = (checked: boolean) => {
    const newSelectedRows: Record<string, boolean> = {};
    if(checked) {
        paginatedStudents.forEach(student => {
            newSelectedRows[student.id] = true;
        });
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectionChange = (id: string, checked: boolean) => {
    setSelectedRows(prev => ({...prev, [id]: checked}));
  };

  const handleDelete = React.useCallback(async (id: string) => {
    await deleteStudent(id);
    setSelectedRows(prev => {
        const newSelection = {...prev};
        delete newSelection[id];
        return newSelection;
    })
    toast({ title: "Student Deleted", description: "The student has been removed." });
  }, [toast]);

  const handleBulkDelete = async () => {
      const idsToDelete = Object.keys(selectedRows).filter(id => selectedRows[id]);
      await Promise.all(idsToDelete.map(id => deleteStudent(id)));
      setSelectedRows({});
      toast({ title: `${idsToDelete.length} Students Deleted`, description: "The selected students have been removed." });
  };

  const handleEdit = React.useCallback((id: string) => {
    router.push(`/students/edit/${id}`);
  }, [router]);

  React.useEffect(() => {
    setSelectedRows({});
  }, [searchTerm, currentPage]);

  return (
    <div className="space-y-4">
        <div className="flex items-center justify-between py-4">
          <Input
            placeholder="Filter by name, department, subject, or ID..."
            value={searchTerm}
            onChange={(event) => {
                setSearchTerm(event.target.value)
                setCurrentPage(1);
            }}
            className="max-w-sm"
          />
           {numSelected > 0 && (
            <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{numSelected} selected</span>
                <DeleteStudentDialog 
                    onConfirm={handleBulkDelete}
                    trigger={
                         <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete ({numSelected})
                        </Button>
                    } 
                />
            </div>
          )}
        </div>
        <div className="rounded-md border">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead padding="checkbox">
                    <Checkbox
                        checked={numSelected > 0 && numSelected === paginatedStudents.length && paginatedStudents.length > 0}
                        onCheckedChange={(checked) => handleSelectAll(!!checked)}
                        aria-label="Select all"
                    />
                </TableHead>
                <TableHead className="hidden md:table-cell">ID</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('name')}>
                    Name <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead className="hidden sm:table-cell">Age</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('score')}>
                    Score <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                </TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {paginatedStudents.length > 0 ? (
                paginatedStudents.map((student) => (
                    <StudentTableRow 
                        key={student.id} 
                        student={student} 
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isSelected={!!selectedRows[student.id]}
                        onSelectionChange={handleSelectionChange}
                    />
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={8} className="h-48 text-center">
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
         {isPaginated && totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </span>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        )}
    </div>
  );
}
