'use server';

import { revalidatePath } from 'next/cache';
import * as data from './data';
import type { Student } from './types';

export async function addStudent(student: Omit<Student, 'status'>) {
    const newStudent: Student = {...student, status: 'approved'};
    const result = await data.addStudent(newStudent);
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
    const result = await data.deleteStudent(id);
    revalidatePath('/students');
    revalidatePath('/reports');
    revalidatePath('/');
    return result;
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
    const result = await data.rejectStudent(id);
    revalidatePath('/approvals');
    return result;
}

export async function undoLastAction() {
    const result = await data.undoLastAction();
    revalidatePath('/');
    revalidatePath('/students');
    revalidatePath('/reports');
    return result;
}
