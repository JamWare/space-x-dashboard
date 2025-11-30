import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'failure' | 'neutral' | 'warning';
  className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  const variantStyles = {
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    failure: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
