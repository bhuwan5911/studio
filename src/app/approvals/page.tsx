'use client';

import { Button } from '@/components/ui/button';
import { useStudentStore } from '@/hooks/use-student-store';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function ApprovalsPage() {
  const { pendingStudents, dispatch } = useStudentStore();

  const handleApprove = (id: string) => {
    dispatch({ type: 'APPROVE_STUDENT', payload: id });
  };

  const handleReject = (id: string) => {
    dispatch({ type: 'REJECT_STUDENT', payload: id });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approval Queue</h1>
        <p className="text-muted-foreground">
          Review new student submissions before they are added to the main list.
        </p>
      </div>
      {pendingStudents.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {pendingStudents.map((student) => (
            <Card key={student.id}>
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                    <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{student.name}</CardTitle>
                    <CardDescription>{student.department}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Age</span>
                  <span>{student.age}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Marks</span>
                  <span className="font-semibold">{student.marks}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleReject(student.id)}>
                  <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                <Button size="sm" onClick={() => handleApprove(student.id)}>
                  <Check className="mr-2 h-4 w-4" /> Approve
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="flex items-center justify-center p-12">
            <div className="text-center">
                <h3 className="text-xl font-semibold">Queue is empty</h3>
                <p className="text-muted-foreground">There are no pending student approvals.</p>
            </div>
        </Card>
      )}
    </div>
  );
}
