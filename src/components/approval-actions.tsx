'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Check, X } from 'lucide-react';
import { RejectStudentDialog } from '@/components/reject-student-dialog';
import { approveStudent, rejectStudent } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

export function ApprovalActions({ studentId }: { studentId: string }) {
    const { toast } = useToast();

    const handleApprove = async () => {
        await approveStudent(studentId);
        toast({ title: "Student Approved", description: "The student is now active." });
    };

    const handleReject = async () => {
        await rejectStudent(studentId);
        toast({ title: "Student Rejected", description: "The student has been rejected." });
    };

    return (
        <>
            <RejectStudentDialog
                onConfirm={handleReject}
                trigger={
                <Button variant="outline" size="sm">
                    <X className="mr-2 h-4 w-4" /> Reject
                </Button>
                }
            />
            <Button size="sm" onClick={handleApprove}>
                <Check className="mr-2 h-4 w-4" /> Approve
            </Button>
        </>
    );
}
