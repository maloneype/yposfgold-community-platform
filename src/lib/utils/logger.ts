import { ENV_CONFIG } from '@/lib/constants';

// Log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

// Log entry interface
interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
  url?: string;
  userAgent?: string;
  userId?: string;
  sessionId?: string;
}

// Logger configuration
interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  enablePersistence: boolean;
  maxLocalEntries: number;
}

class Logger {
  private config: LoggerConfig;
  private localEntries: LogEntry[] = [];

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      level: ENV_CONFIG.IS_DEVELOPMENT ? LogLevel.DEBUG : LogLevel.INFO,
      enableConsole: true,
      enableRemote: ENV_CONFIG.IS_PRODUCTION,
      enablePersistence: true,
      maxLocalEntries: 1000,
      ...config,
    };

    // Initialize persistence
    if (this.config.enablePersistence && typeof window !== 'undefined') {
      this.loadPersistedEntries();
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };

    if (error) {
      entry.stack = error.stack;
    }

    if (typeof window !== 'undefined') {
      entry.url = window.location.href;
      entry.userAgent = navigator.userAgent;
    }

    // Add user context if available
    try {
      const userContext = this.getUserContext();
      if (userContext) {
        entry.userId = userContext.userId;
        entry.sessionId = userContext.sessionId;
      }
    } catch (e) {
      // Ignore errors getting user context
    }

    return entry;
  }

  private getUserContext(): { userId?: string; sessionId?: string } | null {
    try {
      // This would typically come from your auth context
      // For now, we'll check localStorage or session storage
      const userId = localStorage.getItem('userId');
      const sessionId = sessionStorage.getItem('sessionId');
      
      return { userId: userId || undefined, sessionId: sessionId || undefined };
    } catch (e) {
      return null;
    }
  }

  private logToConsole(entry: LogEntry): void {
    if (!this.config.enableConsole) return;

    const levelMethods = {
      [LogLevel.DEBUG]: console.debug,
      [LogLevel.INFO]: console.info,
      [LogLevel.WARN]: console.warn,
      [LogLevel.ERROR]: console.error,
    };

    const logMethod = levelMethods[entry.level] || console.log;
    
    if (entry.context || entry.stack) {
      logMethod(
        `[${entry.timestamp}] ${entry.message}`,
        entry.context || {},
        entry.stack || ''
      );
    } else {
      logMethod(`[${entry.timestamp}] ${entry.message}`);
    }
  }

  private async logToRemote(entry: LogEntry): Promise<void> {
    if (!this.config.enableRemote || !this.config.remoteEndpoint) return;

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to remote endpoint:', error);
    }
  }

  private persistEntry(entry: LogEntry): void {
    if (!this.config.enablePersistence || typeof window === 'undefined') return;

    try {
      this.localEntries.push(entry);
      
      // Keep only the most recent entries
      if (this.localEntries.length > this.config.maxLocalEntries) {
        this.localEntries = this.localEntries.slice(-this.config.maxLocalEntries);
      }

      // Save to localStorage
      localStorage.setItem('app_logs', JSON.stringify(this.localEntries));
    } catch (error) {
      console.error('Failed to persist log entry:', error);
    }
  }

  private loadPersistedEntries(): void {
    try {
      const stored = localStorage.getItem('app_logs');
      if (stored) {
        this.localEntries = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load persisted log entries:', error);
    }
  }

  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    if (!this.shouldLog(level)) return;

    const entry = this.createLogEntry(level, message, context, error);

    // Log to console
    this.logToConsole(entry);

    // Log to remote endpoint
    if (this.config.enableRemote) {
      this.logToRemote(entry).catch(console.error);
    }

    // Persist locally
    this.persistEntry(entry);
  }

  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  // Convenience methods for common logging scenarios
  userAction(action: string, context?: Record<string, any>): void {
    this.info(`User action: ${action}`, context);
  }

  apiCall(endpoint: string, method: string, status?: number, duration?: number): void {
    this.info(`API call: ${method} ${endpoint}`, { status, duration });
  }

  apiError(endpoint: string, method: string, error: Error): void {
    this.error(`API error: ${method} ${endpoint}`, { error: error.message }, error);
  }

  performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${operation}`, { duration, ...context });
  }

  // Get persisted log entries
  getPersistedEntries(): LogEntry[] {
    return [...this.localEntries];
  }

  // Clear persisted log entries
  clearPersistedEntries(): void {
    this.localEntries = [];
    if (typeof window !== 'undefined') {
      localStorage.removeItem('app_logs');
    }
  }

  // Export logs for debugging
  exportLogs(): string {
    return JSON.stringify(this.localEntries, null, 2);
  }

  // Set log level dynamically
  setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

// Create singleton instance
export const logger = new Logger();

// Performance monitoring utilities
export class PerformanceMonitor {
  private startTimes: Map<string, number> = new Map();

  start(operation: string): void {
    this.startTimes.set(operation, performance.now());
  }

  end(operation: string, context?: Record<string, any>): number {
    const startTime = this.startTimes.get(operation);
    if (!startTime) {
      logger.warn(`Performance monitor: No start time found for operation "${operation}"`);
      return 0;
    }

    const duration = performance.now() - startTime;
    this.startTimes.delete(operation);

    logger.performance(operation, duration, context);
    return duration;
  }

  measure<T>(operation: string, fn: () => T | Promise<T>, context?: Record<string, any>): T | Promise<T> {
    this.start(operation);
    
    try {
      const result = fn();
      
      if (result instanceof Promise) {
        return result
          .then((value) => {
            this.end(operation, context);
            return value;
          })
          .catch((error) => {
            this.end(operation, { ...context, error: error.message });
            throw error;
          });
      } else {
        this.end(operation, context);
        return result;
      }
    } catch (error) {
      this.end(operation, { ...context, error: error instanceof Error ? error.message : String(error) });
      throw error;
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// React hook for logging
export function useLogger() {
  return logger;
}

// React hook for performance monitoring
export function usePerformanceMonitor() {
  return performanceMonitor;
}

// Error tracking utilities
export function trackError(error: Error, context?: Record<string, any>): void {
  logger.error(error.message, context, error);
  
  // Send to external error tracking service
  if (ENV_CONFIG.IS_PRODUCTION) {
    // Example: Sentry.captureException(error, { extra: context });
  }
}

export function trackApiError(endpoint: string, method: string, error: Error): void {
  logger.apiError(endpoint, method, error);
  trackError(error, { endpoint, method });
}

export function trackUserAction(action: string, context?: Record<string, any>): void {
  logger.userAction(action, context);
}

// Development helpers
export function enableDebugLogging(): void {
  logger.setLogLevel(LogLevel.DEBUG);
  logger.debug('Debug logging enabled');
}

export function getLogSummary(): {
  totalEntries: number;
  errorCount: number;
  warningCount: number;
  recentErrors: LogEntry[];
} {
  const entries = logger.getPersistedEntries();
  const errors = entries.filter(e => e.level === LogLevel.ERROR);
  const warnings = entries.filter(e => e.level === LogLevel.WARN);
  
  return {
    totalEntries: entries.length,
    errorCount: errors.length,
    warningCount: warnings.length,
    recentErrors: errors.slice(-10), // Last 10 errors
  };
} 