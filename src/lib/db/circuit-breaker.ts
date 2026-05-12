// src/lib/db/circuit-breaker.ts

export enum CircuitState {
  CLOSED,   // Normal operation
  OPEN,     // Failure detected, skipping operations
  HALF_OPEN // Testing if service is back
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private readonly threshold: number;
  private readonly resetTimeout: number;

  constructor(threshold = 5, resetTimeout = 30000) {
    this.threshold = threshold;
    this.resetTimeout = resetTimeout;
  }

  async execute<T>(action: () => Promise<T>, fallbackValue: T): Promise<T> {
    if (this.state === CircuitState.OPEN) {
      if (Date.now() - (this.lastFailureTime || 0) > this.resetTimeout) {
        this.state = CircuitState.HALF_OPEN;
      } else {
        console.warn('[CircuitBreaker] Service is OPEN, returning fallback.');
        return fallbackValue;
      }
    }

    try {
      const result = await action();
      this.reset();
      return result;
    } catch (error) {
      this.recordFailure();
      console.error('[CircuitBreaker] Operation failed:', error);
      return fallbackValue;
    }
  }

  private recordFailure() {
    this.failureCount++;
    this.lastFailureTime = Date.now();
    if (this.failureCount >= this.threshold) {
      this.state = CircuitState.OPEN;
      console.error('[CircuitBreaker] State changed to OPEN');
    }
  }

  private reset() {
    this.failureCount = 0;
    this.state = CircuitState.CLOSED;
  }
}

// Global instance for aiDb
export const aiDbCircuitBreaker = new CircuitBreaker(5, 60000); // 1 minute timeout
