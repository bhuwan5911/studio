'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { undoLastAction } from '@/lib/actions';
import type { UndoAction } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function UndoCard({ lastAction }: { lastAction: UndoAction }) {
    const { toast } = useToast();

    const handleUndo = async () => {
        await undoLastAction();
        toast({ title: 'Action Undone', description: 'The last action has been reversed.' });
    };

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border p-4 bg-card">
            <div className="flex items-center gap-4">
                 <Avatar>
                    <AvatarImage src={lastAction.student.avatar} alt={lastAction.student.name} />
                    <AvatarFallback>{lastAction.student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="flex items-center gap-2">
                        <p className="font-semibold">{lastAction.student.name}</p>
                        <Badge variant={lastAction.type === 'DELETE' ? 'destructive' : 'secondary'}>{lastAction.type}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(lastAction.timestamp), { addSuffix: true })}
                    </p>
                </div>
            </div>
            <Button onClick={handleUndo}>
                <Undo2 className="mr-2 h-4 w-4" /> Undo Action
            </Button>
        </div>
    );
}
