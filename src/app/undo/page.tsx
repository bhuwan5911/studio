import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getLastUndoAction } from '@/lib/data';
import { UndoCard } from '@/components/undo-card';

export default async function UndoPage() {
  const lastAction = await getLastUndoAction();

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
             <UndoCard lastAction={lastAction} />
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
