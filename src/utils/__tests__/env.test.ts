import { getEnv } from "../env";

// TypeScript interfaces for proper typing
interface MockViteEnv {
  PROD?: boolean;
  DEV?: boolean;
  MODE?: string;
  VITE_API_URL?: string;
  VITE_MONITORING_ENDPOINT?: string;
  [key: string]: unknown;
}

interface MockImportMeta {
  env?: MockViteEnv;
}

interface MockImport {
  meta?: MockImportMeta;
}

interface MockGlobalThis {
  importMeta?: MockImport;
}

interface MockProcess {
  env?: Record<string, string | undefined>;
}

interface MockGlobal {
  process?: MockProcess;
}

// Store original globals to restore after tests
const originalGlobalThis = { ...globalThis };
const originalProcess = process;

describe("getEnv utility", () => {
  afterEach(() => {
    // Restore original globals after each test
    Object.assign(globalThis, originalGlobalThis);
    global.process = originalProcess;
  });

  describe("Vite environment detection", () => {
    it("returns import.meta.env when available via globalThis", () => {
      const mockEnv = {
        PROD: false,
        DEV: true,
        MODE: "development",
        VITE_API_URL: "http://localhost:3000",
      };

      // Mock globalThis.import.meta.env
      (globalThis as MockGlobalThis).importMeta = {
        meta: {
          env: mockEnv,
        },
      };

      const result = getEnv();
      expect(result).toEqual(mockEnv);
    });

    it("handles globalThis.import.meta.env via dynamic property access", () => {
      const mockEnv = {
        PROD: true,
        DEV: false,
        MODE: "production",
        VITE_API_URL: "https://api.example.com",
      };

      // Mock the dynamic access path
      const globalImport = globalThis as MockGlobalThis;
      globalImport.importMeta = {
        meta: {
          env: mockEnv,
        },
      };

      const result = getEnv();
      expect(result).toEqual(mockEnv);
    });

    it("handles missing import.meta gracefully", () => {
      // Ensure no import.meta is available
      delete (globalThis as MockGlobalThis).importMeta;

      const result = getEnv();

      // Should fall back to process.env
      expect(result).toHaveProperty("PROD");
      expect(result).toHaveProperty("DEV");
      expect(result).toHaveProperty("MODE");
    });
  });

  describe("Node.js/Jest environment detection", () => {
    beforeEach(() => {
      // Remove any Vite environment indicators
      delete (globalThis as MockGlobalThis).importMeta;
    });

    it("returns process.env configuration when available", () => {
      // Mock process.env
      global.process = {
        ...originalProcess,
        env: {
          NODE_ENV: "production",
          VITE_MONITORING_ENDPOINT: "https://monitoring.example.com",
        },
      };

      const result = getEnv();

      expect(result).toEqual({
        PROD: true,
        DEV: false,
        MODE: "production",
        VITE_MONITORING_ENDPOINT: "https://monitoring.example.com",
      });
    });

    it("handles development NODE_ENV correctly", () => {
      global.process = {
        ...originalProcess,
        env: {
          NODE_ENV: "development",
          VITE_MONITORING_ENDPOINT: "http://localhost:8080",
        },
      };

      const result = getEnv();

      expect(result).toEqual({
        PROD: false,
        DEV: true,
        MODE: "development",
        VITE_MONITORING_ENDPOINT: "http://localhost:8080",
      });
    });

    it("handles test NODE_ENV correctly", () => {
      global.process = {
        ...originalProcess,
        env: {
          NODE_ENV: "test",
          VITE_MONITORING_ENDPOINT: undefined,
        },
      };

      const result = getEnv();

      expect(result).toEqual({
        PROD: false,
        DEV: false,
        MODE: "test",
        VITE_MONITORING_ENDPOINT: undefined,
      });
    });

    it("handles missing NODE_ENV with default", () => {
      global.process = {
        ...originalProcess,
        env: {
          VITE_MONITORING_ENDPOINT: "https://default.monitoring.com",
        },
      };

      const result = getEnv();

      expect(result).toEqual({
        PROD: false,
        DEV: true,
        MODE: "development",
        VITE_MONITORING_ENDPOINT: "https://default.monitoring.com",
      });
    });

    it("handles missing VITE_MONITORING_ENDPOINT", () => {
      global.process = {
        ...originalProcess,
        env: {
          NODE_ENV: "production",
        },
      };

      const result = getEnv();

      expect(result.VITE_MONITORING_ENDPOINT).toBeUndefined();
    });
  });

  describe("fallback behavior", () => {
    it("returns default configuration when no environment is available", () => {
      // Remove both Vite and Node environment indicators
      delete (globalThis as MockGlobalThis).importMeta;
      delete (global as MockGlobal).process;

      const result = getEnv();

      expect(result).toEqual({
        PROD: false,
        DEV: true,
        MODE: "development",
        VITE_MONITORING_ENDPOINT: undefined,
      });
    });

    it("handles process without env property", () => {
      delete (globalThis as MockGlobalThis).importMeta;
      global.process = { ...originalProcess };
      delete (global.process as MockProcess).env;

      const result = getEnv();

      expect(result).toEqual({
        PROD: false,
        DEV: true,
        MODE: "development",
        VITE_MONITORING_ENDPOINT: undefined,
      });
    });

    it("handles exception during dynamic import.meta access", () => {
      delete (globalThis as MockGlobalThis).importMeta;

      // Mock a scenario where accessing globalImport.import throws
      Object.defineProperty(globalThis, "import", {
        get() {
          throw new Error("import.meta not available");
        },
      });

      const result = getEnv();

      // Should fall back to process.env or default
      expect(result).toHaveProperty("PROD");
      expect(result).toHaveProperty("DEV");
      expect(result).toHaveProperty("MODE");
    });
  });

  describe("environment type detection", () => {
    it("correctly identifies production environment", () => {
      delete (globalThis as MockGlobalThis).importMeta;
      global.process = {
        ...originalProcess,
        env: { NODE_ENV: "production" },
      };

      const result = getEnv();

      expect(result.PROD).toBe(true);
      expect(result.DEV).toBe(false);
      expect(result.MODE).toBe("production");
    });

    it("correctly identifies development environment", () => {
      delete (globalThis as MockGlobalThis).importMeta;
      global.process = {
        ...originalProcess,
        env: { NODE_ENV: "development" },
      };

      const result = getEnv();

      expect(result.PROD).toBe(false);
      expect(result.DEV).toBe(true);
      expect(result.MODE).toBe("development");
    });

    it("correctly identifies staging environment", () => {
      delete (globalThis as MockGlobalThis).importMeta;
      global.process = {
        ...originalProcess,
        env: { NODE_ENV: "staging" },
      };

      const result = getEnv();

      expect(result.PROD).toBe(false);
      expect(result.DEV).toBe(false);
      expect(result.MODE).toBe("staging");
    });
  });

  describe("edge cases", () => {
    it("handles undefined globalThis gracefully", () => {
      const originalGlobalThis = globalThis;

      try {
        // This test is more conceptual since we can't actually delete globalThis
        delete (globalThis as MockGlobalThis).importMeta;

        const result = getEnv();
        expect(result).toBeDefined();
      } finally {
        Object.assign(globalThis, originalGlobalThis);
      }
    });

    it("handles partial import.meta structure", () => {
      (globalThis as MockGlobalThis).importMeta = {
        meta: {}, // Missing env property
      };

      const result = getEnv();

      // Should fall back to process.env or default
      expect(result).toHaveProperty("MODE");
    });

    it("handles import without meta property", () => {
      (globalThis as MockGlobalThis).importMeta = {}; // Missing meta property

      const result = getEnv();

      // Should fall back to process.env or default
      expect(result).toHaveProperty("MODE");
    });
  });
});
