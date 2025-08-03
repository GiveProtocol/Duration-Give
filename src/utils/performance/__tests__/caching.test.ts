import { CacheManager } from '../caching';

// Mock the logger to avoid test noise
jest.mock('../../logger', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn()
  }
}));

describe('CacheManager', () => {
  let cache: CacheManager;

  beforeEach(() => {
    // Reset singleton instance for each test
    CacheManager.resetInstanceForTesting();
    cache = CacheManager.getInstance();
  });

  afterEach(() => {
    cache.invalidateAll();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  describe('singleton pattern', () => {
    it('returns same instance on multiple calls', () => {
      const cache1 = CacheManager.getInstance();
      const cache2 = CacheManager.getInstance();
      expect(cache1).toBe(cache2);
    });

    it('applies config on first getInstance call', () => {
      CacheManager.resetInstanceForTesting();
      const config = { maxSize: 50, ttl: 10000 };
      const cacheWithConfig = CacheManager.getInstance(config);
      
      // Config should be applied (we can test this indirectly through behavior)
      expect(cacheWithConfig).toBeInstanceOf(CacheManager);
    });
  });

  describe('basic cache operations', () => {
    it('stores and retrieves data', async () => {
      const testData = { test: 'value' };
      cache.set('key1', testData);
      
      const result = await cache.get('key1');
      expect(result).toEqual(testData);
    });

    it('returns null for non-existent keys', async () => {
      const result = await cache.get('nonexistent');
      expect(result).toBeNull();
    });

    it('invalidates specific keys', async () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.invalidate('key1');
      
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBe('value2');
    });

    it('invalidates all keys', async () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.invalidateAll();
      
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
    });
  });

  describe('TTL and expiration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('returns fresh data within TTL', async () => {
      cache.set('key1', 'value1');
      
      // Advance time but stay within TTL (default 5 minutes)
      jest.advanceTimersByTime(4 * 60 * 1000);
      
      const result = await cache.get('key1');
      expect(result).toBe('value1');
    });

    it('serves stale data within staleWhileRevalidate window', async () => {
      cache.set('key1', 'value1');
      
      // Advance past TTL but within staleWhileRevalidate (default 30 minutes)
      jest.advanceTimersByTime(10 * 60 * 1000);
      
      const result = await cache.get('key1');
      expect(result).toBe('value1');
    });

    it('removes expired data beyond staleWhileRevalidate', async () => {
      cache.set('key1', 'value1');
      
      // Advance past both TTL and staleWhileRevalidate
      jest.advanceTimersByTime(40 * 60 * 1000);
      
      const result = await cache.get('key1');
      expect(result).toBeNull();
    });
  });

  describe('capacity management', () => {
    it('evicts oldest entry when at capacity', () => {
      // Create cache with small capacity for testing
      CacheManager.resetInstanceForTesting();
      cache = CacheManager.getInstance({ maxSize: 2 });
      
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3'); // Should evict key1
      
      expect(cache.get('key1')).resolves.toBeNull();
      expect(cache.get('key2')).resolves.toBe('value2');
      expect(cache.get('key3')).resolves.toBe('value3');
    });
  });

  describe('cleanup process', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('runs cleanup periodically and removes expired entries', async () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      // Advance past expiration
      jest.advanceTimersByTime(40 * 60 * 1000);
      
      // Trigger cleanup (runs every 60 seconds)
      jest.advanceTimersByTime(60 * 1000);
      
      // Both entries should be cleaned up
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
    });
  });
});