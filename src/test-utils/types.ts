// Shared TypeScript interfaces for test components
// This file eliminates duplication of component prop types across test files

import React from 'react';

/**
 * Base interface for all mock UI components with common HTML attributes
 */
export interface MockUIComponentProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  type?: string;
  value?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  [key: string]: unknown;
}

/**
 * Legacy interfaces for backward compatibility - extend from base
 */
export interface MockButtonProps extends Pick<MockUIComponentProps, 'children' | 'onClick' | 'variant' | 'disabled' | 'className' | 'type'> {}
export interface MockInputProps extends Pick<MockUIComponentProps, 'value' | 'onChange' | 'placeholder' | 'type'> {}
export interface MockCardProps extends Pick<MockUIComponentProps, 'children' | 'className'> {}

/**
 * Common interface for mock auth hook return type
 */
export interface MockAuthReturn {
  user: { id: string } | null;
  userType: string | null;
  signOut: jest.Mock;
  loading: boolean;
}

/**
 * Common interface for mock web3 hook return type
 */
export interface MockWeb3Return {
  address: string | null;
  isConnected: boolean;
}

/**
 * Common interface for mock profile hook return type
 */
export interface MockProfileReturn {
  profile: { id: string; name?: string } | null;
  loading: boolean;
  error: string | null;
  refetch: jest.Mock;
}

/**
 * Common interface for mock translation hook return type
 */
export interface MockTranslationReturn {
  t: jest.Mock;
}

/**
 * Common interface for mock volunteer verification hook return type
 */
export interface MockVolunteerVerificationReturn {
  verifyHours: jest.Mock;
  acceptApplication: jest.Mock;
  loading: boolean;
  error: string | null;
}

/**
 * Props interface for mock DonationExportModal component
 */
export interface MockDonationExportModalProps {
  donations: Array<{
    id: string;
    amount: number;
    timestamp: string;
    [key: string]: unknown;
  }>;
  onClose: () => void;
}

/**
 * Shared CSS class patterns for test assertions
 * Centralizes common styling patterns to reduce duplication
 */
export const cssClasses = {
  card: {
    default: ['bg-white', 'border', 'border-gray-200', 'rounded-lg', 'p-4'],
    success: ['bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4'],
    error: ['p-3', 'bg-red-50', 'text-red-700', 'text-sm', 'rounded-md'],
  },
  button: {
    primary: ['flex', 'items-center'],
    secondary: ['flex', 'items-center'],
  },
  spinner: {
    default: ['animate-spin'],
  },
};