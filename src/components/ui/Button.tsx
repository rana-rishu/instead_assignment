import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'minimal' | 'destructive' | 'outline' | 'subtle';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  shortcut?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'sm',
      loading = false,
      startIcon,
      endIcon,
      shortcut,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Cal.com exact tactile & luxury physics
    const variantStyles: Record<string, string> = {
      primary:
        'bg-white text-zinc-950 font-semibold border border-transparent shadow-[0_1px_2px_rgba(0,0,0,0.15),0_3px_8px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,1),inset_0_-1px_0_rgba(0,0,0,0.12)] hover:bg-[#f4f4f5] hover:shadow-[0_2px_4px_rgba(0,0,0,0.2),0_6px_14px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,1)] active:scale-[0.96] active:bg-[#e4e4e7] active:shadow-[0_1px_1px_rgba(0,0,0,0.2),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black transition-all duration-100 ease-out cursor-pointer',
      secondary:
        'bg-gradient-to-b from-[#19191d] to-[#121215] text-zinc-200 hover:text-white font-medium border border-zinc-700/70 hover:border-zinc-500 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_0_rgba(255,255,255,0.08)] hover:shadow-[0_2px_5px_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.12)] active:scale-[0.96] active:from-[#111114] active:to-[#0d0d10] active:border-zinc-700 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] focus-visible:ring-2 focus-visible:ring-zinc-600 transition-all duration-100 ease-out cursor-pointer',
      minimal:
        'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70 active:scale-[0.96] active:bg-zinc-800 border border-transparent transition-all duration-100 ease-out cursor-pointer',
      destructive:
        'bg-rose-500/10 text-rose-300 font-medium border border-rose-500/25 hover:bg-rose-500/20 hover:border-rose-500/45 hover:text-rose-200 shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(244,63,94,0.15)] active:scale-[0.96] active:bg-rose-500/30 transition-all duration-100 ease-out cursor-pointer',
      outline:
        'bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-850/80 border border-zinc-700/80 hover:border-zinc-500 shadow-sm active:scale-[0.96] transition-all duration-100 ease-out cursor-pointer',
      subtle:
        'bg-zinc-850/70 text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] active:scale-[0.96] transition-all duration-100 ease-out cursor-pointer',
    };

    const sizeStyles: Record<string, string> = {
      xs: 'h-7 px-2.5 text-xs gap-1.5 rounded-[8px] font-medium tracking-tight',
      sm: 'h-8 px-3.5 text-[13px] gap-2 rounded-[8px] font-medium tracking-tight',
      md: 'h-9 px-4 text-sm gap-2 rounded-[9px] font-medium tracking-tight',
      lg: 'h-10 px-5 text-sm gap-2.5 rounded-[10px] font-medium tracking-tight',
      icon: 'h-8 w-8 p-0 rounded-[8px] justify-center items-center',
      'icon-sm': 'h-7 w-7 p-0 rounded-[7px] justify-center items-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center select-none outline-none disabled:opacity-40 disabled:pointer-events-none disabled:active:scale-100',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0 text-current" />
        ) : (
          startIcon && <span className="shrink-0 flex items-center">{startIcon}</span>
        )}
        {children && <span className="leading-none">{children}</span>}
        {endIcon && !loading && <span className="shrink-0 flex items-center">{endIcon}</span>}
        {shortcut && (
          <kbd className="ml-2 hidden sm:inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-mono font-semibold rounded bg-black/40 border border-white/15 text-zinc-400 leading-none shadow-inner">
            {shortcut}
          </kbd>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
