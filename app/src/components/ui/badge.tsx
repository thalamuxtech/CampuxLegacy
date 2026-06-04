import { cn } from '@/lib/utils';

export function Badge({
  children,
  className,
  variant = 'default',
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'accent' | 'outline' | 'sealed';
}) {
  const v = {
    default: 'bg-ink/5 text-ink',
    accent: 'bg-accent/10 text-accent-700 border border-accent/20',
    outline: 'border border-ink/15 text-ink',
    sealed:
      'bg-gradient-to-br from-accent-500 to-accent-700 text-paper shadow-[0_4px_16px_-6px_rgba(184,92,56,0.45)]',
  }[variant];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
        v,
        className
      )}
    >
      {children}
    </span>
  );
}
