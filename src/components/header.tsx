'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  LayoutDashboard,
  Users,
  FileText,
  ClipboardCheck,
  Undo2,
  Moon,
  Sun,
  Menu,
} from 'lucide-react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useStudentStore } from '@/hooks/use-student-store';
import { Badge } from './ui/badge';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/approvals', label: 'Approvals', notificationKey: 'pendingStudents' },
  { href: '/undo', label: 'Undo', notificationKey: 'undoStack' },
];

function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function NavLink({ href, children, className }: { href: string, children: React.ReactNode, className?: string }) {
    const pathname = usePathname();
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

    return (
        <Link href={href} className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground",
            className
        )}>
            {children}
        </Link>
    )
}

function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src="https://placehold.co/40x40.png" alt="@admin" data-ai-hint="user avatar" />
                        <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Admin</p>
                        <p className="text-xs leading-none text-muted-foreground">
                        admin@campus.edu
                        </p>
                    </div>
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Settings
                </DropdownMenuItem>
                 <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    )
}


export function Header() {
  const { pendingStudents, undoStack } = useStudentStore();
   const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  const notificationCounts = {
    pendingStudents: pendingStudents.length,
    undoStack: undoStack.length,
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Nav */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[240px]">
            <div className="flex flex-col gap-6 p-6">
                <Logo />
                <nav className="flex flex-col gap-4">
                    {navItems.map((item) => {
                         const count = item.notificationKey ? notificationCounts[item.notificationKey as keyof typeof notificationCounts] : 0;
                         return (
                            <NavLink key={item.href} href={item.href} className="text-base" onClick={() => setIsSheetOpen(false)}>
                                <div className="flex items-center justify-between">
                                    {item.label}
                                    {count > 0 && <Badge variant="destructive">{count}</Badge>}
                                </div>
                            </NavLink>
                         )
                    })}
                </nav>
            </div>
          </SheetContent>
        </Sheet>
        
         {/* Desktop Nav */}
        <nav className="hidden items-center space-x-6 md:flex">
           {navItems.map((item) => {
                const count = item.notificationKey ? notificationCounts[item.notificationKey as keyof typeof notificationCounts] : 0;
                return (
                    <NavLink key={item.href} href={item.href}>
                        <div className="flex items-center gap-2">
                           {item.label}
                           {count > 0 && <Badge variant="destructive" className="h-5 w-5 justify-center p-0">{count}</Badge>}
                        </div>
                    </NavLink>
                )
           })}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
            <UserMenu />
        </div>
      </div>
    </header>
  );
}
