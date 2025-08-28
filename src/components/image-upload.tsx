'use client';

import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE_MB = 1;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const { toast } = useToast();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: `Please select an image smaller than ${MAX_FILE_SIZE_MB}MB.`,
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChange('');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className={cn(
            "relative w-32 h-32 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center text-center p-2 cursor-pointer hover:border-primary transition-colors",
            value && "border-solid"
        )}
        onClick={() => fileInputRef.current?.click()}
      >
        <Avatar className="h-full w-full">
            <AvatarImage src={value} alt="Student Avatar" />
            <AvatarFallback className="bg-transparent">
                 <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <UploadCloud className="w-8 h-8" />
                    <span className="text-xs">Upload Image</span>
                </div>
            </AvatarFallback>
        </Avatar>
        {value && (
            <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-7 w-7 rounded-full z-10"
                onClick={handleRemoveImage}
            >
                <X className="h-4 w-4" />
            </Button>
        )}
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
