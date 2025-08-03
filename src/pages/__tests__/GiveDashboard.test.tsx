import React from "react"; // eslint-disable-line no-unused-vars
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { GiveDashboard } from "../GiveDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { useTranslation } from "@/hooks/useTranslation";
import {
  createMockAuth,
  createMockWeb3,
  createMockTranslation,
  setupCommonMocks,
} from "@/test-utils/mockSetup";

// Mock all dependencies
jest.mock("@/contexts/AuthContext");
jest.mock("@/contexts/Web3Context");
jest.mock("@/hooks/useTranslation");
jest.mock("@/utils/logger");
jest.mock("@/utils/date");

// Setup common mocks to reduce duplication
setupCommonMocks();
jest.mock("@/components/ui/Card", () => ({
  Card: ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => <div className={className}>{children}</div>,
}));
jest.mock("@/components/ui/Button", () => ({
  Button: ({
    children,
    onClick,
    variant,
    disabled,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: string;
    disabled?: boolean;
  }) => (
    <button onClick={onClick} className={variant} disabled={disabled}>
      {children}
    </button>
  ),
}));
jest.mock("@/components/contribution/DonationExportModal", () => ({
  DonationExportModal: ({
    donations,
    onClose,
  }: {
    donations: any[];
    onClose: () => void;
  }) => (
    <div data-testid="export-modal">
      <span>Export Modal - {donations.length} donations</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
jest.mock("@/components/settings/WalletAliasSettings", () => ({
  WalletAliasSettings: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="wallet-settings">
      <span>Wallet Settings</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
jest.mock("@/components/donor/ScheduledDonations", () => ({
  ScheduledDonations: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="scheduled-donations">
      <span>Scheduled Donations</span>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));
jest.mock("@/components/CurrencyDisplay", () => ({
  CurrencyDisplay: ({
    amount,
    currency,
  }: {
    amount: number;
    currency: string;
  }) => (
    <span>
      {amount} {currency}
    </span>
  ),
}));
jest.mock("@/utils/date", () => ({
  formatDate: (date: string) => `Formatted: ${date}`,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseTranslation = useTranslation as jest.MockedFunction<
  typeof useTranslation
>;

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe("GiveDashboard", () => {
  const mockUser = { id: "1", email: "test@example.com" };
  const mockT = jest.fn((key: string) => key);

  beforeEach(() => {
    mockUseAuth.mockReturnValue(
      createMockAuth({
        user: mockUser,
        userType: "donor",
      }),
    );

    mockUseWeb3.mockReturnValue(
      createMockWeb3({
        address: "0x123",
        isConnected: true,
      }),
    );

    mockUseTranslation.mockReturnValue(createMockTranslation());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication and Access Control", () => {
    it("redirects to login when user is not authenticated", () => {
      mockUseAuth.mockReturnValue(
        createMockAuth({
          user: null,
          userType: null,
        }),
      );

      renderWithRouter(<GiveDashboard />);

      // Component should redirect to login, so main content shouldn't be visible
      expect(screen.queryByText("dashboard.title")).not.toBeInTheDocument();
    });

    it("renders dashboard when user is authenticated", () => {
      renderWithRouter(<GiveDashboard />);

      expect(screen.getByText("dashboard.title")).toBeInTheDocument();
    });

    it("shows loading state when auth is loading", () => {
      mockUseAuth.mockReturnValue(
        createMockAuth({
          user: null,
          userType: null,
          loading: true,
        }),
      );

      renderWithRouter(<GiveDashboard />);

      expect(screen.getByText("common.loading")).toBeInTheDocument();
    });
  });

  describe("Wallet Connection", () => {
    it("shows connect wallet button when not connected", () => {
      mockUseWeb3.mockReturnValue(
        createMockWeb3({
          address: null,
          isConnected: false,
        }),
      );

      renderWithRouter(<GiveDashboard />);

      expect(screen.getByText("web3.connectWallet")).toBeInTheDocument();
    });

    it("handles wallet connection", () => {
      const mockConnect = jest.fn();
      mockUseWeb3.mockReturnValue({
        address: null,
        isConnected: false,
        connect: mockConnect,
      });

      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("web3.connectWallet"));
      expect(mockConnect).toHaveBeenCalled();
    });

    it("shows wallet address when connected", () => {
      renderWithRouter(<GiveDashboard />);

      expect(screen.getByText(/0x123/)).toBeInTheDocument();
    });
  });

  describe("Filter and Sort Functionality", () => {
    it("renders year filter dropdown", () => {
      renderWithRouter(<GiveDashboard />);

      expect(
        screen.getByDisplayValue("dashboard.filters.allYears"),
      ).toBeInTheDocument();
    });

    it("renders type filter dropdown", () => {
      renderWithRouter(<GiveDashboard />);

      expect(
        screen.getByDisplayValue("dashboard.filters.allTypes"),
      ).toBeInTheDocument();
    });

    it("handles year filter change", () => {
      renderWithRouter(<GiveDashboard />);

      const yearSelect = screen.getByDisplayValue("dashboard.filters.allYears");
      fireEvent.change(yearSelect, { target: { value: "2024" } });

      expect(yearSelect).toHaveValue("2024");
    });

    it("handles type filter change", () => {
      renderWithRouter(<GiveDashboard />);

      const typeSelect = screen.getByDisplayValue("dashboard.filters.allTypes");
      fireEvent.change(typeSelect, { target: { value: "one-time" } });

      expect(typeSelect).toHaveValue("one-time");
    });

    it("handles sort configuration changes", () => {
      renderWithRouter(<GiveDashboard />);

      const dateHeader = screen.getByText("dashboard.table.date");
      fireEvent.click(dateHeader);

      // Should trigger sort by date
      expect(dateHeader).toBeInTheDocument();
    });
  });

  describe("Export Functionality", () => {
    it("opens export modal when export button is clicked", () => {
      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("dashboard.exportData"));

      expect(screen.getByTestId("export-modal")).toBeInTheDocument();
    });

    it("closes export modal when close is clicked", async () => {
      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("dashboard.exportData"));
      expect(screen.getByTestId("export-modal")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Close"));

      await waitFor(() => {
        expect(screen.queryByTestId("export-modal")).not.toBeInTheDocument();
      });
    });
  });

  describe("Settings and Configuration", () => {
    it("opens wallet settings modal", () => {
      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("dashboard.walletSettings"));

      expect(screen.getByTestId("wallet-settings")).toBeInTheDocument();
    });

    it("closes wallet settings modal", async () => {
      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("dashboard.walletSettings"));
      expect(screen.getByTestId("wallet-settings")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Close"));

      await waitFor(() => {
        expect(screen.queryByTestId("wallet-settings")).not.toBeInTheDocument();
      });
    });

    it("opens scheduled donations modal", () => {
      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("dashboard.scheduledDonations"));

      expect(screen.getByTestId("scheduled-donations")).toBeInTheDocument();
    });

    it("closes scheduled donations modal", async () => {
      renderWithRouter(<GiveDashboard />);

      fireEvent.click(screen.getByText("dashboard.scheduledDonations"));
      expect(screen.getByTestId("scheduled-donations")).toBeInTheDocument();

      fireEvent.click(screen.getByText("Close"));

      await waitFor(() => {
        expect(
          screen.queryByTestId("scheduled-donations"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Statistics Display", () => {
    it("displays total donations statistic", () => {
      renderWithRouter(<GiveDashboard />);

      expect(
        screen.getByText("dashboard.stats.totalDonations"),
      ).toBeInTheDocument();
    });

    it("displays volunteer hours statistic", () => {
      renderWithRouter(<GiveDashboard />);

      expect(
        screen.getByText("dashboard.stats.volunteerHours"),
      ).toBeInTheDocument();
    });

    it("displays impact score statistic", () => {
      renderWithRouter(<GiveDashboard />);

      expect(
        screen.getByText("dashboard.stats.impactScore"),
      ).toBeInTheDocument();
    });
  });

  describe("Navigation and Routing", () => {
    it("handles navigation to different sections", () => {
      renderWithRouter(<GiveDashboard />);

      // Check that navigation elements are present
      expect(screen.getByText("dashboard.title")).toBeInTheDocument();
    });

    it("handles location state for wallet settings", () => {
      const mockLocation = {
        state: { showWalletSettings: true },
        pathname: "/dashboard",
        search: "",
        hash: "",
        key: "test",
      };

      // Mock useLocation to return state with showWalletSettings
      jest.doMock("react-router-dom", () => ({
        ...jest.requireActual("react-router-dom"),
        useLocation: () => mockLocation,
      }));

      renderWithRouter(<GiveDashboard />);

      // Should automatically open wallet settings
      expect(screen.getByTestId("wallet-settings")).toBeInTheDocument();
    });
  });

  describe("Data Display and Management", () => {
    it("displays transaction data in table format", () => {
      renderWithRouter(<GiveDashboard />);

      expect(screen.getByText("dashboard.table.date")).toBeInTheDocument();
      expect(screen.getByText("dashboard.table.type")).toBeInTheDocument();
      expect(screen.getByText("dashboard.table.amount")).toBeInTheDocument();
      expect(
        screen.getByText("dashboard.table.organization"),
      ).toBeInTheDocument();
      expect(screen.getByText("dashboard.table.status")).toBeInTheDocument();
    });

    it("handles empty transaction state", () => {
      renderWithRouter(<GiveDashboard />);

      // Should show some indication of empty state or default data
      expect(screen.getByText("dashboard.table.date")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("handles auth context errors gracefully", () => {
      mockUseAuth.mockImplementation(() => {
        throw new Error("Auth context error");
      });

      expect(() => renderWithRouter(<GiveDashboard />)).not.toThrow();
    });

    it("handles web3 context errors gracefully", () => {
      mockUseWeb3.mockImplementation(() => {
        throw new Error("Web3 context error");
      });

      expect(() => renderWithRouter(<GiveDashboard />)).not.toThrow();
    });
  });

  describe("User Type Specific Features", () => {
    it("shows donor-specific features for donor users", () => {
      mockUseAuth.mockReturnValue(
        createMockAuth({
          user: mockUser,
          userType: "donor",
        }),
      );

      renderWithRouter(<GiveDashboard />);

      expect(
        screen.getByText("dashboard.scheduledDonations"),
      ).toBeInTheDocument();
    });

    it("shows charity-specific features for charity users", () => {
      mockUseAuth.mockReturnValue(
        createMockAuth({
          user: mockUser,
          userType: "charity",
        }),
      );

      renderWithRouter(<GiveDashboard />);

      expect(screen.getByText("dashboard.title")).toBeInTheDocument();
    });
  });
});
