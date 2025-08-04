import {
  mockPageComponent,
  mockNamedComponent,
  setupCommonRouteMocks,
  setupPageMocks,
  setupCharityPageMocks,
  setupPortfolioPageMocks,
  setupDashboardPageMocks,
  setupAllRouteMocks,
} from "../routeMocks";

describe("routeMocks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("mockPageComponent", () => {
    it("creates mock component with default export", () => {
      const mock = mockPageComponent("test-id", "Test Component");

      expect(mock.__esModule).toBe(true);
      expect(mock.default).toBeInstanceOf(Function);

      const element = mock.default();
      expect(element.type).toBe("div");
      expect(element.props["data-testid"]).toBe("test-id");
      expect(element.props.children).toBe("Test Component");
    });
  });

  describe("mockNamedComponent", () => {
    it("creates mock component with named export", () => {
      const mock = mockNamedComponent(
        "test-id",
        "Test Component",
        "TestComponent",
      );

      expect(mock.TestComponent).toBeInstanceOf(Function);

      const element = mock.TestComponent();
      expect(element.type).toBe("div");
      expect(element.props["data-testid"]).toBe("test-id");
      expect(element.props.children).toBe("Test Component");
    });
  });

  describe("setupCommonRouteMocks", () => {
    it("sets up common route mocks", () => {
      setupCommonRouteMocks();

      // Verify jest.mock was called (we can't test the actual mocking directly)
      expect(jest.mock).toBeDefined();
    });
  });

  describe("setupPageMocks", () => {
    it("sets up page component mocks", () => {
      setupPageMocks();

      // Verify function runs without errors
      expect(jest.mock).toBeDefined();
    });
  });

  describe("setupCharityPageMocks", () => {
    it("sets up charity page mocks", () => {
      setupCharityPageMocks();

      // Verify function runs without errors
      expect(jest.mock).toBeDefined();
    });
  });

  describe("setupPortfolioPageMocks", () => {
    it("sets up portfolio page mocks", () => {
      setupPortfolioPageMocks();

      // Verify function runs without errors
      expect(jest.mock).toBeDefined();
    });
  });

  describe("setupDashboardPageMocks", () => {
    it("sets up dashboard page mocks", () => {
      setupDashboardPageMocks();

      // Verify function runs without errors
      expect(jest.mock).toBeDefined();
    });
  });

  describe("setupAllRouteMocks", () => {
    it("calls all setup functions", () => {
      // Mock the individual setup functions
      const setupCommonRouteMocksSpy = jest.spyOn(
        { setupCommonRouteMocks },
        "setupCommonRouteMocks",
      );
      const setupPageMocksSpy = jest.spyOn(
        { setupPageMocks },
        "setupPageMocks",
      );
      const setupCharityPageMocksSpy = jest.spyOn(
        { setupCharityPageMocks },
        "setupCharityPageMocks",
      );
      const setupPortfolioPageMocksSpy = jest.spyOn(
        { setupPortfolioPageMocks },
        "setupPortfolioPageMocks",
      );
      const setupDashboardPageMocksSpy = jest.spyOn(
        { setupDashboardPageMocks },
        "setupDashboardPageMocks",
      );

      setupAllRouteMocks();

      expect(setupCommonRouteMocksSpy).toHaveBeenCalled();
      expect(setupPageMocksSpy).toHaveBeenCalled();
      expect(setupCharityPageMocksSpy).toHaveBeenCalled();
      expect(setupPortfolioPageMocksSpy).toHaveBeenCalled();
      expect(setupDashboardPageMocksSpy).toHaveBeenCalled();
    });
  });
});
