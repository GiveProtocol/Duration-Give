// Common Jest mock setup that can be imported by test files
import {
  createMockWeb3,
  createMockWalletAlias,
  createMockVolunteerVerification,
  createMockTranslation,
  mockLogger,
  mockFormatDate,
  mockShortenAddress,
  MockButton,
  MockInput,
  MockCard,
} from "./mockSetup";

/**
 * Sets up common Jest mocks for all test modules
 * Mocks Web3Context, AuthContext, hooks, utilities, and UI components
 */
export const setupCommonMocks = () => {
  // Web3 Context mock
  jest.mock("@/contexts/Web3Context", () => ({
    useWeb3: jest.fn(() => createMockWeb3()),
  }));

  // Auth Context mock
  jest.mock("@/contexts/AuthContext", () => ({
    useAuth: jest.fn(() => ({
      user: null,
      signOut: jest.fn(),
    })),
  }));

  // Wallet hooks mock
  jest.mock("@/hooks/useWallet", () => ({
    useWallet: jest.fn(() => ({
      getInstalledWallets: jest.fn(() => [
        { name: "MetaMask", id: "metamask" },
        { name: "WalletConnect", id: "walletconnect" },
      ]),
      connectWallet: jest.fn(),
    })),
  }));

  // Wallet Alias hook mock
  jest.mock("@/hooks/useWalletAlias", () => ({
    useWalletAlias: jest.fn(() => createMockWalletAlias()),
  }));

  // Volunteer Verification hook mock
  jest.mock("@/hooks/useVolunteerVerification", () => ({
    useVolunteerVerification: jest.fn(() => createMockVolunteerVerification()),
  }));

  // Translation hook mock
  jest.mock("@/hooks/useTranslation", () => ({
    useTranslation: jest.fn(() => createMockTranslation()),
  }));

  // Utility mocks
  jest.mock("@/utils/web3", () => ({
    shortenAddress: mockShortenAddress,
  }));

  jest.mock("@/utils/logger", () => ({
    Logger: mockLogger,
  }));

  jest.mock("@/utils/date", () => ({
    formatDate: mockFormatDate,
  }));

  // Config mocks
  jest.mock("@/config/contracts", () => ({
    CHAIN_IDS: {
      moonbase: 1287,
    },
  }));

  // UI Component mocks
  jest.mock("@/components/ui/Button", () => ({
    Button: MockButton,
  }));

  jest.mock("@/components/ui/Input", () => ({
    Input: MockInput,
  }));

  jest.mock("@/components/ui/Card", () => ({
    Card: MockCard,
  }));
};
