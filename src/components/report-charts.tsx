'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from 'recharts';
import * as React from 'react';

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface ChartData {
    departmentPerformanceData: { department: string; averageMarks: number }[];
    studentDistributionData: { name: string; value: number }[];
    marksDistributionData: { name: string; count: number }[];
}

export function ReportCharts({ departmentPerformanceData, studentDistributionData, marksDistributionData }: ChartData) {

  const departmentPerformanceConfig = {
    averageMarks: {
      label: 'Average Marks',
      color: 'hsl(var(--primary))',
    },
  };

   const marksDistributionConfig = {
    count: {
      label: 'Student Count',
      color: 'hsl(var(--primary))',
    },
  };
    
    return (
        <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Department Performance</CardTitle>
                        <CardDescription>Average student marks by department.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {departmentPerformanceData.length > 0 ? (
                            <ChartContainer config={departmentPerformanceConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={departmentPerformanceData}>
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
                        <CardTitle>Student Distribution</CardTitle>
                        <CardDescription>Student count by department.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {studentDistributionData.length > 0 ? (
                            <ChartContainer config={{}} className="min-h-[200px] w-full">
                                <PieChart>
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie data={studentDistributionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                        {studentDistributionData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ChartContainer>
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-muted-foreground">No students to display.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                    <CardHeader>
                        <CardTitle>Marks Distribution</CardTitle>
                        <CardDescription>Distribution of marks across all students.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {marksDistributionData.some(d => d.count > 0) ? (
                            <ChartContainer config={marksDistributionConfig} className="min-h-[200px] w-full">
                                <BarChart accessibilityLayer data={marksDistributionData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    />
                                    <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="count" fill="var(--color-count)" radius={8} />
                                </BarChart>
                            </ChartContainer>
                        ) : (
                            <div className="text-center p-8">
                                <p className="text-muted-foreground">No marks data to display.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
        </>
    );
}
