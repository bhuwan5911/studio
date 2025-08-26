'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { ReactNode } from 'react';
import type { Student } from '@/lib/types';
import * as React from 'react';
import { getStudentSuggestion } from '@/ai/flows/student-suggestion-flow';
import { Loader2, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface StudentSuggestionDialogProps {
  student: Student;
  trigger: ReactNode;
}

export function StudentSuggestionDialog({ student, trigger }: StudentSuggestionDialogProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [suggestion, setSuggestion] = React.useState<{ recommendation: string; reasoning: string } | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const handleGetSuggestion = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestion(null);
        try {
            const res = await getStudentSuggestion(student);
            setSuggestion(res);
        } catch (e) {
            setError('There was an error getting the suggestion. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Student Suggestion</DialogTitle>
          <DialogDescription>
            Get an AI-powered recommendation for {student.name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
             {!suggestion && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <Sparkles className="h-12 w-12 text-primary" />
                    <p className="text-muted-foreground">Click the button below to generate an AI suggestion based on the student's profile.</p>
                </div>
            )}
            
            {isLoading && (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}
            
            {error && (
                 <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {suggestion && (
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold">Recommendation</h4>
                        <Badge variant={suggestion.recommendation.toLowerCase() === 'approve' ? 'default' : 'destructive'}>
                            {suggestion.recommendation}
                        </Badge>
                    </div>
                     <div>
                        <h4 className="font-semibold">Reasoning</h4>
                        <p className="text-sm text-muted-foreground">{suggestion.reasoning}</p>
                    </div>
                </div>
            )}

            <Button onClick={handleGetSuggestion} disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                {suggestion ? 'Regenerate Suggestion' : 'Generate Suggestion'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
