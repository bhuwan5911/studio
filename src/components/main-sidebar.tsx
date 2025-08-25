'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  Undo2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudentStore } from '@/hooks/use-student-store';
import { Badge } from './ui/badge';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck, notificationKey: 'pendingStudents' },
  { href: '/undo', label: 'Undo', icon: Undo2, notificationKey: 'undoStack' },
];

export function MainSidebar() {
  const pathname = usePathname();
  const { pendingStudents, undoStack } = useStudentStore();
  const notificationCounts = {
    pendingStudents: pendingStudents.length,
    undoStack: undoStack.length,
  };


  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="justify-between">
        <Logo />
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            
            const count = item.notificationKey ? notificationCounts[item.notificationKey as keyof typeof notificationCounts] : 0;

            return (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{ children: item.label }}
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                       {count > 0 && <Badge variant="destructive" className="ml-auto">{count}</Badge>}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className="flex items-center gap-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="user avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-semibold">Admin</span>
                <span className="text-muted-foreground">admin@campus.edu</span>
            </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
