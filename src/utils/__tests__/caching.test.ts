import { CacheManager } from '../caching';

describe('CacheManager', () => {
  let cache: CacheManager;

  beforeEach(() => {
    // Get a fresh instance
    cache = CacheManager.getInstance();
    cache.clear();
  });

  afterEach(() => {
    cache.clear();
  });

  describe('singleton pattern', () => {
    it('returns same instance on multiple calls', () => {
      const cache1 = CacheManager.getInstance();
      const cache2 = CacheManager.getInstance();
      expect(cache1).toBe(cache2);
    });

    it('applies configuration on first getInstance call', () => {
      const config = { maxSize: 50, ttl: 10000 };
      const cacheWithConfig = CacheManager.getInstance(config);
      expect(cacheWithConfig).toBeInstanceOf(CacheManager);
    });
  });

  describe('cache operations', () => {
    it('stores and retrieves data', () => {
      const testData = { test: 'value' };
      cache.set('key1', testData);

      const result = cache.get('key1');
      expect(result).toEqual(testData);
    });

    it('returns null for non-existent keys', () => {
      const result = cache.get('nonexistent');
      expect(result).toBeNull();
    });

    it('handles different data types', () => {
      cache.set('string', 'hello');
      cache.set('number', 42);
      cache.set('boolean', true);
      cache.set('object', { nested: 'value' });
      cache.set('array', [1, 2, 3]);

      expect(cache.get('string')).toBe('hello');
      expect(cache.get('number')).toBe(42);
      expect(cache.get('boolean')).toBe(true);
      expect(cache.get('object')).toEqual({ nested: 'value' });
      expect(cache.get('array')).toEqual([1, 2, 3]);
    });

    it('overwrites existing keys', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2');

      expect(cache.get('key1')).toBe('value2');
    });
  });

  describe('TTL and expiration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns fresh data within TTL', () => {
      cache.set('key1', 'value1');

      // Advance time but stay within TTL (default 5 minutes)
      jest.advanceTimersByTime(4 * 60 * 1000);

      const result = cache.get('key1');
      expect(result).toBe('value1');
    });

    it('returns null for expired data', () => {
      cache.set('key1', 'value1');

      // Advance past TTL (default 5 minutes)
      jest.advanceTimersByTime(6 * 60 * 1000);

      const result = cache.get('key1');
      expect(result).toBeNull();
    });

    it('handles multiple entries with different expiration times', () => {
      cache.set('key1', 'value1');
      
      // Advance 2 minutes
      jest.advanceTimersByTime(2 * 60 * 1000);
      cache.set('key2', 'value2');
      
      // Advance another 4 minutes (key1 expired, key2 still valid)
      jest.advanceTimersByTime(4 * 60 * 1000);
      
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('capacity management', () => {
    it('evicts oldest entry when at capacity', () => {
      // Fill up to capacity and verify eviction behavior
      // Since we can't control the singleton's capacity here,
      // we'll test the behavior indirectly
      for (let i = 0; i < 150; i++) {
        cache.set(`key${i}`, `value${i}`);
      }
      
      // The first entries should be evicted (default capacity is 100)
      expect(cache.get('key0')).toBeNull();
      expect(cache.get('key149')).toBe('value149');
    });

    it('overwrites existing entries', () => {
      cache.set('key1', 'value1');
      cache.set('key1', 'value2'); // Overwrite

      expect(cache.get('key1')).toBe('value2');
    });

    it('handles many entries', () => {
      // Test with many entries
      for (let i = 0; i < 50; i++) {
        cache.set(`test${i}`, `testvalue${i}`);
      }
      
      // Verify some entries exist
      expect(cache.get('test0')).toBe('testvalue0');
      expect(cache.get('test49')).toBe('testvalue49');
    });
  });

  describe('clear functionality', () => {
    it('removes all entries', () => {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.clear();

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
      expect(cache.get('key3')).toBeNull();
    });

    it('allows new entries after clear', () => {
      cache.set('key1', 'value1');
      cache.clear();
      cache.set('key2', 'value2');

      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
    });
  });

  describe('edge cases', () => {
    it('handles null and undefined values', () => {
      cache.set('null-key', null);
      cache.set('undefined-key', undefined);

      expect(cache.get('null-key')).toBeNull();
      expect(cache.get('undefined-key')).toBeUndefined();
    });

    it('handles empty string keys', () => {
      cache.set('', 'empty-key-value');
      expect(cache.get('')).toBe('empty-key-value');
    });

    it('handles special characters in keys', () => {
      const specialKey = 'key-with-!@#$%^&*()_+{}[]|\\:";\'<>?,./';
      cache.set(specialKey, 'special-value');
      expect(cache.get(specialKey)).toBe('special-value');
    });

    it('handles very large objects', () => {
      const largeObject = {
        data: 'x'.repeat(10000),
        nested: {
          moreData: 'y'.repeat(5000),
          deepNested: {
            evenMore: 'z'.repeat(3000)
          }
        }
      };

      cache.set('large-object', largeObject);
      expect(cache.get('large-object')).toEqual(largeObject);
    });
  });
});