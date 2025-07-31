// Test data for input validation tests
/* eslint-disable no-unused-vars */
export const validationTestCases = {
  email: {
    valid: [
      'test@example.com',
      'user.name+tag@domain.co.uk',
      'user123@test-domain.org',
    ],
    invalid: [
      '',
      'invalid', 
      'test@',
      '@example.com',
      'test@.com',
      'test@example',
      'test..test@example.com',
    ],
  },
  password: {
    valid: [
      'Password123!',
      'SecurePass1@',
      'MyP@ssw0rd',
    ],
    invalid: [
      { value: '', reason: 'empty' },
      { value: 'password', reason: 'no uppercase, no number, no special' },
      { value: 'PASSWORD', reason: 'no lowercase, no number, no special' },
      { value: 'Password', reason: 'no number, no special' },
      { value: 'Password1', reason: 'no special character' },
      { value: 'Pass1!', reason: 'too short' },
      { value: 'password123!', reason: 'no uppercase' },
    ],
  },
  url: {
    valid: [
      'https://example.com',
      'https://www.example.com',
      'https://example.com/path',
      'https://subdomain.example.com/path/to/page',
      'https://api.example.co.uk/v1/endpoint',
    ],
    invalid: [
      { value: '', reason: 'empty' },
      { value: 'http://example.com', reason: 'not HTTPS' },
      { value: 'https://', reason: 'incomplete' },
      { value: 'https://example', reason: 'no TLD' },
      { value: 'example.com', reason: 'no protocol' },
      { value: 'ftp://example.com', reason: 'wrong protocol' },
    ],
  },
  amount: {
    valid: [
      10,
      100.50,
      0.01,
      999999.99,
      1000000, // max amount
    ],
    invalid: [
      { value: 0, reason: 'zero' },
      { value: -10, reason: 'negative' },
      { value: 1000001, reason: 'too large' },
      { value: 10.123, reason: 'more than 2 decimal places' },
      { value: Infinity, reason: 'infinity' },
      { value: -Infinity, reason: 'negative infinity' },
      { value: NaN, reason: 'NaN' },
    ],
    decimalPrecision: {
      valid: [0.99, 1.00],
      invalid: [
        { value: 10.999, reason: '3 decimal places' },
        { value: 0.001, reason: '3 decimal places' },
      ],
    },
  },
  sanitization: {
    htmlRemoval: [
      { input: '<script>alert("test")</script>', expected: 'scriptalert(test)/script' },
      { input: '<div>content</div>', expected: 'divcontent/div' },
    ],
    quoteRemoval: [
      { input: 'text with "quotes" and \'single quotes\'', expected: 'text with quotes and single quotes' },
    ],
    whitespaceHandling: [
      { input: '  test  ', expected: 'test' },
      { input: '\n\ttest\n\t', expected: 'test' },
      { input: '', expected: '' },
      { input: '   ', expected: '' },
      { input: '\n\t', expected: '' },
    ],
    safeContent: [
      { input: 'normal text', expected: 'normal text' },
      { input: 'text with numbers 123', expected: 'text with numbers 123' },
      { input: 'text-with-dashes_and_underscores', expected: 'text-with-dashes_and_underscores' },
    ],
  },
};

// Helper functions to reduce test duplication
export const testValidCases = (validator: (input: any) => boolean, cases: any[]) => {
  cases.forEach(testCase => {
    const value = typeof testCase === 'object' ? testCase.value : testCase;
    expect(validator(value)).toBe(true);
  });
};

export const testInvalidCases = (validator: (input: any) => boolean, cases: any[]) => {
  cases.forEach(testCase => {
    const value = typeof testCase === 'object' ? testCase.value : testCase;
    expect(validator(value)).toBe(false);
  });
};