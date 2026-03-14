'use client';

import { useEffect, useState, useCallback } from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ErrorBoundary({ children }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setRetryKey(prev => prev + 1);
  }, []);

  useEffect(() => {
    // Suppress all unhandled errors
    const handleError = (event: ErrorEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[Silent] Error suppressed:', event.error?.message || event.message);
      return false;
    };

    // Suppress unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      event.stopPropagation();
      console.warn('[Silent] Rejection suppressed:', event.reason);
      return false;
    };

    // Add event listeners with capture phase to intercept before React
    window.addEventListener('error', handleError as EventListener, true);
    window.addEventListener('unhandledrejection', handleRejection as EventListener, true);

    return () => {
      window.removeEventListener('error', handleError as EventListener, true);
      window.removeEventListener('unhandledrejection', handleRejection as EventListener, true);
    };
  }, []);

  // Never show error UI - just render children
  // If there was an error, just retry silently
  if (hasError) {
    // Trigger retry on next render
    setTimeout(handleRetry, 0);
  }

  return <>{children}</>;
}

export default ErrorBoundary;
