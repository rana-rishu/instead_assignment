import React, { useState } from 'react';
import { cn } from '../../lib/utils';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  shortcut?: string;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  side = 'top',
  shortcut,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles: Record<string, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1 text-xs font-medium text-zinc-200 bg-zinc-950 border border-zinc-800 rounded-md shadow-xl whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in zoom-in-95 flex items-center gap-1.5',
            positionStyles[side],
            className
          )}
        >
          <span>{content}</span>
          {shortcut && (
            <kbd className="px-1 py-0.2 text-[9px] font-mono bg-zinc-800 border border-zinc-700 text-zinc-400 rounded">
              {shortcut}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
};
