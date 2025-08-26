import type { Student, UndoAction } from './types';

let students: Student[] = [
  { id: 'S001', name: 'Alice Johnson', age: 22, marks: 88, department: 'Computer Science', status: 'approved' },
  { id: 'S002', name: 'Bob Smith', age: 21, marks: 92, department: 'Mechanical Engineering', status: 'approved' },
  { id: 'S003', name: 'Charlie Brown', age: 23, marks: 76, department: 'Physics', status: 'approved' },
  { id: 'S004', name: 'Diana Miller', age: 20, marks: 95, department: 'Computer Science', status: 'approved' },
  { id: 'S005', name: 'Ethan Williams', age: 22, marks: 81, department: 'Chemistry', status: 'pending' },
  { id: 'S006', name: 'Fiona Davis', age: 21, marks: 89, department: 'Mechanical Engineering', status: 'approved' },
  { id: 'S007', name: 'George Wilson', age: 24, marks: 68, department: 'Physics', status: 'pending' },
];

let undoStack: UndoAction[] = [];

export async function getStudents(): Promise<Student[]> {
  return students;
}

export async function getApprovedStudents(): Promise<Student[]> {
    return students.filter(s => s.status === 'approved');
}

export async function getPendingStudents(): Promise<Student[]> {
    return students.filter(s => s.status === 'pending');
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return students.find((s) => s.id === id);
}

export async function addStudent(student: Student): Promise<Student> {
  students.push(student);
  undoStack.push({ id: crypto.randomUUID(), type: 'ADD', student, timestamp: new Date() });
  return student;
}

export async function updateStudent(id: string, data: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
  const studentIndex = students.findIndex((s) => s.id === id);
  if (studentIndex === -1) return null;

  const previousState = { ...students[studentIndex] };
  students[studentIndex] = { ...students[studentIndex], ...data };
  
  undoStack.push({ id: crypto.randomUUID(), type: 'UPDATE', student: students[studentIndex], previousState, timestamp: new Date() });

  return students[studentIndex];
}

export async function deleteStudent(id: string): Promise<Student | null> {
  const studentIndex = students.findIndex((s) => s.id === id);
  if (studentIndex === -1) return null;

  const [deletedStudent] = students.splice(studentIndex, 1);
  undoStack.push({ id: crypto.randomUUID(), type: 'DELETE', student: deletedStudent, timestamp: new Date() });
  
  return deletedStudent;
}

export async function approveStudent(id: string): Promise<Student | null> {
    const student = await getStudentById(id);
    if (!student) return null;

    student.status = 'approved';
    return student;
}

export async function rejectStudent(id: string): Promise<Student | null> {
    const studentIndex = students.findIndex((s) => s.id === id);
    if (studentIndex === -1) return null;

    const [rejectedStudent] = students.splice(studentIndex, 1);
    return rejectedStudent;
}

export async function getLastUndoAction(): Promise<UndoAction | null> {
    return undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;
}

export async function undoLastAction(): Promise<UndoAction | null> {
    if (undoStack.length === 0) return null;
    
    const lastAction = undoStack.pop();
    if (!lastAction) return null;

    switch (lastAction.type) {
        case 'ADD':
            students = students.filter(s => s.id !== lastAction.student.id);
            break;
        case 'DELETE':
            students.push(lastAction.student);
            break;
        case 'UPDATE':
            const studentIndex = students.findIndex(s => s.id === lastAction.student.id);
            if (studentIndex !== -1 && lastAction.previousState) {
                students[studentIndex] = lastAction.previousState;
            }
            break;
    }

    return lastAction;
}

// --- Report Data ---

export async function getDepartmentPerformance(): Promise<{ department: string; averageMarks: number }[]> {
    const approvedStudents = await getApprovedStudents();
    if (!approvedStudents.length) return [];
    
    const dataByDept = approvedStudents.reduce((acc, student) => {
        if (!acc[student.department]) {
            acc[student.department] = { totalMarks: 0, count: 0 };
        }
        acc[student.department].totalMarks += student.marks;
        acc[student.department].count += 1;
        return acc;
    }, {} as Record<string, { totalMarks: number; count: number }>);

    return Object.entries(dataByDept).map(([department, {totalMarks, count}]) => ({
        department,
        averageMarks: Math.round(totalMarks / count)
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
    const approvedStudents = await getApproved.students();
    if (!approvedStudents.length) return [];
     const bins = [
        { name: '90-100', count: 0 },
        { name: '80-89', count: 0 },
        { name: '70-79', count: 0 },
        { name: '60-69', count: 0 },
        { name: '<60', count: 0 },
     ];
     approvedStudents.forEach(student => {
        if(student.marks >= 90) bins[0].count++;
        else if (student.marks >= 80) bins[1].count++;
        else if (student.marks >= 70) bins[2].count++;
        else if (student.marks >= 60) bins[3].count++;
        else bins[4].count++;
     });
     return bins;
}
