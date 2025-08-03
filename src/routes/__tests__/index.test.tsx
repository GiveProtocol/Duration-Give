import React from "react"; // eslint-disable-line no-unused-vars
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppRoutes from "../index";

// Mock all dependencies
jest.mock("@/contexts/AuthContext");
jest.mock("./RouteTransition", () => ({
  RouteTransition: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));
jest.mock("./ProtectedRoute", () => ({
  ProtectedRoute: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="protected-route">{children}</div>
  ),
}));
jest.mock("@/components/ui/LoadingSpinner", () => ({
  LoadingSpinner: ({ size }: { size?: string }) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading...
    </div>
  ),
}));

// Mock all page components
jest.mock("@/pages/ComingSoon", () => ({
  __esModule: true,
  default: () => <div data-testid="coming-soon">Coming Soon</div>,
}));

jest.mock("@/pages/Login", () => ({
  __esModule: true,
  default: () => <div data-testid="login">Login</div>,
}));

jest.mock("@/pages/Register", () => ({
  __esModule: true,
  default: () => <div data-testid="register">Register</div>,
}));

// Mock lazy-loaded components
jest.mock("@/pages/Home", () => ({
  __esModule: true,
  default: () => <div data-testid="home">Home</div>,
}));

jest.mock("@/pages/CharityBrowser", () => ({
  __esModule: true,
  default: () => <div data-testid="charity-browser">Charity Browser</div>,
}));

jest.mock("@/pages/SentryTest", () => ({
  __esModule: true,
  default: () => <div data-testid="sentry-test">Sentry Test</div>,
}));

jest.mock("@/pages/charities/GlobalWaterFoundation", () => ({
  __esModule: true,
  default: () => <div data-testid="global-water">Global Water Foundation</div>,
}));

jest.mock("@/pages/charities/EducationForAll", () => ({
  __esModule: true,
  default: () => <div data-testid="education-for-all">Education For All</div>,
}));

jest.mock("@/pages/charities/ClimateActionNow", () => ({
  __esModule: true,
  default: () => <div data-testid="climate-action">Climate Action Now</div>,
}));

jest.mock("@/pages/portfolio/EnvironmentPortfolioDetail", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="environment-portfolio">Environment Portfolio</div>
  ),
}));

jest.mock("@/pages/portfolio/EducationPortfolioDetail", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="education-portfolio">Education Portfolio</div>
  ),
}));

jest.mock("@/pages/portfolio/PovertyPortfolioDetail", () => ({
  __esModule: true,
  default: () => <div data-testid="poverty-portfolio">Poverty Portfolio</div>,
}));

jest.mock("@/pages/ContributionTracker", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="contribution-tracker">Contribution Tracker</div>
  ),
}));

jest.mock("@/pages/VolunteerOpportunities", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="volunteer-opportunities">Volunteer Opportunities</div>
  ),
}));

jest.mock("@/pages/About", () => ({
  About: () => <div data-testid="about">About</div>,
}));

jest.mock("@/pages/Legal", () => ({
  Legal: () => <div data-testid="legal">Legal</div>,
}));

jest.mock("@/pages/Privacy", () => ({
  Privacy: () => <div data-testid="privacy">Privacy</div>,
}));

jest.mock("@/pages/Governance", () => ({
  Governance: () => <div data-testid="governance">Governance</div>,
}));

jest.mock("@/pages/GiveDashboard", () => ({
  GiveDashboard: () => <div data-testid="give-dashboard">Give Dashboard</div>,
}));

jest.mock("@/pages/CharityPortal", () => ({
  CharityPortal: () => <div data-testid="charity-portal">Charity Portal</div>,
}));

jest.mock("@/pages/charity/CreateOpportunity", () => ({
  __esModule: true,
  default: () => <div data-testid="create-opportunity">Create Opportunity</div>,
}));

jest.mock("@/pages/NotFound", () => ({
  __esModule: true,
  default: () => <div data-testid="not-found">Not Found</div>,
}));

jest.mock("@/pages/volunteer/VerifyContribution", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="verify-contribution">Verify Contribution</div>
  ),
}));

jest.mock("@/pages/donor/ScheduledDonationsPage", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="scheduled-donations">Scheduled Donations</div>
  ),
}));

jest.mock("@/pages/Documentation", () => ({
  __esModule: true,
  default: () => <div data-testid="documentation">Documentation</div>,
}));

jest.mock("@/pages/admin/AdminDashboard", () => ({
  __esModule: true,
  default: () => <div data-testid="admin-dashboard">Admin Dashboard</div>,
}));

jest.mock("@/pages/causes/CleanWaterInitiative", () => ({
  __esModule: true,
  default: () => <div data-testid="clean-water">Clean Water Initiative</div>,
}));

jest.mock("@/pages/causes/EducationAccessProgram", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="education-access">Education Access Program</div>
  ),
}));

jest.mock("@/pages/causes/ReforestationProject", () => ({
  __esModule: true,
  default: () => <div data-testid="reforestation">Reforestation Project</div>,
}));

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const renderWithRouter = (initialEntries: string[] = ["/"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppRoutes />
    </MemoryRouter>,
  );
};

describe("AppRoutes", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default auth state - not authenticated
    mockUseAuth.mockReturnValue({
      user: null,
      userType: null,
      loading: false,
      error: null,
      login: jest.fn(),
      loginWithGoogle: jest.fn(),
      logout: jest.fn(),
      resetPassword: jest.fn(),
      refreshSession: jest.fn(),
      register: jest.fn(),
      sendUsernameReminder: jest.fn(),
    });
  });

  describe("Public Routes", () => {
    it("renders coming soon page at root", async () => {
      renderWithRouter(["/"]);

      await waitFor(() => {
        expect(screen.getByTestId("coming-soon")).toBeInTheDocument();
      });
    });

    it("renders login page", async () => {
      renderWithRouter(["/login"]);

      await waitFor(() => {
        expect(screen.getByTestId("login")).toBeInTheDocument();
      });
    });

    it("renders register page", async () => {
      renderWithRouter(["/register"]);

      await waitFor(() => {
        expect(screen.getByTestId("register")).toBeInTheDocument();
      });
    });

    it("renders charity browser page", async () => {
      renderWithRouter(["/charities"]);

      await waitFor(() => {
        expect(screen.getByTestId("charity-browser")).toBeInTheDocument();
      });
    });

    it("renders sentry test page", async () => {
      renderWithRouter(["/sentry-test"]);

      await waitFor(() => {
        expect(screen.getByTestId("sentry-test")).toBeInTheDocument();
      });
    });
  });

  describe("Charity Detail Pages", () => {
    it("renders Global Water Foundation page", async () => {
      renderWithRouter(["/charities/global-water-foundation"]);

      await waitFor(() => {
        expect(screen.getByTestId("global-water")).toBeInTheDocument();
      });
    });

    it("renders Education For All page", async () => {
      renderWithRouter(["/charities/education-for-all"]);

      await waitFor(() => {
        expect(screen.getByTestId("education-for-all")).toBeInTheDocument();
      });
    });

    it("renders Climate Action Now page", async () => {
      renderWithRouter(["/charities/climate-action-now"]);

      await waitFor(() => {
        expect(screen.getByTestId("climate-action")).toBeInTheDocument();
      });
    });
  });

  describe("Portfolio Pages", () => {
    it("renders Environment Portfolio page", async () => {
      renderWithRouter(["/portfolio/environment"]);

      await waitFor(() => {
        expect(screen.getByTestId("environment-portfolio")).toBeInTheDocument();
      });
    });

    it("renders Education Portfolio page", async () => {
      renderWithRouter(["/portfolio/education"]);

      await waitFor(() => {
        expect(screen.getByTestId("education-portfolio")).toBeInTheDocument();
      });
    });

    it("renders Poverty Portfolio page", async () => {
      renderWithRouter(["/portfolio/poverty"]);

      await waitFor(() => {
        expect(screen.getByTestId("poverty-portfolio")).toBeInTheDocument();
      });
    });
  });

  describe("Cause Pages", () => {
    it("renders Clean Water Initiative page", async () => {
      renderWithRouter(["/causes/clean-water-initiative"]);

      await waitFor(() => {
        expect(screen.getByTestId("clean-water")).toBeInTheDocument();
      });
    });

    it("renders Education Access Program page", async () => {
      renderWithRouter(["/causes/education-access-program"]);

      await waitFor(() => {
        expect(screen.getByTestId("education-access")).toBeInTheDocument();
      });
    });

    it("renders Reforestation Project page", async () => {
      renderWithRouter(["/causes/reforestation-project"]);

      await waitFor(() => {
        expect(screen.getByTestId("reforestation")).toBeInTheDocument();
      });
    });
  });

  describe("Feature Pages", () => {
    it("renders Contribution Tracker page", async () => {
      renderWithRouter(["/contribution-tracker"]);

      await waitFor(() => {
        expect(screen.getByTestId("contribution-tracker")).toBeInTheDocument();
      });
    });

    it("renders Volunteer Opportunities page", async () => {
      renderWithRouter(["/volunteer-opportunities"]);

      await waitFor(() => {
        expect(
          screen.getByTestId("volunteer-opportunities"),
        ).toBeInTheDocument();
      });
    });

    it("renders Documentation page", async () => {
      renderWithRouter(["/docs"]);

      await waitFor(() => {
        expect(screen.getByTestId("documentation")).toBeInTheDocument();
      });
    });
  });

  describe("Static Pages", () => {
    it("renders About page", async () => {
      renderWithRouter(["/about"]);

      await waitFor(() => {
        expect(screen.getByTestId("about")).toBeInTheDocument();
      });
    });

    it("renders Legal page", async () => {
      renderWithRouter(["/legal"]);

      await waitFor(() => {
        expect(screen.getByTestId("legal")).toBeInTheDocument();
      });
    });

    it("renders Privacy page", async () => {
      renderWithRouter(["/privacy"]);

      await waitFor(() => {
        expect(screen.getByTestId("privacy")).toBeInTheDocument();
      });
    });

    it("renders Governance page", async () => {
      renderWithRouter(["/governance"]);

      await waitFor(() => {
        expect(screen.getByTestId("governance")).toBeInTheDocument();
      });
    });
  });

  describe("Protected Routes", () => {
    it("renders Give Dashboard page when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: "123", email: "test@example.com" } as any,
        userType: "donor",
        loading: false,
        error: null,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
        refreshSession: jest.fn(),
        register: jest.fn(),
        sendUsernameReminder: jest.fn(),
      });

      renderWithRouter(["/dashboard"]);

      await waitFor(() => {
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("give-dashboard")).toBeInTheDocument();
      });
    });

    it("renders Charity Portal page when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: "123", email: "test@example.com" } as any,
        userType: "charity",
        loading: false,
        error: null,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
        refreshSession: jest.fn(),
        register: jest.fn(),
        sendUsernameReminder: jest.fn(),
      });

      renderWithRouter(["/charity-portal"]);

      await waitFor(() => {
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("charity-portal")).toBeInTheDocument();
      });
    });

    it("renders Create Opportunity page when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: "123", email: "test@example.com" } as any,
        userType: "charity",
        loading: false,
        error: null,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
        refreshSession: jest.fn(),
        register: jest.fn(),
        sendUsernameReminder: jest.fn(),
      });

      renderWithRouter(["/charity/create-opportunity"]);

      await waitFor(() => {
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("create-opportunity")).toBeInTheDocument();
      });
    });

    it("renders Verify Contribution page when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: "123", email: "test@example.com" } as any,
        userType: "charity",
        loading: false,
        error: null,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
        refreshSession: jest.fn(),
        register: jest.fn(),
        sendUsernameReminder: jest.fn(),
      });

      renderWithRouter(["/volunteer/verify-contribution"]);

      await waitFor(() => {
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("verify-contribution")).toBeInTheDocument();
      });
    });

    it("renders Scheduled Donations page when authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: "123", email: "test@example.com" } as any,
        userType: "donor",
        loading: false,
        error: null,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
        refreshSession: jest.fn(),
        register: jest.fn(),
        sendUsernameReminder: jest.fn(),
      });

      renderWithRouter(["/donor/scheduled-donations"]);

      await waitFor(() => {
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("scheduled-donations")).toBeInTheDocument();
      });
    });

    it("renders Admin Dashboard page when authenticated as admin", async () => {
      mockUseAuth.mockReturnValue({
        user: { id: "123", email: "admin@example.com" } as any,
        userType: "admin",
        loading: false,
        error: null,
        login: jest.fn(),
        loginWithGoogle: jest.fn(),
        logout: jest.fn(),
        resetPassword: jest.fn(),
        refreshSession: jest.fn(),
        register: jest.fn(),
        sendUsernameReminder: jest.fn(),
      });

      renderWithRouter(["/admin"]);

      await waitFor(() => {
        expect(screen.getByTestId("protected-route")).toBeInTheDocument();
        expect(screen.getByTestId("admin-dashboard")).toBeInTheDocument();
      });
    });
  });

  describe("Route Redirects and Fallbacks", () => {
    it("renders Not Found page for unknown routes", async () => {
      renderWithRouter(["/unknown-route"]);

      await waitFor(() => {
        expect(screen.getByTestId("not-found")).toBeInTheDocument();
      });
    });

    it("shows loading spinner while lazy components load", async () => {
      renderWithRouter(["/charities"]);

      // Should briefly show loading spinner before the component loads
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toHaveAttribute(
        "data-size",
        "lg",
      );
    });
  });

  describe("Lazy Loading", () => {
    it("properly lazy loads Home component", async () => {
      renderWithRouter(["/home"]);

      await waitFor(() => {
        expect(screen.getByTestId("home")).toBeInTheDocument();
      });
    });

    it("properly lazy loads various page components", async () => {
      const routes = [
        ["/charities", "charity-browser"],
        ["/sentry-test", "sentry-test"],
        ["/charities/global-water-foundation", "global-water"],
        ["/portfolio/environment", "environment-portfolio"],
        ["/causes/clean-water-initiative", "clean-water"],
        ["/contribution-tracker", "contribution-tracker"],
        ["/volunteer-opportunities", "volunteer-opportunities"],
        ["/about", "about"],
        ["/docs", "documentation"],
      ];

      for (const [route, testId] of routes) {
        renderWithRouter([route]);
        await waitFor(() => {
          expect(screen.getByTestId(testId)).toBeInTheDocument();
        });
      }
    });
  });

  describe("Route Parameters and Navigation", () => {
    it("handles navigation between routes", async () => {
      const { rerender } = renderWithRouter(["/"]);

      await waitFor(() => {
        expect(screen.getByTestId("coming-soon")).toBeInTheDocument();
      });

      // Navigate to different route
      rerender(
        <MemoryRouter initialEntries={["/login"]}>
          <AppRoutes />
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByTestId("login")).toBeInTheDocument();
      });
    });

    it("handles complex nested routes", async () => {
      renderWithRouter(["/charities/education-for-all"]);

      await waitFor(() => {
        expect(screen.getByTestId("education-for-all")).toBeInTheDocument();
      });
    });

    it("handles portfolio routes with parameters", async () => {
      renderWithRouter(["/portfolio/education"]);

      await waitFor(() => {
        expect(screen.getByTestId("education-portfolio")).toBeInTheDocument();
      });
    });
  });

  describe("Error Boundaries and Fallbacks", () => {
    it("shows loading fallback during component loading", () => {
      renderWithRouter(["/charities"]);

      const loadingSpinner = screen.getByTestId("loading-spinner");
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveAttribute("data-size", "lg");
    });

    it("handles Suspense boundary correctly", async () => {
      renderWithRouter(["/home"]);

      // Should show loading initially, then the component
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByTestId("home")).toBeInTheDocument();
      });
    });
  });
});
