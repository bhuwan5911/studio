export type Student = {
  id: string;
  name: string;
  age: number;
  marks: number;
  department: string;
  status: 'approved' | 'pending';
};

export type UndoAction = {
  id: string;
  type: 'ADD' | 'UPDATE' | 'DELETE';
  student: Student;
  previousState?: Student;
  timestamp: Date;
};
