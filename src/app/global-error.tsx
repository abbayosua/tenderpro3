'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Silently log and auto-retry
    console.warn('Silent global error recovery:', error?.message || 'Unknown error');
    // Auto-retry - just reload the page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }, [error]);

  // Return minimal HTML that immediately redirects - no visible error UI
  return (
    <html lang="id">
      <head>
        <meta httpEquiv="refresh" content="0;url=/" />
        <title>TenderPro</title>
        <style>{`body{background:#f8fafc;}`}</style>
      </head>
      <body></body>
    </html>
  );
}
