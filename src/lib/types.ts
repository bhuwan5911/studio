export type SubjectScore = {
  name: string;
  score: number;
};

export type Student = {
  id: string;
  name: string;
  age: number;
  department: string;
  subjects: SubjectScore[];
  averageScore: number;
  status: 'approved' | 'pending';
};

export type UndoAction = {
  id: string;
  type: 'ADD' | 'UPDATE' | 'DELETE';
  student: Student;
  previousState?: Student;
  timestamp: Date;
};
