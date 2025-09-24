/**
 * Simple in-memory cache for immediate performance improvements
 * For production, consider upgrading to Redis
 */

interface CacheItem<T> {
  data: T;
  expires: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  /**
   * Set a value in cache with optional TTL
   */
  set<T>(key: string, value: T, ttl?: number): void {
    const expires = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data: value, expires });
  }

  /**
   * Get a value from cache
   */
  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    // Check if expired
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear all expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const cache = new SimpleCache();

// Clean up expired entries every 10 minutes
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

/**
 * Cache decorator for functions
 */
export function cached<T extends (...args: any[]) => any>(
  fn: T,
  keyGenerator?: (...args: Parameters<T>) => string,
  ttl?: number
): T {
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : `fn:${fn.name}:${JSON.stringify(args)}`;
    
    // Try to get from cache first
    const cached = cache.get<ReturnType<T>>(key);
    if (cached !== null) {
      return Promise.resolve(cached);
    }
    
    // Execute function and cache result
    const result = fn(...args);
    
    // Handle both sync and async functions
    if (result instanceof Promise) {
      return result.then((value) => {
        cache.set(key, value, ttl);
        return value;
      });
    } else {
      cache.set(key, result, ttl);
      return result;
    }
  }) as T;
}

/**
 * Cache keys for common data
 */
export const CacheKeys = {
  user: (id: string) => `user:${id}`,
  userReports: (id: string) => `user:${id}:reports`,
  psychologistReports: (id: string) => `psychologist:${id}:reports`,
  userSessions: (id: string) => `user:${id}:sessions`,
  sessionMessages: (id: string) => `session:${id}:messages`,
  psychologistProfile: (id: string) => `psychologist:profile:${id}`,
  userChatrooms: (id: string) => `user:${id}:chatrooms`,
  chatroomMessages: (id: string) => `chatroom:${id}:messages`,
} as const;

/**
 * Helper functions for common cache operations
 */
export const cacheHelpers = {
  // Cache user data
  cacheUser: (user: any, ttl?: number) => {
    cache.set(CacheKeys.user(user._id), user, ttl);
  },

  // Get cached user
  getCachedUser: (userId: string) => {
    return cache.get(CacheKeys.user(userId));
  },

  // Cache user reports
  cacheUserReports: (userId: string, reports: any[], ttl?: number) => {
    cache.set(CacheKeys.userReports(userId), reports, ttl);
  },

  // Get cached user reports
  getCachedUserReports: (userId: string) => {
    return cache.get(CacheKeys.userReports(userId));
  },

  // Invalidate user cache when user data changes
  invalidateUser: (userId: string) => {
    cache.delete(CacheKeys.user(userId));
    cache.delete(CacheKeys.userReports(userId));
    cache.delete(CacheKeys.userSessions(userId));
    cache.delete(CacheKeys.userChatrooms(userId));
  },

  // Invalidate report cache when reports change
  invalidateReports: (userId: string, psychologistId?: string) => {
    cache.delete(CacheKeys.userReports(userId));
    if (psychologistId) {
      cache.delete(CacheKeys.psychologistReports(psychologistId));
    }
  },
};
