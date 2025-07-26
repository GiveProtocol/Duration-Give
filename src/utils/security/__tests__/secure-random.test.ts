// Test for SecureRandom utilities only
// Mock crypto.getRandomValues for testing
const mockGetRandomValues = jest.fn();
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: mockGetRandomValues,
  },
});

/**
 * Cryptographically secure random number generation utilities
 */
const SecureRandom = {
  /**
   * Generate a cryptographically secure random string
   * @param length - Length of the string to generate
   * @returns Secure random string
   */
  generateSecureId(length = 16): string {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(36)).join('').substring(0, length);
  },

  /**
   * Generate a cryptographically secure random number within a range
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (exclusive)
   * @returns Secure random number
   */
  generateSecureNumber(min = 0, max = 1000000): number {
    const range = max - min;
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return min + (array[0] % range);
  },

  /**
   * Generate a cryptographically secure transaction ID
   * @returns Secure transaction ID in hex format
   */
  generateTransactionId(): string {
    const array = new Uint8Array(20); // 40 hex characters
    crypto.getRandomValues(array);
    return `0x${Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')}`;
  }
} as const;

describe('SecureRandom', () => {
  beforeEach(() => {
    mockGetRandomValues.mockClear();
  });

  describe('generateSecureId', () => {
    it('should generate a secure ID with default length', () => {
      const mockArray = new Uint8Array(16);
      mockArray.fill(65); // Fill with 'A' equivalent
      mockGetRandomValues.mockImplementation((array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = mockArray[i] || 65;
        }
        return array;
      });

      const result = SecureRandom.generateSecureId();
      
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
      expect(typeof result).toBe('string');
      expect(result.length).toBeLessThanOrEqual(16);
    });

    it('should generate a secure ID with custom length', () => {
      const mockArray = new Uint8Array(10);
      mockArray.fill(65);
      mockGetRandomValues.mockImplementation((array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = mockArray[i] || 65;
        }
        return array;
      });

      const result = SecureRandom.generateSecureId(10);
      
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
      expect(typeof result).toBe('string');
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });

  describe('generateSecureNumber', () => {
    it('should generate a secure number within default range', () => {
      const mockArray = new Uint32Array(1);
      mockArray[0] = 500000; // Mid-range value
      mockGetRandomValues.mockImplementation((array) => {
        array[0] = mockArray[0];
        return array;
      });

      const result = SecureRandom.generateSecureNumber();
      
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint32Array));
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1000000);
    });

    it('should generate a secure number within custom range', () => {
      const mockArray = new Uint32Array(1);
      mockArray[0] = 15; // Should result in 10 + (15 % 10) = 15
      mockGetRandomValues.mockImplementation((array) => {
        array[0] = mockArray[0];
        return array;
      });

      const result = SecureRandom.generateSecureNumber(10, 20);
      
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint32Array));
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(10);
      expect(result).toBeLessThan(20);
    });
  });

  describe('generateTransactionId', () => {
    it('should generate a secure transaction ID', () => {
      const mockArray = new Uint8Array(20);
      mockArray.fill(171); // 0xAB in hex
      mockGetRandomValues.mockImplementation((array) => {
        for (let i = 0; i < array.length; i++) {
          array[i] = mockArray[i];
        }
        return array;
      });

      const result = SecureRandom.generateTransactionId();
      
      expect(mockGetRandomValues).toHaveBeenCalledWith(expect.any(Uint8Array));
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^0x[a-f0-9]{40}$/);
      expect(result.length).toBe(42); // '0x' + 40 hex characters
    });
  });
});