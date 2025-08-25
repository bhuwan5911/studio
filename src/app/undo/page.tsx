'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentStore } from '@/hooks/use-student-store';
import { Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

export default function UndoPage() {
  const { undoStack, dispatch } = useStudentStore();

  const handleUndo = () => {
    dispatch({ type: 'UNDO_LAST_ACTION' });
  };
  
  const lastAction = undoStack.length > 0 ? undoStack[undoStack.length - 1] : null;

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-3xl font-bold tracking-tight">Undo Last Action</h1>
        <p className="text-muted-foreground">
          Made a mistake? Reverse the last action you performed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Action History</CardTitle>
          <CardDescription>Only the most recent action can be undone.</CardDescription>
        </CardHeader>
        <CardContent>
          {lastAction ? (
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border p-4">
              <div className="flex items-center gap-4">
                 <Badge variant={lastAction.type === 'DELETE' ? 'destructive' : 'secondary'}>{lastAction.type}</Badge>
                 <div>
                    <p className="font-semibold">{lastAction.student.name}</p>
                    <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(lastAction.timestamp, { addSuffix: true })}
                    </p>
                 </div>
              </div>
              <Button onClick={handleUndo}>
                <Undo2 className="mr-2 h-4 w-4" /> Undo Action
              </Button>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No actions to undo.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
