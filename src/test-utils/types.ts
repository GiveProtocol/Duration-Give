// Shared TypeScript interfaces for test components
// This file eliminates duplication of component prop types across test files

import React from "react";

/**
 * Common interface for mocked Button component props
 */
export interface MockButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  className?: string;
  type?: string;
}

/**
 * Common interface for mocked Input component props
 */
export interface MockInputProps {
  value?: string;
  onChange?: (_e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}

/**
 * Common interface for mocked Card component props
 */
export interface MockCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Common interface for mock auth hook return type
 */
export interface MockAuthReturn {
  user: { id: string } | null;
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
