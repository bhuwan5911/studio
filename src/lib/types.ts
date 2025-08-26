export type Student = {
  id: string;
  name: string;
  age: number;
  subject: string;
  score: number;
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
