import React from "react"; // eslint-disable-line no-unused-vars
import { render, screen, waitFor } from "@testing-library/react";
import { CharityPortal } from "../CharityPortal";
import { useAuth } from "@/contexts/AuthContext";
import { useWeb3 } from "@/contexts/Web3Context";
import { useParams } from "react-router-dom";
import { MockAuthReturn, MockWeb3Return } from "@/test-utils/types";

// Mock all dependencies
jest.mock("@/contexts/AuthContext");
jest.mock("@/contexts/Web3Context");
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

// Create a mock supabase object that can be reconfigured in tests
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
        single: jest.fn(() => Promise.resolve({ data: null, error: null })),
      })),
      single: jest.fn(() => Promise.resolve({ data: null, error: null })),
    })),
  })),
};

jest.mock("@/lib/supabase", () => ({
  supabase: mockSupabase,
}));

jest.mock("@/utils/logger", () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

// Mock UI components with proper types
interface MockCharityData {
  name?: string;
}

interface MockStats {
  totalDonated?: number;
}

interface MockApplication {
  id: string;
  full_name: string;
}

interface MockHour {
  id: string;
  hours: number;
}

jest.mock("@/components/ui/LoadingSpinner", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

jest.mock("@/components/charity/CharityDashboard", () => ({
  CharityDashboard: ({
    charityData,
    stats,
  }: {
    charityData?: MockCharityData;
    stats?: MockStats;
  }) => (
    <div data-testid="charity-dashboard">
      <div data-testid="charity-name">{charityData?.name}</div>
      <div data-testid="total-donated">{stats?.totalDonated}</div>
    </div>
  ),
}));

jest.mock("@/components/charity/VolunteerApplicationsList", () => ({
  VolunteerApplicationsList: ({
    applications,
  }: {
    applications?: MockApplication[];
  }) => (
    <div data-testid="volunteer-applications">
      {applications?.map((app: MockApplication) => (
        <div key={app.id} data-testid={`application-${app.id}`}>
          {app.full_name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/charity/VolunteerHoursList", () => ({
  VolunteerHoursList: ({ hours }: { hours?: MockHour[] }) => (
    <div data-testid="volunteer-hours">
      {hours?.map((hour: MockHour) => (
        <div key={hour.id} data-testid={`hour-${hour.id}`}>
          {hour.hours} hours
        </div>
      ))}
    </div>
  ),
}));

// Using shared types from test-utils/types.ts

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
const mockUseWeb3 = useWeb3 as jest.MockedFunction<typeof useWeb3>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;

describe("CharityPortal", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: "user-123" },
      signOut: jest.fn(),
      loading: false,
    } as MockAuthReturn);

    mockUseWeb3.mockReturnValue({
      address: "0x1234567890123456789012345678901234567890",
      isConnected: true,
    } as MockWeb3Return);

    mockUseParams.mockReturnValue({ id: "charity-123" });
  });

  describe("loading state", () => {
    it("renders loading spinner initially", () => {
      render(<CharityPortal />);
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    });
  });

  describe("error handling", () => {
    it("displays error message when charity fetch fails", async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() =>
              Promise.resolve({
                data: null,
                error: { message: "Charity not found" },
              }),
            ),
          })),
        })),
      });

      render(<CharityPortal />);

      await waitFor(() => {
        expect(
          screen.getByText(/failed to load charity data/i),
        ).toBeInTheDocument();
      });
    });

    it("handles missing charity ID parameter", async () => {
      mockUseParams.mockReturnValue({});

      render(<CharityPortal />);

      await waitFor(() => {
        expect(screen.getByText(/charity not found/i)).toBeInTheDocument();
      });
    });
  });

  describe("unauthorized access", () => {
    it("shows error when user is not authenticated", async () => {
      mockUseAuth.mockReturnValue({
        user: null,
        signOut: jest.fn(),
        loading: false,
      } as MockAuthReturn);

      render(<CharityPortal />);

      await waitFor(() => {
        expect(screen.getByText(/access denied/i)).toBeInTheDocument();
      });
    });

    it("shows error when wallet is not connected", async () => {
      mockUseWeb3.mockReturnValue({
        address: null,
        isConnected: false,
      } as MockWeb3Return);

      render(<CharityPortal />);

      await waitFor(() => {
        expect(
          screen.getByText(/wallet connection required/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe("successful data loading", () => {
    beforeEach(() => {
      // Mock charity data
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "charities") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: "charity-123",
                      name: "Test Charity",
                      description: "A test charity",
                      admin_user_id: "user-123",
                    },
                    error: null,
                  }),
                ),
              })),
            })),
          };
        }

        if (table === "donations") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() =>
                Promise.resolve({
                  data: [
                    { amount: "100", id: "donation-1" },
                    { amount: "200", id: "donation-2" },
                  ],
                  error: null,
                }),
              ),
            })),
          };
        }

        if (table === "volunteer_hours") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() =>
                  Promise.resolve({
                    data: [
                      { hours: "5", id: "hour-1" },
                      { hours: "3", id: "hour-2" },
                    ],
                    error: null,
                  }),
                ),
              })),
            })),
          };
        }

        if (table === "endorsements") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() =>
                Promise.resolve({
                  data: [{ id: "endorsement-1" }],
                  error: null,
                }),
              ),
            })),
          };
        }

        if (table === "volunteers") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() =>
                Promise.resolve({
                  data: [{ volunteer_id: "volunteer-1" }],
                  error: null,
                }),
              ),
            })),
          };
        }

        if (table === "volunteer_applications") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() =>
                  Promise.resolve({
                    data: [
                      {
                        id: "app-1",
                        full_name: "John Doe",
                        status: "pending",
                      },
                    ],
                    error: null,
                  }),
                ),
              })),
            })),
          };
        }

        // Default mock for other tables
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        };
      });
    });

    it("renders charity dashboard with correct data", async () => {
      render(<CharityPortal />);

      await waitFor(() => {
        expect(screen.getByTestId("charity-dashboard")).toBeInTheDocument();
        expect(screen.getByTestId("charity-name")).toHaveTextContent(
          "Test Charity",
        );
        expect(screen.getByTestId("total-donated")).toHaveTextContent("300");
      });
    });

    it("renders volunteer applications list", async () => {
      render(<CharityPortal />);

      await waitFor(() => {
        expect(
          screen.getByTestId("volunteer-applications"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("application-app-1")).toHaveTextContent(
          "John Doe",
        );
      });
    });

    it("renders volunteer hours list", async () => {
      render(<CharityPortal />);

      await waitFor(() => {
        expect(screen.getByTestId("volunteer-hours")).toBeInTheDocument();
        expect(screen.getByTestId("hour-hour-1")).toHaveTextContent("5 hours");
        expect(screen.getByTestId("hour-hour-2")).toHaveTextContent("3 hours");
      });
    });
  });

  describe("helper functions", () => {
    it("calculates statistics correctly", async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "charities") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: "charity-123",
                      name: "Test Charity",
                      admin_user_id: "user-123",
                    },
                    error: null,
                  }),
                ),
              })),
            })),
          };
        }

        if (table === "donations") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() =>
                Promise.resolve({
                  data: [
                    { amount: "150.50" },
                    { amount: "75.25" },
                    { amount: null }, // Test null amount handling
                  ],
                  error: null,
                }),
              ),
            })),
          };
        }

        if (table === "volunteer_hours") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                eq: jest.fn(() =>
                  Promise.resolve({
                    data: [
                      { hours: "10" },
                      { hours: "5.5" },
                      { hours: null }, // Test null hours handling
                    ],
                    error: null,
                  }),
                ),
              })),
            })),
          };
        }

        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        };
      });

      render(<CharityPortal />);

      await waitFor(() => {
        expect(screen.getByTestId("charity-dashboard")).toBeInTheDocument();
        // Should sum 150.50 + 75.25 = 225.75 (ignoring null)
        expect(screen.getByTestId("total-donated")).toHaveTextContent("225.75");
      });
    });
  });

  describe("data type handling", () => {
    it("handles different data types in fetched data", async () => {
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === "charities") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn(() =>
                  Promise.resolve({
                    data: {
                      id: "charity-123",
                      name: "Test Charity",
                      admin_user_id: "user-123",
                    },
                    error: null,
                  }),
                ),
              })),
            })),
          };
        }

        if (table === "donations") {
          return {
            select: jest.fn(() => ({
              eq: jest.fn(() =>
                Promise.resolve({
                  data: [
                    { amount: 100 }, // number
                    { amount: "200" }, // string
                    { amount: "" }, // empty string
                  ],
                  error: null,
                }),
              ),
            })),
          };
        }

        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => Promise.resolve({ data: [], error: null })),
          })),
        };
      });

      render(<CharityPortal />);

      await waitFor(() => {
        expect(screen.getByTestId("charity-dashboard")).toBeInTheDocument();
        // Should sum 100 + 200 + 0 = 300
        expect(screen.getByTestId("total-donated")).toHaveTextContent("300");
      });
    });
  });
});
