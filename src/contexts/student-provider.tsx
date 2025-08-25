'use client';

import type { Student, UndoAction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import React, { createContext, useReducer, ReactNode } from 'react';

type State = {
  students: Student[];
  pendingStudents: Student[];
  undoStack: UndoAction[];
};

type Action =
  | { type: 'ADD_STUDENT'; payload: Student }
  | { type: 'UPDATE_STUDENT'; payload: Student }
  | { type: 'DELETE_STUDENT'; payload: string }
  | { type: 'APPROVE_STUDENT'; payload: string }
  | { type: 'REJECT_STUDENT'; payload: string }
  | { type: 'UNDO_LAST_ACTION' };

const initialState: State = {
  students: [
    { id: 'S001', name: 'Alice Johnson', age: 22, marks: 88, department: 'Computer Science', status: 'approved' },
    { id: 'S002', name: 'Bob Smith', age: 21, marks: 92, department: 'Physics', status: 'approved' },
    { id: 'S003', name: 'Charlie Brown', age: 23, marks: 76, department: 'Mathematics', status: 'approved' },
  ],
  pendingStudents: [
     { id: 'S004', name: 'Diana Prince', age: 20, marks: 95, department: 'History', status: 'pending' },
  ],
  undoStack: [],
};

const studentReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_STUDENT': {
      const newStudent = { ...action.payload, status: 'pending' as const };
      return {
        ...state,
        pendingStudents: [...state.pendingStudents, newStudent],
        undoStack: [
          ...state.undoStack,
          { id: crypto.randomUUID(), type: 'ADD', student: newStudent, timestamp: new Date() },
        ],
      };
    }
    case 'UPDATE_STUDENT': {
        const studentToUpdate = state.students.find(s => s.id === action.payload.id);
        return {
            ...state,
            students: state.students.map(s => (s.id === action.payload.id ? action.payload : s)),
            undoStack: [
            ...state.undoStack,
            { id: crypto.randomUUID(), type: 'UPDATE', student: action.payload, previousState: studentToUpdate, timestamp: new Date() },
            ],
      };
    }
    case 'DELETE_STUDENT': {
      const studentToDelete = state.students.find(s => s.id === action.payload);
      if (!studentToDelete) return state;
      return {
        ...state,
        students: state.students.filter(s => s.id !== action.payload),
        undoStack: [
          ...state.undoStack,
          { id: crypto.randomUUID(), type: 'DELETE', student: studentToDelete, timestamp: new Date() },
        ],
      };
    }
    case 'APPROVE_STUDENT': {
      const studentToApprove = state.pendingStudents.find(s => s.id === action.payload);
      if (!studentToApprove) return state;
      return {
        ...state,
        students: [...state.students, { ...studentToApprove, status: 'approved' }],
        pendingStudents: state.pendingStudents.filter(s => s.id !== action.payload),
      };
    }
    case 'REJECT_STUDENT': {
      return {
        ...state,
        pendingStudents: state.pendingStudents.filter(s => s.id !== action.payload),
      };
    }
    case 'UNDO_LAST_ACTION': {
      if (state.undoStack.length === 0) return state;
      const lastAction = state.undoStack[state.undoStack.length - 1];
      const newStack = state.undoStack.slice(0, -1);
      switch (lastAction.type) {
        case 'ADD':
          return {
            ...state,
            pendingStudents: state.pendingStudents.filter(s => s.id !== lastAction.student.id),
            undoStack: newStack,
          };
        case 'DELETE':
          return {
            ...state,
            students: [...state.students, lastAction.student],
            undoStack: newStack,
          };
        case 'UPDATE':
          return {
            ...state,
            students: state.students.map(s => (s.id === lastAction.previousState!.id ? lastAction.previousState! : s)),
            undoStack: newStack,
          };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

type StudentContextType = State & {
  dispatch: React.Dispatch<Action>;
};

export const StudentContext = createContext<StudentContextType>({
  ...initialState,
  dispatch: () => null,
});

export const StudentProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(studentReducer, initialState);
  const { toast } = useToast();

  const enhancedDispatch: React.Dispatch<Action> = (action) => {
    dispatch(action);
    switch(action.type) {
        case 'ADD_STUDENT':
            toast({ title: "Student Added", description: `${action.payload.name} is waiting for approval.` });
            break;
        case 'UPDATE_STUDENT':
            toast({ title: "Student Updated", description: `${action.payload.name}'s details were updated.` });
            break;
        case 'DELETE_STUDENT':
            toast({ title: "Student Deleted", description: "The student has been removed." });
            break;
        case 'APPROVE_STUDENT':
             toast({ title: "Student Approved", description: "The student is now active." });
            break;
        case 'REJECT_STUDENT':
             toast({ title: "Student Rejected", description: "The student has been rejected." });
            break;
        case 'UNDO_LAST_ACTION':
             toast({ title: "Action Undone", description: "The last action has been reversed." });
            break;
    }
  };

  return (
    <StudentContext.Provider value={{ ...state, dispatch: enhancedDispatch }}>
      {children}
    </StudentContext.Provider>
  );
};
