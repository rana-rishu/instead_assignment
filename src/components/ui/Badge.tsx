import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' | 'subtle';
  size?: 'sm' | 'md';
  dot?: boolean;
  dotColor?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  dotColor,
  children,
  ...props
}) => {
  const variantStyles: Record<string, string> = {
    default: 'bg-zinc-850 text-zinc-300 border border-zinc-800',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    info: 'bg-[#c48b59]/10 text-[#dfb88e] border border-[#c48b59]/20',
    outline: 'bg-transparent text-zinc-400 border border-zinc-700/60',
    subtle: 'bg-zinc-900 text-zinc-400 border border-zinc-850',
  };

  const sizeStyles: Record<string, string> = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md font-mono tracking-tight',
    md: 'text-xs px-2.5 py-1 rounded-md font-mono',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium whitespace-nowrap select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            'w-1.5 h-1.5 rounded-full shrink-0',
            dotColor || (variant === 'success' ? 'bg-emerald-400' : 'bg-zinc-400')
          )}
        />
      )}
      {children}
    </span>
  );
};
