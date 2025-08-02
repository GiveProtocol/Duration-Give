// Shared mock configurations for tests
import React from 'react';

/**
 * Creates a mock Web3 context object for testing
 * @param overrides - Properties to override in the default mock
 * @returns Mock Web3 context object
 */
export const createMockWeb3 = (overrides = {}) => ({
  address: null,
  chainId: null,
  isConnected: false,
  connect: jest.fn(),
  disconnect: jest.fn(),
  switchChain: jest.fn(),
  ...overrides,
});

/**
 * Creates a mock wallet alias hook object for testing
 * @param overrides - Properties to override in the default mock
 * @returns Mock wallet alias hook object
 */
export const createMockWalletAlias = (overrides = {}) => ({
  alias: null,
  aliases: {},
  isLoading: false,
  loading: false,
  error: null,
  setWalletAlias: jest.fn(),
  deleteWalletAlias: jest.fn(),
  ...overrides,
});

/**
 * Creates a mock volunteer verification hook object for testing
 * @param overrides - Properties to override in the default mock
 * @returns Mock volunteer verification hook object
 */
export const createMockVolunteerVerification = (overrides = {}) => ({
  verifyHours: jest.fn(),
  acceptApplication: jest.fn(),
  loading: false,
  error: null,
  ...overrides,
});

/**
 * Creates a mock translation hook object for testing
 * @param overrides - Properties to override in the default mock
 * @returns Mock translation hook object
 */
export const createMockTranslation = (overrides = {}) => ({
  t: jest.fn((key: string, fallback?: string) => fallback || key),
  ...overrides,
});

// Common mock implementations
/**
 * Mock logger object for testing
 */
export const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

/**
 * Mock date formatting function for testing
 */
export const mockFormatDate = jest.fn((date: string) => `Formatted: ${date}`);

/**
 * Mock address shortening function for testing
 */
export const mockShortenAddress = jest.fn((address: string) => 
  `${address.slice(0, 6)}...${address.slice(-4)}`
);

// Mock React components with proper types
interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
}

interface MockInputProps {
  value?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

interface MockCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Mock Button component for testing
 * @param props - Button component props
 * @returns Mock button element
 */
export const MockButton = (props: MockButtonProps) => (
  <button {...props} data-variant={props.variant}>{props.children}</button>
);

/**
 * Mock Input component for testing
 * @param props - Input component props
 * @returns Mock input element
 */
export const MockInput = (props: MockInputProps) => (
  <input {...props} data-testid="alias-input" />
);

/**
 * Mock Card component for testing
 * @param props - Card component props
 * @returns Mock card element
 */
export const MockCard = (props: MockCardProps) => (
  <div {...props} data-testid="card">{props.children}</div>
);

// Common test data
/**
 * Common test wallet addresses
 */
export const testAddresses = {
  mainWallet: '0x1234567890123456789012345678901234567890',
  shortAddress: '0x1234...7890',
};

/**
 * Default props for test components
 */
export const testPropsDefaults = {
  applicationAcceptance: {
    applicationId: 'app-123',
    applicantName: 'John Doe',
    opportunityTitle: 'Beach Cleanup Volunteer',
  },
  volunteerHours: {
    hoursId: 'hours-123',
    volunteerId: 'volunteer-456',
    volunteerName: 'Jane Smith',
    hours: 8,
    datePerformed: '2024-01-15',
    description: 'Helped with beach cleanup and waste sorting',
  },
};