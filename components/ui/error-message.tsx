'use client';

import { Button } from './button';

interface ErrorMessageProps {
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  message?: string;
}

export function ErrorMessage({
  error,
  onRetry,
  title = 'Something went wrong',
  message,
}: ErrorMessageProps) {
  const displayMessage = message || error?.message || 'An unexpected error occurred';

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-8 dark:border-red-900 dark:bg-red-950">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-red-500 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {displayMessage}
        </p>
        {onRetry && (
          <Button
            onClick={onRetry}
            className="mt-6"
            variant="primary"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
}
