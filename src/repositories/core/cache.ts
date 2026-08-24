// Process-wide read cache shared by the repositories.
//
// Route components unmount when users leave a page. Keeping successful results
// and in-flight requests at module scope means revisiting a route does not
// refetch the same data or briefly replace cards with shimmers.

const responseCache = new Map<string, unknown>();
const requestCache = new Map<string, Promise<unknown>>();

/**
 * Resolve `key` from cache, join an in-flight request for it, or start one.
 * Failures are not cached, so the next caller retries.
 */
export function cachedRequest<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (responseCache.has(key)) {
    return Promise.resolve(responseCache.get(key) as T);
  }
  const pending = requestCache.get(key) as Promise<T> | undefined;
  if (pending) return pending;

  const request = load()
    .then((result) => {
      responseCache.set(key, result);
      requestCache.delete(key);
      return result;
    })
    .catch((error) => {
      requestCache.delete(key);
      throw error;
    });
  requestCache.set(key, request);
  return request;
}

/** Synchronous cache read, for seeding state before the first paint. */
export function peekCache<T>(key: string): T | undefined {
  return responseCache.get(key) as T | undefined;
}

/** Drop a cached entry so the next read goes back to the network. */
export function invalidateCache(key: string): void {
  responseCache.delete(key);
  requestCache.delete(key);
}
