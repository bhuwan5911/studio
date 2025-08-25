'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStudentStore } from '@/hooks/use-student-store';
import { UserCheck, Users, Clock } from 'lucide-react';
import type { Student } from '@/lib/types';

const DashboardStatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

export default function Home() {
  const { students, pendingStudents } = useStudentStore();

  const approvedStudents = students.filter(s => s.status === 'approved');

  const topper = approvedStudents.reduce(
    (max: Student | null, student: Student) =>
      !max || student.marks > max.marks ? student : max,
    null
  );

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome to CampusConnect</h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your campus data.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DashboardStatCard
          title="Total Students"
          value={approvedStudents.length}
          icon={Users}
        />
        <DashboardStatCard
          title="Topper"
          value={topper ? `${topper.name} (${topper.marks})` : 'N/A'}
          icon={UserCheck}
        />
        <DashboardStatCard
          title="Pending Approvals"
          value={pendingStudents.length}
          icon={Clock}
        />
      </div>
       <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activity to show.</p>
          </CardContent>
        </Card>
    </div>
  );
}
