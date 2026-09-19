import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Cal.com Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Cal.com Modal Box */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative w-full z-10 bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-150',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-zinc-800/80 bg-zinc-900/40">
            <div>
              {title && <h2 className="font-cal text-base font-semibold text-white tracking-tight">{title}</h2>}
              {description && <p className="text-xs text-zinc-400 mt-0.5">{description}</p>}
            </div>
            <Button
              variant="minimal"
              size="icon-sm"
              onClick={onClose}
              className="text-zinc-400 hover:text-white"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};
