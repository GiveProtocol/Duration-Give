import { Logger } from "../logger";
import { ENV } from "@/config/env";

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
  maxAge?: number;
  domain?: string;
  path?: string;
}

export class CSRFProtection {
  private static instance: CSRFProtection;
  private token: string | null = null;
  private readonly headerName = "X-CSRF-Token";
  private readonly cookieName = "XSRF-TOKEN";
  private readonly cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict" as const,
    maxAge: 7200, // 2 hours
    domain: ENV.APP_DOMAIN,
  };

  private constructor() {
    // Constructor kept simple and synchronous
  }

  static getInstance(): CSRFProtection {
    if (!this.instance) {
      this.instance = new CSRFProtection();
    }
    return this.instance;
  }

  private initializeTokenSync(): string {
    try {
      // Generate a cryptographically secure token synchronously
      const buffer = new Uint8Array(32);
      crypto.getRandomValues(buffer);
      const token = Array.from(buffer)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      // Set the cookie with secure options
      this.setCookie(this.cookieName, token, this.cookieOptions);

      Logger.info("CSRF token initialized");
      return token;
    } catch (error) {
      Logger.error("Failed to initialize CSRF token", { error });
      throw error;
    }
  }

  private setCookie(name: string, value: string, options: CookieOptions): void {
    let cookie = `${name}=${value}`;

    if (options.maxAge) cookie += `; Max-Age=${options.maxAge}`;
    if (options.domain) cookie += `; Domain=${options.domain}`;
    if (options.path) cookie += `; Path=${options.path || "/"}`;
    if (options.secure) cookie += "; Secure";
    if (options.httpOnly) cookie += "; HttpOnly";
    if (options.sameSite) cookie += `; SameSite=${options.sameSite}`;

    document.cookie = cookie;
  }

  getToken(): string {
    if (!this.token) {
      this.token = this.initializeTokenSync();
    }
    return this.token;
  }

  async validate(token: string): Promise<boolean> {
    if (!this.token || !token) {
      return false;
    }

    // Use constant-time comparison to prevent timing attacks
    return await this.timingSafeEqual(token, this.token);
  }

  private async timingSafeEqual(a: string, b: string): Promise<boolean> {
    if (a.length !== b.length) {
      return false;
    }

    const aBuffer = new TextEncoder().encode(a);
    const bBuffer = new TextEncoder().encode(b);

    return crypto.subtle.timingSafeEqual(aBuffer, bBuffer);
  }

  getHeaders(): Record<string, string> {
    return {
      [this.headerName]: this.getToken(),
    };
  }

  refreshToken(): void {
    this.token = this.initializeTokenSync();
  }
}
