'use server';

import { revalidatePath } from 'next/cache';
import * as data from './data';
import type { Student } from './types';

// The actions now call the updated data functions which hit the API backend.
// The revalidation logic remains the same to tell Next.js to refresh the UI.

export async function addStudent(student: Omit<Student, 'status' | 'id' | 'averageScore'>) {
    // The backend will handle setting the ID, average score, and initial status
    const result = await data.addStudent(student);
    revalidatePath('/students');
    revalidatePath('/reports');
    revalidatePath('/');
    return result;
}

export async function updateStudent(id: string, studentData: Partial<Omit<Student, 'id'>>) {
    const result = await data.updateStudent(id, studentData);
    revalidatePath('/students');
    revalidatePath(`/students/edit/${id}`);
    revalidatePath('/reports');
    revalidatePath('/');
    return result;
}

export async function deleteStudent(id: string) {
    await data.deleteStudent(id);
    revalidatePath('/students');
    revalidatePath('/reports');
    revalidatePath('/');
}

export async function approveStudent(id: string) {
    const result = await data.approveStudent(id);
    revalidatePath('/approvals');
    revalidatePath('/students');
    revalidatePath('/reports');
    revalidatePath('/');
    return result;
}

export async function rejectStudent(id: string) {
    await data.rejectStudent(id);
    revalidatePath('/approvals');
}

export async function undoLastAction() {
    // This functionality is now disabled as it requires a complex backend implementation
    // const result = await data.undoLastAction();
    revalidatePath('/');
    revalidatePath('/students');
    revalidatePath('/reports');
    // return result;
}
