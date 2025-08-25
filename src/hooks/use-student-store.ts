'use client';

import { useContext } from 'react';
import { StudentContext } from '@/contexts/student-provider';

export const useStudentStore = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudentStore must be used within a StudentProvider');
  }
  return context;
};
