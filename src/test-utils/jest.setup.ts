import '@testing-library/jest-dom';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    // Empty constructor for test mock
  }
  disconnect() {
    // Empty method for test mock
  }
  observe() {
    // Empty method for test mock
  }
  unobserve() {
    // Empty method for test mock
  }
} as typeof IntersectionObserver;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {
    // Empty constructor for test mock
  }
  disconnect() {
    // Empty method for test mock
  }
  observe() {
    // Empty method for test mock
  }
  unobserve() {
    // Empty method for test mock
  }
} as typeof ResizeObserver;