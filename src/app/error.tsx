'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Silently log and auto-retry
    console.warn('Silent error recovery:', error?.message || 'Unknown error');
    // Auto-retry by calling reset
    setTimeout(() => {
      reset();
    }, 100);
  }, [error, reset]);

  // Return nothing - no error UI at all
  return null;
}
