import { CacheManager } from '../caching';

// Mock the logger to avoid import.meta issues in tests
jest.mock('../../logger', () => ({
  Logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  }
}));

describe('CacheManager', () => {
  let cache: CacheManager;

  beforeEach(() => {
    // Reset the singleton instance before each test
    CacheManager.resetInstanceForTesting();
    cache = CacheManager.getInstance({ maxSize: 5, ttl: 1000 });
    cache.invalidateAll();
  });

  afterEach(() => {
    cache.invalidateAll();
    CacheManager.resetInstanceForTesting();
  });

  describe('singleton pattern', () => {
    it('should return the same instance', () => {
      const cache1 = CacheManager.getInstance();
      const cache2 = CacheManager.getInstance();
      expect(cache1).toBe(cache2);
    });
  });

  describe('basic cache operations', () => {
    it('should store and retrieve data', async () => {
      const testData = { id: 1, name: 'test' };
      cache.set('test-key', testData);
      
      const result = await cache.get('test-key');
      expect(result).toEqual(testData);
    });

    it('should return null for non-existent keys', async () => {
      const result = await cache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should handle different data types', async () => {
      const stringData = 'test string';
      const numberData = 42;
      const arrayData = [1, 2, 3];
      const objectData = { key: 'value' };

      cache.set('string', stringData);
      cache.set('number', numberData);
      cache.set('array', arrayData);
      cache.set('object', objectData);

      expect(await cache.get('string')).toBe(stringData);
      expect(await cache.get('number')).toBe(numberData);
      expect(await cache.get('array')).toEqual(arrayData);
      expect(await cache.get('object')).toEqual(objectData);
    });
  });

  describe('TTL (Time To Live)', () => {
    it('should expire data after TTL', async () => {
      CacheManager.resetInstanceForTesting();
      const shortTtlCache = CacheManager.getInstance({ ttl: 10, staleWhileRevalidate: 5 }); // 10ms TTL, 5ms stale
      shortTtlCache.set('expire-test', 'data');
      
      // Data should be available immediately
      expect(await shortTtlCache.get('expire-test')).toBe('data');
      
      // Wait for both TTL and stale window to expire
      await new Promise(resolve => setTimeout(resolve, 20));
      
      // Data should be expired
      expect(await shortTtlCache.get('expire-test')).toBeNull();
    });

    it('should serve stale data within staleWhileRevalidate window', async () => {
      CacheManager.resetInstanceForTesting();
      const staleCache = CacheManager.getInstance({ 
        ttl: 10, 
        staleWhileRevalidate: 50 
      });
      
      staleCache.set('stale-test', 'stale-data');
      
      // Wait for TTL to expire but stay within stale window
      await new Promise(resolve => setTimeout(resolve, 25));
      
      // Should still return stale data
      const result = await staleCache.get('stale-test');
      expect(result).toBe('stale-data');
    });

    it('should remove data after stale window expires', async () => {
      CacheManager.resetInstanceForTesting();
      const expiredCache = CacheManager.getInstance({ 
        ttl: 10, 
        staleWhileRevalidate: 20 
      });
      
      expiredCache.set('expired-test', 'expired-data');
      
      // Wait for both TTL and stale window to expire
      await new Promise(resolve => setTimeout(resolve, 35));
      
      // Data should be completely removed
      expect(await expiredCache.get('expired-test')).toBeNull();
    });
  });

  describe('cache size limits', () => {
    it('should evict oldest entries when max size is reached', async () => {
      CacheManager.resetInstanceForTesting();
      const smallCache = CacheManager.getInstance({ maxSize: 3 });
      smallCache.invalidateAll();
      
      // Fill cache to capacity
      smallCache.set('key1', 'value1');
      smallCache.set('key2', 'value2');
      smallCache.set('key3', 'value3');
      
      // All should be retrievable
      expect(await smallCache.get('key1')).toBe('value1');
      expect(await smallCache.get('key2')).toBe('value2');
      expect(await smallCache.get('key3')).toBe('value3');
      
      // Add one more to trigger eviction
      smallCache.set('key4', 'value4');
      
      // Oldest (key1) should be evicted
      expect(await smallCache.get('key1')).toBeNull();
      expect(await smallCache.get('key2')).toBe('value2');
      expect(await smallCache.get('key3')).toBe('value3');
      expect(await smallCache.get('key4')).toBe('value4');
    });
  });

  describe('cache invalidation', () => {
    it('should invalidate specific keys', async () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      
      cache.invalidate('key1');
      
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBe('value2');
    });

    it('should invalidate all keys', async () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');
      
      cache.invalidateAll();
      
      expect(await cache.get('key1')).toBeNull();
      expect(await cache.get('key2')).toBeNull();
      expect(await cache.get('key3')).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined values', async () => {
      cache.set('null-key', null);
      cache.set('undefined-key', undefined);
      
      expect(await cache.get('null-key')).toBeNull();
      expect(await cache.get('undefined-key')).toBeUndefined();
    });

    it('should handle empty string keys', async () => {
      cache.set('', 'empty-key-value');
      expect(await cache.get('')).toBe('empty-key-value');
    });

    it('should handle special characters in keys', async () => {
      const specialKey = 'key!@#$%^&*()_+-=[]{}|;:,.<>?';
      cache.set(specialKey, 'special-value');
      expect(await cache.get(specialKey)).toBe('special-value');
    });
  });
});