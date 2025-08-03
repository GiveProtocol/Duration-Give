/**
 * Shared route mock utilities to reduce duplication across test files
 */

import React from "react";

export const mockPageComponent = (testId: string, displayName: string) => ({
  __esModule: true,
  default: () =>
    React.createElement("div", { "data-testid": testId }, displayName),
});

export const mockNamedComponent = (
  testId: string,
  displayName: string,
  componentName: string,
) => ({
  [componentName]: () =>
    React.createElement("div", { "data-testid": testId }, displayName),
});

export const setupCommonRouteMocks = () => {
  // Mock route utilities
  jest.mock("./RouteTransition", () => ({
    RouteTransition: ({ children }: { children: React.ReactNode }) =>
      React.createElement("div", {}, children),
  }));

  jest.mock("./ProtectedRoute", () => ({
    ProtectedRoute: ({ children }: { children: React.ReactNode }) =>
      React.createElement(
        "div",
        { "data-testid": "protected-route" },
        children,
      ),
  }));

  jest.mock("@/components/ui/LoadingSpinner", () => ({
    LoadingSpinner: ({ size }: { size?: string }) =>
      React.createElement(
        "div",
        { "data-testid": "loading-spinner", "data-size": size },
        "Loading...",
      ),
  }));
};

export const setupPageMocks = () => {
  // Basic pages
  jest.mock("@/pages/ComingSoon", () =>
    mockPageComponent("coming-soon", "Coming Soon"),
  );
  jest.mock("@/pages/Login", () => mockPageComponent("login", "Login"));
  jest.mock("@/pages/Register", () =>
    mockPageComponent("register", "Register"),
  );
  jest.mock("@/pages/Home", () => mockPageComponent("home", "Home"));
  jest.mock("@/pages/CharityBrowser", () =>
    mockPageComponent("charity-browser", "Charity Browser"),
  );
  jest.mock("@/pages/SentryTest", () =>
    mockPageComponent("sentry-test", "Sentry Test"),
  );
  jest.mock("@/pages/ContributionTracker", () =>
    mockPageComponent("contribution-tracker", "Contribution Tracker"),
  );
  jest.mock("@/pages/VolunteerOpportunities", () =>
    mockPageComponent("volunteer-opportunities", "Volunteer Opportunities"),
  );

  // Named export pages
  jest.mock("@/pages/About", () =>
    mockNamedComponent("about", "About", "About"),
  );
  jest.mock("@/pages/Legal", () =>
    mockNamedComponent("legal", "Legal", "Legal"),
  );
  jest.mock("@/pages/Privacy", () =>
    mockNamedComponent("privacy", "Privacy", "Privacy"),
  );
  jest.mock("@/pages/Whitepaper", () =>
    mockNamedComponent("whitepaper", "Whitepaper", "Whitepaper"),
  );
};

export const setupCharityPageMocks = () => {
  jest.mock("@/pages/charities/GlobalWaterFoundation", () =>
    mockPageComponent("global-water", "Global Water Foundation"),
  );
  jest.mock("@/pages/charities/EducationForAll", () =>
    mockPageComponent("education-for-all", "Education For All"),
  );
  jest.mock("@/pages/charities/ClimateActionNow", () =>
    mockPageComponent("climate-action", "Climate Action Now"),
  );
};

export const setupPortfolioPageMocks = () => {
  jest.mock("@/pages/portfolio/EnvironmentPortfolioDetail", () =>
    mockPageComponent("environment-portfolio", "Environment Portfolio"),
  );
  jest.mock("@/pages/portfolio/EducationPortfolioDetail", () =>
    mockPageComponent("education-portfolio", "Education Portfolio"),
  );
  jest.mock("@/pages/portfolio/PovertyPortfolioDetail", () =>
    mockPageComponent("poverty-portfolio", "Poverty Portfolio"),
  );
};

export const setupDashboardPageMocks = () => {
  jest.mock("@/pages/donor/GiveDashboard", () =>
    mockPageComponent("give-dashboard", "Give Dashboard"),
  );
  jest.mock("@/pages/charity/CharityPortal", () =>
    mockPageComponent("charity-portal", "Charity Portal"),
  );
  jest.mock("@/pages/volunteer/VolunteerDashboard", () =>
    mockPageComponent("volunteer-dashboard", "Volunteer Dashboard"),
  );
  jest.mock("@/pages/admin/AdminDashboard", () =>
    mockPageComponent("admin-dashboard", "Admin Dashboard"),
  );
};

export const setupAllRouteMocks = () => {
  setupCommonRouteMocks();
  setupPageMocks();
  setupCharityPageMocks();
  setupPortfolioPageMocks();
  setupDashboardPageMocks();
};
