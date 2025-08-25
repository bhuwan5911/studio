'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStudentStore } from '@/hooks/use-student-store';
import { downloadFile } from '@/lib/utils';
import { Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import * as React from 'react';

export default function ReportsPage() {
  const { students } = useStudentStore();
  const approvedStudents = students.filter(s => s.status === 'approved');

  const handleDownload = (format: 'csv' | 'json') => {
    downloadFile(approvedStudents, format, 'student_report');
  };
  
  const chartData = React.useMemo(() => {
    if (!approvedStudents.length) return [];
    
    const dataByDept = approvedStudents.reduce((acc, student) => {
        if (!acc[student.department]) {
            acc[student.department] = { totalMarks: 0, count: 0 };
        }
        acc[student.department].totalMarks += student.marks;
        acc[student.department].count += 1;
        return acc;
    }, {} as Record<string, { totalMarks: number; count: number }>);

    return Object.entries(dataByDept).map(([department, {totalMarks, count}]) => ({
        department,
        averageMarks: Math.round(totalMarks / count)
    }));
  }, [approvedStudents]);

  const chartConfig = {
    averageMarks: {
      label: 'Average Marks',
      color: 'hsl(var(--primary))',
    },
  };


  return (
    <div className="space-y-6">
       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">Download student performance reports.</p>
        </div>
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
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Average student marks by department.</CardDescription>
        </CardHeader>
        <CardContent>
            {chartData.length > 0 ? (
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <BarChart accessibilityLayer data={chartData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                        dataKey="department"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        />
                        <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="averageMarks" fill="var(--color-averageMarks)" radius={8} />
                    </BarChart>
                </ChartContainer>
            ) : (
                <div className="text-center p-8">
                    <p className="text-muted-foreground">Not enough data to display a chart.</p>
                </div>
            )}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
            <CardTitle>Marks Overview</CardTitle>
            <CardDescription>A summary of marks for all approved students.</CardDescription>
        </CardHeader>
        <CardContent>
             <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead className="text-right">Marks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvedStudents.length > 0 ? (
                    approvedStudents
                      .sort((a,b) => b.marks - a.marks)
                      .map((student) => (
                        <TableRow key={student.id}>
                          <TableCell>{student.id}</TableCell>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.department}</TableCell>
                          <TableCell className="text-right font-bold">{student.marks}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No students to report on.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
