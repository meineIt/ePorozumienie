/**
 * Prosty rate limiter używający Map w pamięci
 * W produkcji należy użyć Redis lub innego rozwiązania rozproszonego
 */

interface RateLimitOptions {
  interval: number; // w milisekundach
  uniqueTokenPerInterval: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

export function rateLimit(options: RateLimitOptions) {
  return {
    async check(limit: number, token: string): Promise<void> {
      const now = Date.now();
      const entry = store.get(token);

      if (!entry || now > entry.resetTime) {
        // Nowy wpis lub wygasły
        store.set(token, {
          count: 1,
          resetTime: now + options.interval,
        });
        return;
      }

      if (entry.count >= limit) {
        const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
        throw new Error(`Rate limit exceeded. Retry after ${retryAfter} seconds`);
      }

      entry.count++;
    },
  };
}

// Czyszczenie starych wpisów co 5 minut
setInterval(() => {
  const now = Date.now();
  for (const [token, entry] of store.entries()) {
    if (now > entry.resetTime) {
      store.delete(token);
    }
  }
}, 5 * 60 * 1000);


