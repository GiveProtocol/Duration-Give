// Mock logger for Jest tests
export class Logger {
  static info(message: string, metadata?: Record<string, unknown>) {
    console.log(`[INFO] ${message}`, metadata);
  }

  static warn(message: string, metadata?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, metadata);
  }

  static error(message: string, metadata?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, metadata);
  }

  static getLogs() {
    return [];
  }

  static clearLogs() {
    // No-op for tests
  }

  static setLevel() {
    // No-op for tests
  }

  static async submitToSentry() {
    // No-op for tests
  }
}
