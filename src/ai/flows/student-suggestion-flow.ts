'use server';
/**
 * @fileOverview An AI flow to provide suggestions for student approvals.
 *
 * - getStudentSuggestion - A function that returns an AI-powered suggestion for a student.
 * - StudentSuggestionInput - The input type for the flow.
 * - StudentSuggestionOutput - The output type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Student } from '@/lib/types';

const StudentSuggestionInputSchema = z.object({
  id: z.string(),
  name: z.string(),
  age: z.number(),
  marks: z.number(),
  department: z.string(),
  status: z.string(),
});

const StudentSuggestionOutputSchema = z.object({
  recommendation: z.string().describe("Your recommendation, either 'Approve' or 'Reject'."),
  reasoning: z.string().describe('A brief explanation for your recommendation, based on the student\'s data.'),
});

export type StudentSuggestionInput = z.infer<typeof StudentSuggestionInputSchema>;
export type StudentSuggestionOutput = z.infer<typeof StudentSuggestionOutputSchema>;

export async function getStudentSuggestion(input: Student): Promise<StudentSuggestionOutput> {
  return studentSuggestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'studentSuggestionPrompt',
  input: { schema: StudentSuggestionInputSchema },
  output: { schema: StudentSuggestionOutputSchema },
  prompt: `You are an admissions officer for a university. 
  Your task is to review a student's profile and recommend whether to 'Approve' or 'Reject' their application.

  - A high score (e.g., above 75) is a strong positive signal.
  - Very low scores (e.g., below 40) are a strong negative signal.
  - Consider the department, but marks are the primary factor.
  - Provide a concise reasoning for your decision.

  Student Details:
  - Name: {{{name}}}
  - Age: {{{age}}}
  - Department: {{{department}}}
  - Marks: {{{marks}}}
  `,
});

const studentSuggestionFlow = ai.defineFlow(
  {
    name: 'studentSuggestionFlow',
    inputSchema: StudentSuggestionInputSchema,
    outputSchema: StudentSuggestionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
