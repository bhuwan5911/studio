import type { Student, UndoAction } from './types';
import { db } from './db';

export async function getStudents(): Promise<Student[]> {
  return db.students;
}

export async function getApprovedStudents(): Promise<Student[]> {
    return db.students.filter(s => s.status === 'approved');
}

export async function getPendingStudents(): Promise<Student[]> {
    return db.students.filter(s => s.status === 'pending');
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return db.students.find((s) => s.id === id);
}

export async function addStudent(student: Student): Promise<Student> {
  db.students.unshift(student);
  db.undoStack.push({ id: crypto.randomUUID(), type: 'ADD', student, timestamp: new Date() });
  return student;
}

export async function updateStudent(id: string, data: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
  const studentIndex = db.students.findIndex((s) => s.id === id);
  if (studentIndex === -1) return null;

  const previousState = { ...db.students[studentIndex] };
  db.students[studentIndex] = { ...db.students[studentIndex], ...data };
  
  db.undoStack.push({ id: crypto.randomUUID(), type: 'UPDATE', student: db.students[studentIndex], previousState, timestamp: new Date() });

  return db.students[studentIndex];
}

export async function deleteStudent(id: string): Promise<Student | null> {
  const studentIndex = db.students.findIndex((s) => s.id === id);
  if (studentIndex === -1) return null;

  const [deletedStudent] = db.students.splice(studentIndex, 1);
  db.undoStack.push({ id: crypto.randomUUID(), type: 'DELETE', student: deletedStudent, timestamp: new Date() });
  
  return deletedStudent;
}

export async function approveStudent(id: string): Promise<Student | null> {
    const student = await getStudentById(id);
    if (!student) return null;

    student.status = 'approved';
    return student;
}

export async function rejectStudent(id: string): Promise<Student | null> {
    const studentIndex = db.students.findIndex((s) => s.id === id);
    if (studentIndex === -1) return null;

    const [rejectedStudent] = db.students.splice(studentIndex, 1);
    return rejectedStudent;
}

export async function getLastUndoAction(): Promise<UndoAction | null> {
    return db.undoStack.length > 0 ? db.undoStack[db.undoStack.length - 1] : null;
}

export async function undoLastAction(): Promise<UndoAction | null> {
    if (db.undoStack.length === 0) return null;
    
    const lastAction = db.undoStack.pop();
    if (!lastAction) return null;

    switch (lastAction.type) {
        case 'ADD':
            db.students = db.students.filter(s => s.id !== lastAction.student.id);
            break;
        case 'DELETE':
            db.students.unshift(lastAction.student);
            break;
        case 'UPDATE':
            const studentIndex = db.students.findIndex(s => s.id === lastAction.student.id);
            if (studentIndex !== -1 && lastAction.previousState) {
                db.students[studentIndex] = lastAction.previousState;
            }
            break;
    }

    return lastAction;
}

// --- Report Data ---

export async function getDepartmentPerformance(): Promise<{ department: string; averageScore: number }[]> {
    const approvedStudents = await getApprovedStudents();
    if (!approvedStudents.length) return [];
    
    const dataByDept = approvedStudents.reduce((acc, student) => {
        if (!acc[student.department]) {
            acc[student.department] = { totalScore: 0, count: 0 };
        }
        acc[student.department].totalScore += student.averageScore;
        acc[student.department].count += 1;
        return acc;
    }, {} as Record<string, { totalScore: number; count: number }>);

    return Object.entries(dataByDept).map(([department, {totalScore, count}]) => ({
        department,
        averageScore: Math.round(totalScore / count)
    }));
}

export async function getStudentDistribution(): Promise<{ name: string; value: number }[]> {
    const approvedStudents = await getApprovedStudents();
    if (!approvedStudents.length) return [];
    
    const dataByDept = approvedStudents.reduce((acc, student) => {
        if (!acc[student.department]) {
            acc[student.department] = 0;
        }
        acc[student.department]++;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(dataByDept).map(([name, value]) => ({
        name,
        value,
    }));
}

export async function getMarksDistribution(): Promise<{ name: string; count: number }[]> {
    const approvedStudents = await getApprovedStudents();
    if (!approvedStudents.length) return [];
     const bins = [
        { name: '90-100', count: 0 },
        { name: '80-89', count: 0 },
        { name: '70-79', count: 0 },
        { name: '60-69', count: 0 },
        { name: '<60', count: 0 },
     ];
     approvedStudents.forEach(student => {
        if(student.averageScore >= 90) bins[0].count++;
        else if (student.averageScore >= 80) bins[1].count++;
        else if (student.averageScore >= 70) bins[2].count++;
        else if (student.averageScore >= 60) bins[3].count++;
        else bins[4].count++;
     });
     return bins;
}
