'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

export function CustomCursor() {
  const isMobile = useIsMobile();
  const dotRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number>();
  const lastMoveTime = useRef(Date.now());
  const [isHovering, setIsHovering] = useState(false);

  const targetPos = useRef({ x: 0, y: 0 });
  const currentIconPos = useRef({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
      
      const target = e.target as HTMLElement;
      const isPointer = window.getComputedStyle(target).cursor === 'pointer';
      setIsHovering(isPointer);
      
      document.body.dataset.cursorIdle = 'false';
      lastMoveTime.current = Date.now();
    };

    const animate = () => {
       if (iconRef.current) {
          const dx = targetPos.current.x - currentIconPos.current.x;
          const dy = targetPos.current.y - currentIconPos.current.y;
          
          currentIconPos.current.x += dx * 0.1;
          currentIconPos.current.y += dy * 0.1;
          
          iconRef.current.style.left = `${currentIconPos.current.x}px`;
          iconRef.current.style.top = `${currentIconPos.current.y}px`;
       }
       animationFrameRef.current = requestAnimationFrame(animate);
    };

    const checkIdle = setInterval(() => {
        if (Date.now() - lastMoveTime.current > 100) {
            document.body.dataset.cursorIdle = 'true';
        }
    }, 150);

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if(animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      clearInterval(checkIdle);
    };
  }, []);

  if (isMobile) {
      return null;
  }

  return (
    <>
        <div 
            ref={dotRef}
            className={cn("cursor-dot", isHovering && "hovering")}
        />
        <BookOpenCheck 
            ref={iconRef}
            className={cn(
                "cursor-icon",
                isHovering && "hovering"
            )}
        />
    </>
  );
}
