"use client";

import React, { Component, ReactNode, ErrorInfo } from "react";
import { useAppStore } from "@/lib/store";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackUI?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetKeys?: unknown[];
  boundaryName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component that catches React errors and prevents app crashes
 * Integrates with Zustand store for error logging
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const boundaryName = this.props.boundaryName || "Unknown";

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error(`[Error Boundary: ${boundaryName}]`, error, errorInfo);
    }

    // Store error in Zustand for error toast display
    useAppStore.getState().setError(
      `Component error in ${boundaryName}: ${error.message}`,
      "error",
      `${boundaryName} boundary`
    );

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    this.setState({
      errorInfo,
    });
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    // Reset error boundary when resetKeys change
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      prevProps.resetKeys &&
      this.props.resetKeys.some((key, index) => key !== prevProps.resetKeys![index])
    ) {
      this.reset();
    }
  }

  reset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallbackUI) {
        return this.props.fallbackUI;
      }

      // Default fallback UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={this.reset}
          boundaryName={this.props.boundaryName}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI component
 */
interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  onReset: () => void;
  boundaryName?: string;
}

function ErrorFallback({ error, errorInfo, onReset, boundaryName }: ErrorFallbackProps) {
  const isDev = process.env.NODE_ENV === "development";

  return (
    <div className="normandy-glass flex min-h-[400px] flex-col items-center justify-center gap-6 rounded-md border border-normandy-orange/20 p-8">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-8 w-8 text-normandy-orange" />
        <h2 className="text-xl font-bold text-normandy-cream">Something went wrong</h2>
      </div>

      <p className="max-w-md text-center text-normandy-cream/70">
        {boundaryName ? `An error occurred in the ${boundaryName} section.` : "An unexpected error occurred."}
        {" "}The error has been logged and you can try to recover.
      </p>

      {isDev && error && (
        <div className="w-full max-w-2xl rounded-md bg-black/30 p-4">
          <p className="mb-2 font-mono text-sm text-red-400">
            {error.name}: {error.message}
          </p>
          {errorInfo && (
            <details className="mt-2">
              <summary className="cursor-pointer text-sm text-normandy-cream/50">
                Stack trace
              </summary>
              <pre className="mt-2 overflow-auto text-xs text-normandy-cream/40">
                {errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-md bg-normandy-orange px-4 py-2 font-semibold text-normandy-navy transition-colors hover:bg-normandy-orange/80"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 rounded-md border border-normandy-cream/20 px-4 py-2 font-semibold text-normandy-cream transition-colors hover:bg-normandy-cream/10"
        >
          <Home className="h-4 w-4" />
          Go Home
        </button>
      </div>
    </div>
  );
}

export default ErrorBoundary;
