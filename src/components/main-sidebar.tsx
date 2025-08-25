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
  Moon,
  Sun,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudentStore } from '@/hooks/use-student-store';
import { Badge } from './ui/badge';
import { useTheme } from 'next-themes';
import { Button } from './ui/button';

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
  const { theme, setTheme } = useTheme();

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
         <div className="flex items-center justify-between gap-2 p-2">
            <div className='flex items-center gap-2'>
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="user avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-sm">
                  <span className="font-semibold">Admin</span>
                  <span className="text-muted-foreground">admin@campus.edu</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
