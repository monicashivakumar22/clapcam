/**
 * Performance monitoring utilities.
 */

/**
 * Simple FPS counter using a rolling window approach.
 */
export class FPSCounter {
  private timestamps: number[] = [];
  private windowMs: number;

  constructor(windowMs: number = 1000) {
    this.windowMs = windowMs;
  }

  tick(now: number = performance.now()): number {
    this.timestamps.push(now);

    // Remove timestamps outside the window
    const cutoff = now - this.windowMs;
    while (this.timestamps.length > 0 && this.timestamps[0] < cutoff) {
      this.timestamps.shift();
    }

    return this.timestamps.length;
  }

  get fps(): number {
    return this.timestamps.length;
  }

  reset(): void {
    this.timestamps = [];
  }
}

/**
 * Measure the execution time of a function.
 */
export function measureTime<T>(fn: () => T): [T, number] {
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  return [result, elapsed];
}

/**
 * Measure the execution time of an async function.
 */
export async function measureTimeAsync<T>(fn: () => Promise<T>): Promise<[T, number]> {
  const start = performance.now();
  const result = await fn();
  const elapsed = performance.now() - start;
  return [result, elapsed];
}

/**
 * Simple exponential moving average for smoothing metrics.
 */
export class EMA {
  private value = 0;
  private initialized = false;
  private alpha: number;

  constructor(alpha: number = 0.1) {
    this.alpha = alpha;
  }

  update(sample: number): number {
    if (!this.initialized) {
      this.value = sample;
      this.initialized = true;
    } else {
      this.value = this.alpha * sample + (1 - this.alpha) * this.value;
    }
    return this.value;
  }

  get current(): number {
    return this.value;
  }

  reset(): void {
    this.value = 0;
    this.initialized = false;
  }
}
