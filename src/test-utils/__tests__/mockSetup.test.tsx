import {
  createMockWeb3,
  createMockWalletAlias,
  createMockAuth,
  createMockProfile,
  createMockTranslation,
  setupCommonMocks,
} from "../mockSetup";

describe("mockSetup", () => {
  describe("createMockWeb3", () => {
    it("returns default mock web3 object", () => {
      const result = createMockWeb3();

      expect(result).toEqual({
        address: null,
        chainId: null,
        isConnected: false,
        connect: expect.any(Function),
        disconnect: expect.any(Function),
        switchChain: expect.any(Function),
      });
    });

    it("applies overrides to default mock", () => {
      const overrides = {
        address: "0x123",
        isConnected: true,
        chainId: 1287,
      };

      const result = createMockWeb3(overrides);

      expect(result.address).toBe("0x123");
      expect(result.isConnected).toBe(true);
      expect(result.chainId).toBe(1287);
      expect(result.connect).toBeInstanceOf(Function);
    });
  });

  describe("createMockWalletAlias", () => {
    it("returns default mock wallet alias object", () => {
      const result = createMockWalletAlias();

      expect(result).toEqual({
        alias: null,
        aliases: {},
        isLoading: false,
        loading: false,
        error: null,
        setAlias: expect.any(Function),
        deleteAlias: expect.any(Function),
        refreshAliases: expect.any(Function),
      });
    });

    it("applies overrides to default mock", () => {
      const overrides = {
        alias: "test-alias",
        isLoading: true,
        aliases: { "0x123": "MyWallet" },
      };

      const result = createMockWalletAlias(overrides);

      expect(result.alias).toBe("test-alias");
      expect(result.isLoading).toBe(true);
      expect(result.aliases).toEqual({ "0x123": "MyWallet" });
    });
  });

  describe("createMockAuth", () => {
    it("returns default mock auth object", () => {
      const result = createMockAuth();

      expect(result).toEqual({
        user: null,
        userType: null,
        loading: false,
        error: null,
        login: expect.any(Function),
        logout: expect.any(Function),
        register: expect.any(Function),
        resetPassword: expect.any(Function),
        loginWithGoogle: expect.any(Function),
        refreshSession: expect.any(Function),
        sendUsernameReminder: expect.any(Function),
      });
    });

    it("applies overrides to default mock", () => {
      const user = { id: "123", email: "test@test.com" };
      const overrides = {
        user,
        userType: "donor",
        loading: true,
      };

      const result = createMockAuth(overrides);

      expect(result.user).toBe(user);
      expect(result.userType).toBe("donor");
      expect(result.loading).toBe(true);
    });
  });

  describe("createMockProfile", () => {
    it("returns default mock profile object", () => {
      const result = createMockProfile();

      expect(result).toEqual({
        profile: null,
        loading: false,
        error: null,
        refreshProfile: expect.any(Function),
      });
    });

    it("applies overrides to default mock", () => {
      const profile = { id: "123", name: "Test User" };
      const overrides = {
        profile,
        loading: true,
      };

      const result = createMockProfile(overrides);

      expect(result.profile).toBe(profile);
      expect(result.loading).toBe(true);
    });
  });

  describe("createMockTranslation", () => {
    it("returns default mock translation object", () => {
      const result = createMockTranslation();

      expect(result).toEqual({
        t: expect.any(Function),
        language: "en",
        setLanguage: expect.any(Function),
        languages: expect.any(Array),
      });
    });

    it("applies overrides to default mock", () => {
      const customT = jest.fn((key: string) => `translated_${key}`);
      const overrides = {
        t: customT,
        language: "es",
      };

      const result = createMockTranslation(overrides);

      expect(result.t).toBe(customT);
      expect(result.language).toBe("es");
    });
  });

  describe("setupCommonMocks", () => {
    it("sets up common mocks without errors", () => {
      expect(() => setupCommonMocks()).not.toThrow();
    });
  });
});
