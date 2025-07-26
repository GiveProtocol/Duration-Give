import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock window.crypto
Object.defineProperty(window, "crypto", {
  value: {
    subtle: {
      digest: jest.fn(),
      timingSafeEqual: jest.fn(),
    },
    getRandomValues: jest.fn(),
  },
});

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  root: null,
  rootMargin: "",
  thresholds: [],
}));
Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  value: mockIntersectionObserver,
});

// Mock ResizeObserver
const mockResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
Object.defineProperty(window, "ResizeObserver", {
  writable: true,
  value: mockResizeObserver,
});

// Mock MutationObserver
const mockMutationObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
}));
Object.defineProperty(window, "MutationObserver", {
  writable: true,
  value: mockMutationObserver,
});
