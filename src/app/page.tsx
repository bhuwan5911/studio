'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useStudentStore } from '@/hooks/use-student-store';
import { UserCheck, Users, Clock, UserPlus } from 'lucide-react';
import type { Student } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  const recentlyApproved = students.filter(s => s.status === 'approved').slice(-5).reverse();

  const topper = approvedStudents.reduce(
    (max: Student | null, student: Student) =>
      !max || student.marks > max.marks ? student : max,
    null
  );

  return (
    <div className="flex flex-col gap-8">
      <div className="relative h-64 w-full rounded-lg overflow-hidden">
        <video
          src="https://videos.pexels.com/video-files/853874/853874-hd_1920_1080_25fps.mp4"
          autoPlay
          loop
          muted
          className="absolute top-0 left-0 w-full h-full object-cover"
          data-ai-hint="university students walking"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col items-start justify-end p-8">
            <h1 className="text-4xl font-bold tracking-tight text-white">Welcome to CampusConnect</h1>
            <p className="text-lg text-white/90 mt-2">
              Here's a quick overview of your campus data.
            </p>
          </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Total Students"
          value={students.length}
          icon={Users}
        />
         <DashboardStatCard
          title="Approved Students"
          value={approvedStudents.length}
          icon={UserCheck}
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
            <CardTitle>Recently Approved Students</CardTitle>
            <CardDescription>The last 5 students that were approved.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentlyApproved.length > 0 ? (
              <div className="space-y-4">
                {recentlyApproved.map((student) => (
                  <div key={student.id} className="flex items-center gap-4">
                    <Avatar>
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5 text-sm">
                      <div className="font-semibold">{student.name}</div>
                      <div className="text-muted-foreground">{student.department}</div>
                    </div>
                    <div className="ml-auto text-sm font-medium">{student.marks} Marks</div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <UserPlus className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No recent approvals</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Approved students will appear here.
                    </p>
                </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
