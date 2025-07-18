'use client';

import { ConvexProvider } from "convex/react";
import { convex } from "@/lib/convex";
import { ThemeProvider } from "@/lib/theme-context";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkOptions, sessionOptions } from "@/lib/clerk";
import { AnalyticsProvider } from "@/components/analytics/analytics-provider";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/error-boundary";
import { logger, trackError } from "@/lib/utils/logger";
import { useEffect } from "react";

function ErrorLogger({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Global error handler for unhandled errors
    const handleError = (event: ErrorEvent) => {
      trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    };

    // Global handler for unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
      trackError(error, {
        type: 'unhandled_promise_rejection',
        reason: event.reason,
      });
    };

    // Add event listeners
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Log application startup
    logger.info('Application initialized', {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}

function CustomErrorBoundary({ children }: { children: React.ReactNode }) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error with additional context
    trackError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // In production, you might want to send this to an error tracking service
    logger.error('React Error Boundary caught an error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  };

  return (
    <ErrorBoundary onError={handleError}>
      {children}
    </ErrorBoundary>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CustomErrorBoundary>
      <ErrorLogger>
        <ClerkProvider {...clerkOptions} {...sessionOptions}>
          <ConvexProvider client={convex}>
            <ThemeProvider>
              <AnalyticsProvider>
                {children}
                <Toaster />
              </AnalyticsProvider>
            </ThemeProvider>
          </ConvexProvider>
        </ClerkProvider>
      </ErrorLogger>
    </CustomErrorBoundary>
  );
} 