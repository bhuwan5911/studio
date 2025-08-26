'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Student } from '@/lib/types';

const studentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.coerce.number().min(16, 'Age must be at least 16').max(100, 'Age seems too high'),
  subject: z.string().min(2, 'Subject is required'),
  score: z.coerce.number().min(0, 'Score must be between 0 and 100').max(100, 'Score must be between 0 and 100'),
  department: z.string().min(2, 'Department is required'),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSubmit: (data: StudentFormData) => void;
  defaultValues?: Partial<Student>;
  isEditMode?: boolean;
}

export function StudentForm({ onSubmit, defaultValues, isEditMode = false }: StudentFormProps) {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id: defaultValues?.id || '',
      name: defaultValues?.name || '',
      age: defaultValues?.age || 0,
      subject: defaultValues?.subject || '',
      score: defaultValues?.score || 0,
      department: defaultValues?.department || '',
    },
  });

  return (
    <Card>
       <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Student' : 'Add New Student'}</CardTitle>
        <CardDescription>
          {isEditMode ? "Update the student's information below." : 'Fill in the details to add a new student.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., S001" {...field} disabled={isEditMode} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 21" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                 <FormField
                    control={form.control}
                    name="department"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Department</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g., Computer Science" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Mathematics" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 85" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <Button type="submit" className="w-full md:w-auto">
              {isEditMode ? 'Update Student' : 'Add Student'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
