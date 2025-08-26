import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getApprovedStudents, getDepartmentPerformance, getStudentDistribution, getMarksDistribution } from '@/lib/data';
import { StudentTable } from '@/components/student-table';
import { ReportCharts } from '@/components/report-charts';
import { ReportActions } from '@/components/report-actions';

export default async function ReportsPage() {
    const approvedStudents = await getApprovedStudents();
    const departmentPerformanceData = await getDepartmentPerformance();
    const studentDistributionData = await getStudentDistribution();
    const marksDistributionData = await getMarksDistribution();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
                    <p className="text-muted-foreground">Analyze and download student performance reports.</p>
                </div>
                <ReportActions students={approvedStudents} />
            </div>
            
            <ReportCharts 
                departmentPerformanceData={departmentPerformanceData}
                studentDistributionData={studentDistributionData}
                marksDistributionData={marksDistributionData}
            />

            <Card>
                <CardHeader>
                    <CardTitle>Score Overview</CardTitle>
                    <CardDescription>A summary of scores for all approved students.</CardDescription>
                </CardHeader>
                <CardContent>
                    <StudentTable students={approvedStudents} isPaginated={false} />
                </CardContent>
            </Card>
        </div>
    );
}
