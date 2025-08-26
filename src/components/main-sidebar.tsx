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
  useSidebar,
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
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: ClipboardCheck, notificationKey: 'pendingStudents' },
  { href: '/undo', label: 'Undo', icon: Undo2, notificationKey: 'undoStack' },
];

function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const { state } = useSidebar();

    if (state === 'collapsed') {
        return (
             <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
        )
    }

    return (
        <div className="flex items-center w-full rounded-md border p-1">
            <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="sm" className="w-full" onClick={() => setTheme('light')}>
                <Sun className="mr-2 h-4 w-4" /> Light
            </Button>
            <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="sm" className="w-full" onClick={() => setTheme('dark')}>
                <Moon className="mr-2 h-4 w-4" /> Dark
            </Button>
        </div>
    )
}

export function MainSidebar() {
  const pathname = usePathname();
  const { pendingStudents, undoStack } = useStudentStore();
  const { state } = useSidebar();

  const notificationCounts = {
    pendingStudents: pendingStudents.length,
    undoStack: undoStack.length,
  };


  return (
    <Sidebar>
      <SidebarHeader className={cn("justify-center", state === 'expanded' && 'justify-between')}>
        <Logo className={cn(state === 'collapsed' && 'hidden')} />
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
                    size="lg"
                    tooltip={{ children: item.label }}
                  >
                    <span>
                      <item.icon />
                      <span>{item.label}</span>
                       {count > 0 && <Badge variant="destructive" className="ml-auto group-data-[collapsible=icon]:hidden">{count}</Badge>}
                    </span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <div className={cn("flex items-center gap-2 p-2 rounded-lg", state === 'expanded' && 'border')}>
            <Avatar className="h-9 w-9">
            <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="user avatar" />
            <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className={cn("flex flex-col text-sm", state === 'collapsed' && "hidden")}>
                <span className="font-semibold">Admin</span>
                <span className="text-muted-foreground">admin@campus.edu</span>
            </div>
        </div>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  );
}
