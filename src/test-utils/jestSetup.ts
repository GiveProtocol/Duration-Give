import React from "react";

/**
 * Common Jest mock configurations
 * This file provides reusable mock objects to eliminate duplication across test files
 */

/**
 * Standard mock implementations for common utilities
 */
export const commonMocks = {
  logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
  formatDate: jest.fn((date: string) => new Date(date).toLocaleDateString()),
  shortenAddress: jest.fn(
    (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`,
  ),
};

/**
 * Standard mock factories for hooks
 */
export const createHookMocks = () => ({
  web3: {
    address: null,
    chainId: null,
    isConnected: false,
    connect: jest.fn(),
    disconnect: jest.fn(),
    switchChain: jest.fn(),
  },
  auth: {
    user: null,
    signOut: jest.fn(),
  },
  wallet: {
    getInstalledWallets: jest.fn(() => [
      { name: "MetaMask", id: "metamask" },
      { name: "WalletConnect", id: "walletconnect" },
    ]),
    connectWallet: jest.fn(),
  },
  walletAlias: {
    alias: null,
    aliases: {},
    isLoading: false,
    loading: false,
    error: null,
    setWalletAlias: jest.fn(),
    deleteWalletAlias: jest.fn(),
  },
  volunteerVerification: {
    verifyHours: jest.fn(),
    acceptApplication: jest.fn(),
    loading: false,
    error: null,
  },
  translation: {
    t: jest.fn((key: string, fallback?: string) => fallback || key),
  },
});

/**
 * Common component mock implementations
 */
export const componentMocks = {
  Button: ({ children, onClick, variant, disabled, className, type }: any) =>
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
    ),
  Input: ({ value, onChange, placeholder, type }: any) =>
    React.createElement("input", {
      value,
      onChange,
      placeholder,
      type,
      "data-testid": "alias-input",
    }),
  Card: ({ children, className }: any) =>
    React.createElement(
      "div",
      {
        className,
        "data-testid": "card",
      },
      children,
    ),
};
