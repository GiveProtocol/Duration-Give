// Shared mock configurations for tests
import React from "react";
export const createMockWeb3 = (overrides = {}) => ({
  address: null,
  chainId: null,
  isConnected: false,
  connect: jest.fn(),
  disconnect: jest.fn(),
  switchChain: jest.fn(),
  ...overrides,
});

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

export const createMockVolunteerVerification = (overrides = {}) => ({
  verifyHours: jest.fn(),
  acceptApplication: jest.fn(),
  loading: false,
  error: null,
  ...overrides,
});

export const createMockTranslation = (overrides = {}) => ({
  t: jest.fn((key: string, fallback?: string) => fallback || key),
  ...overrides,
});

// Common mock implementations
export const mockLogger = {
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
};

export const mockFormatDate = jest.fn((date: string) => `Formatted: ${date}`);

export const mockShortenAddress = jest.fn(
  (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
);

// Mock React components
export const MockButton = ({
  children,
  onClick,
  disabled,
  variant,
  className,
  type,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: string;
  className?: string;
  type?: string;
}) =>
  React.createElement(
    "button",
    {
      onClick,
      disabled,
      "data-variant": variant,
      className,
      type,
    },
    children,
  );

export const MockInput = ({
  value,
  onChange,
  placeholder,
  type,
}: {
  value: string;
  onChange: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) =>
  React.createElement("input", {
    value,
    onChange,
    placeholder,
    type,
    "data-testid": "alias-input",
  });

export const MockCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) =>
  React.createElement(
    "div",
    {
      className,
      "data-testid": "card",
    },
    children,
  );

// Common test data
export const testAddresses = {
  mainWallet: "0x1234567890123456789012345678901234567890",
  shortAddress: "0x1234...7890",
};

export const testPropsDefaults = {
  applicationAcceptance: {
    applicationId: "app-123",
    applicantName: "John Doe",
    opportunityTitle: "Beach Cleanup Volunteer",
  },
  volunteerHours: {
    hoursId: "hours-123",
    volunteerId: "volunteer-456",
    volunteerName: "Jane Smith",
    hours: 8,
    datePerformed: "2024-01-15",
    description: "Helped with beach cleanup and waste sorting",
  },
};
