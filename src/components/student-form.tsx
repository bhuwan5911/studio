'use client';

import { useForm, useFieldArray, Controller } from 'react-hook-form';
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
import { PlusCircle, Trash2, ArrowLeft } from 'lucide-react';
import { ImageUpload } from '@/components/image-upload';
import { useRouter } from 'next/navigation';

const subjectSchema = z.object({
  name: z.string().min(2, 'Subject name is required'),
  score: z.coerce.number().min(0, 'Score must be 0-100').max(100, 'Score must be 0-100'),
});

const studentSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: z.string().min(3, 'Name must be at least 3 characters'),
  age: z.coerce.number().min(16, 'Age must be at least 16').max(100, 'Age seems too high'),
  department: z.string().min(2, 'Department is required'),
  subjects: z.array(subjectSchema).min(1, 'At least one subject is required'),
  avatar: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

interface StudentFormProps {
  onSubmit: (data: Omit<Student, 'status' | 'averageScore'> & {subjects: {name: string, score: number}[]}) => void;
  defaultValues?: Partial<Student>;
  isEditMode?: boolean;
}

export function StudentForm({ onSubmit, defaultValues, isEditMode = false }: StudentFormProps) {
  const router = useRouter();
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      id: defaultValues?.id || '',
      name: defaultValues?.name || '',
      age: defaultValues?.age || 0,
      department: defaultValues?.department || '',
      subjects: defaultValues?.subjects || [{ name: '', score: 0 }],
      avatar: defaultValues?.avatar || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subjects",
  });

  const handleFormSubmit = (data: StudentFormData) => {
    onSubmit(data);
  };

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
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Student Avatar</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            
            <div>
              <FormLabel>Subjects & Scores</FormLabel>
              <div className="space-y-4 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                    <div className="grid grid-cols-2 gap-4 flex-grow">
                       <FormField
                          control={form.control}
                          name={`subjects.${index}.name`}
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
                          name={`subjects.${index}.score`}
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
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                 {form.formState.errors.subjects && !form.formState.errors.subjects.root && (
                    <p className="text-sm font-medium text-destructive">{form.formState.errors.subjects.message}</p>
                 )}
                 <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => append({ name: '', score: 0 })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Subject
                  </Button>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full sm:w-auto">
                  {isEditMode ? 'Update Student' : 'Add Student'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="w-full sm:w-auto">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
