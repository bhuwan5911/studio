import type { Student, UndoAction } from './types';

// This file is now configured to fetch data from a separate backend API.
// We are assuming a Java/Spring Boot backend is running on http://localhost:8080

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// --- Helper function for API calls ---
async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      // In a real app, you'd have more robust error handling here
      console.error(`API Error: ${response.status} ${response.statusText}`);
      const errorBody = await response.text();
      console.error(`Error Body: ${errorBody}`);
      throw new Error(`Failed to fetch from ${endpoint}`);
    }
    
    if (response.status === 204 /* No Content */) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Network or fetch error:', error);
    // Return empty state or throw to be caught by the caller
    throw error;
  }
}


// --- Student Data Functions ---

export async function getStudents(): Promise<Student[]> {
  return apiFetch('/students').catch(() => []);
}

export async function getApprovedStudents(): Promise<Student[]> {
    // Assuming the backend endpoint filters by status
    return apiFetch('/students?status=approved').catch(() => []);
}

export async function getPendingStudents(): Promise<Student[]> {
    return apiFetch('/students?status=pending').catch(() => []);
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  return apiFetch(`/students/${id}`).catch(() => undefined);
}

export async function addStudent(student: Omit<Student, 'id' | 'averageScore' | 'status'>): Promise<Student> {
  return apiFetch('/students', {
    method: 'POST',
    body: JSON.stringify(student),
  });
}

export async function updateStudent(id: string, data: Partial<Omit<Student, 'id'>>): Promise<Student | null> {
  return apiFetch(`/students/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteStudent(id: string): Promise<void> {
  await apiFetch(`/students/${id}`, {
    method: 'DELETE',
  });
}

export async function approveStudent(id: string): Promise<Student | null> {
    // This logic would now live on the backend. 
    // The frontend just tells the backend which student to approve.
    return apiFetch(`/students/${id}/approve`, {
        method: 'POST'
    });
}

export async function rejectStudent(id: string): Promise<void> {
    // Reject would be a DELETE in a RESTful context
    await apiFetch(`/students/${id}`, {
        method: 'DELETE',
    });
}


// --- UNDO Functionality ---
// This would need a significant backend implementation (e.g., an audit log)
// For now, we'll return null as it's no longer a simple frontend operation.

export async function getLastUndoAction(): Promise<UndoAction | null> {
    // This would require a dedicated endpoint like GET /api/actions/latest
    return Promise.resolve(null);
}

export async function undoLastAction(): Promise<UndoAction | null> {
    // This would require a dedicated endpoint like POST /api/actions/undo
    return Promise.resolve(null);
}


// --- Report Data ---
// These calculations would be performed by the backend to avoid sending all data to the client.

export async function getDepartmentPerformance(): Promise<{ department: string; averageScore: number }[]> {
    return apiFetch('/reports/department-performance').catch(() => []);
}

export async function getStudentDistribution(): Promise<{ name: string; value: number }[]> {
    return apiFetch('/reports/student-distribution').catch(() => []);
}

export async function getMarksDistribution(): Promise<{ name: string; count: number }[]> {
    return apiFetch('/reports/marks-distribution').catch(() => []);
}
