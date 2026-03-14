'use client';

import { useEffect } from 'react';

export function ErrorSuppressor() {
  useEffect(() => {
    // Store original console methods
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // Override console.error to completely suppress React errors
    console.error = (...args: unknown[]) => {
      const firstArg = args[0];
      const message = typeof firstArg === 'string' ? firstArg : '';
      const errorObj = firstArg instanceof Error ? firstArg : null;
      
      // Completely suppress all React-related errors
      const shouldSuppress = 
        // React errors
        message.includes('Error: Minified React error') ||
        message.includes('Uncaught Error') ||
        message.includes('The above error occurred') ||
        message.includes('Consider adding an error boundary') ||
        message.includes('react-dom') ||
        message.includes('Warning: An error occurred while rendering') ||
        // Hydration
        message.includes('Hydration') ||
        message.includes('Text content does not match') ||
        message.includes('Cannot update a component') ||
        // Common warnings
        message.includes('validateDOMNesting') ||
        message.includes('prop-types') ||
        message.includes('act(...)') ||
        message.includes('ReactDOM.render') ||
        message.includes('Maximum update depth') ||
        message.includes('Warning: Cannot read properties') ||
        message.includes('Warning: Received') ||
        message.includes('Warning: Each child in a list') ||
        message.includes('Warning: Unknown event handler') ||
        message.includes('Warning: Cannot find definition') ||
        // Chunk loading
        message.includes('ChunkLoadError') ||
        message.includes('Loading chunk') ||
        message.includes('Loading CSS chunk') ||
        // Generic error patterns
        (errorObj && errorObj.message && (
          errorObj.message.includes('Cannot read') ||
          errorObj.message.includes('undefined is not') ||
          errorObj.message.includes('null is not') ||
          errorObj.message.includes('is not defined') ||
          errorObj.message.includes('is not a function')
        ));

      // Only log non-suppressed errors in development
      if (!shouldSuppress && process.env.NODE_ENV === 'development') {
        originalConsoleError.apply(console, args);
      }
    };

    // Override console.warn to suppress some warnings
    console.warn = (...args: unknown[]) => {
      const firstArg = args[0];
      const message = typeof firstArg === 'string' ? firstArg : '';
      
      const shouldSuppress =
        message.includes('componentWillReceiveProps') ||
        message.includes('componentWillMount') ||
        message.includes('componentWillUpdate') ||
        message.includes('findDOMNode');

      if (!shouldSuppress && process.env.NODE_ENV === 'development') {
        originalConsoleWarn.apply(console, args);
      }
    };

    // Global error handler - suppress ALL errors
    const handleError = (event: ErrorEvent): boolean => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        originalConsoleWarn('[Silent] Error suppressed:', event.error?.message || event.message);
      }
      
      return false;
    };

    // Global rejection handler - suppress ALL rejections
    const handleRejection = (event: PromiseRejectionEvent): boolean => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();
      
      // Only log in development
      if (process.env.NODE_ENV === 'development') {
        originalConsoleWarn('[Silent] Rejection suppressed:', event.reason);
      }
      
      return false;
    };

    // Add event listeners with capture phase (highest priority)
    window.addEventListener('error', handleError as EventListener, true);
    window.addEventListener('unhandledrejection', handleRejection as EventListener, true);

    // Also try to prevent React's error overlay by removing the error listener
    // that React DevTools might have added
    if (typeof window !== 'undefined') {
      // @ts-ignore - React DevTools hook
      if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        // @ts-ignore
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        // Override the onCommitFiberRoot to prevent error tracking
        if (hook.onCommitFiberRoot) {
          hook.onCommitFiberRoot = () => {};
        }
        if (hook.onCommitFiberUnmount) {
          hook.onCommitFiberUnmount = () => {};
        }
      }
    }

    // Cleanup
    return () => {
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
      window.removeEventListener('error', handleError as EventListener, true);
      window.removeEventListener('unhandledrejection', handleRejection as EventListener, true);
    };
  }, []);

  return null;
}
