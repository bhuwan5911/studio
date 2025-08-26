'use client';

import { Button } from '@/components/ui/button';
import { downloadFile } from '@/lib/utils';
import { Download } from 'lucide-react';
import type { Student } from '@/lib/types';

export function ReportActions({ students }: { students: Student[] }) {
    const handleDownload = (format: 'csv' | 'json') => {
        downloadFile(students, format, 'student_report');
    };
    
    return (
         <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleDownload('csv')}>
                <Download className="mr-2 h-4 w-4" />
                Download CSV
            </Button>
            <Button onClick={() => handleDownload('json')}>
                <Download className="mr-2 h-4 w-4" />
                Download JSON
            </Button>
        </div>
    )
}
