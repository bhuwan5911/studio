import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Logo = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2 font-bold text-lg", className)}>
    <BookOpenCheck className="h-6 w-6 text-primary" />
    <span>CampusConnect</span>
  </div>
);
