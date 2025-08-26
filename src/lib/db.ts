import type { Student, UndoAction } from './types';

// This is a simple in-memory "database" for development purposes.
// A global variable is used to ensure the data persists across hot reloads.

interface GlobalWithDb {
  students: Student[];
  undoStack: UndoAction[];
}

declare const global: GlobalWithDb;

if (!global.students) {
  global.students = [];
}

if (!global.undoStack) {
  global.undoStack = [];
}

export const db = {
  students: global.students,
  undoStack: global.undoStack,
};
