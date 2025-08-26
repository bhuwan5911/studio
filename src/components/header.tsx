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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

const navItems = [
  { href: '/', label: 'Home', icon: LayoutDashboard },
  { href: '/students', label: 'Students', icon: Users },
  { href: '/reports', label: 'Reports', icon: FileText },
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

function NavLink({ href, children, className, onClick }: { href: string, children: React.ReactNode, className?: string, onClick?: () => void }) {
    const pathname = usePathname();
    const isActive = href === '/' ? pathname === href : pathname.startsWith(href);

    return (
        <Link href={href} className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            isActive ? "text-primary" : "text-muted-foreground",
            className
        )}
        onClick={onClick}
        >
            {children}
        </Link>
    )
}

export function Header() {
   const [isSheetOpen, setIsSheetOpen] = React.useState(false);

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
                         return (
                            <NavLink key={item.href} href={item.href} className="text-base" onClick={() => setIsSheetOpen(false)}>
                                <div className="flex items-center justify-between">
                                    {item.label}
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
                return (
                    <NavLink key={item.href} href={item.href}>
                        <div className="flex items-center gap-2">
                           {item.label}
                        </div>
                    </NavLink>
                )
           })}
        </nav>

        <div className="flex flex-1 items-center justify-end space-x-2">
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
