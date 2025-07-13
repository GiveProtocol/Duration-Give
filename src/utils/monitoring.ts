// Monitoring service for application performance and error tracking
export interface MonitoringConfig {
  apiKey: string;
  appId: string;
  environment: string;
  enabledMonitors: string[];
}

export interface MonitoringMetrics {
  timestamp: number;
  event: string;
  data: Record<string, unknown>;
  userId?: string;
  sessionId?: string;
}

export class MonitoringService {
  private static instance: MonitoringService | null = null;
  private config: MonitoringConfig | null = null;
  private initialized = false;

  private constructor() {}

  static getInstance(config?: MonitoringConfig): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }

    if (config && !MonitoringService.instance.initialized) {
      MonitoringService.instance.initialize(config);
    }

    return MonitoringService.instance;
  }

  private initialize(config: MonitoringConfig): void {
    this.config = config;
    this.initialized = true;

    // Only log in development, in production this would integrate with monitoring service
    if (import.meta.env.DEV) {
      console.log("MonitoringService initialized with config:", {
        appId: config.appId,
        environment: config.environment,
        enabledMonitors: config.enabledMonitors,
      });
    }

    // Start monitoring if enabled
    this.startMonitoring();
  }

  private startMonitoring(): void {
    if (!this.config || !this.initialized) return;

    // Performance monitoring
    if (this.config.enabledMonitors.includes("performance")) {
      this.monitorPerformance();
    }

    // Error monitoring (already handled by Sentry)
    if (this.config.enabledMonitors.includes("errors")) {
      this.monitorErrors();
    }

    // User interaction monitoring
    if (this.config.enabledMonitors.includes("interactions")) {
      this.monitorInteractions();
    }
  }

  private monitorPerformance(): void {
    // Monitor Core Web Vitals
    if ("web-vitals" in window || typeof window !== "undefined") {
      // This would integrate with web-vitals library in a real implementation
      this.trackMetric("performance_monitoring_started", {
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      });
    }
  }

  private monitorErrors(): void {
    // Global error handler (supplement to Sentry)
    window.addEventListener("error", (event) => {
      this.trackMetric("javascript_error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
      });
    });

    window.addEventListener("unhandledrejection", (event) => {
      this.trackMetric("unhandled_promise_rejection", {
        reason: event.reason?.toString() || "Unknown reason",
        timestamp: Date.now(),
      });
    });
  }

  private monitorInteractions(): void {
    // Track key user interactions
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a")
      ) {
        this.trackMetric("user_interaction", {
          type: "click",
          element: target.tagName.toLowerCase(),
          text: target.textContent?.trim().substring(0, 50) || "",
          timestamp: Date.now(),
        });
      }
    });
  }

  public trackMetric(event: string, data: Record<string, unknown>): void {
    if (!this.initialized || !this.config) return;

    const metric: MonitoringMetrics = {
      timestamp: Date.now(),
      event,
      data,
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
    };

    // In development, just log to console
    if (import.meta.env.DEV) {
      console.log("MonitoringService metric:", metric);
      return;
    }

    // In production, this would send to your monitoring service
    this.sendMetric(metric);
  }

  private sendMetric(metric: MonitoringMetrics): void {
    // This would send metrics to your monitoring backend
    // For now, store in localStorage as fallback
    try {
      const existingMetrics = JSON.parse(
        localStorage.getItem("monitoring_metrics") || "[]",
      );
      existingMetrics.push(metric);

      // Keep only last 100 metrics to prevent storage bloat
      if (existingMetrics.length > 100) {
        existingMetrics.splice(0, existingMetrics.length - 100);
      }

      localStorage.setItem(
        "monitoring_metrics",
        JSON.stringify(existingMetrics),
      );
    } catch (error) {
      console.warn("Failed to store monitoring metric:", error);
    }
  }

  private getCurrentUserId(): string | undefined {
    // Get user ID from localStorage or auth context
    try {
      const userCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("give_docs_user_id="));
      return userCookie?.split("=")[1];
    } catch {
      return undefined;
    }
  }

  private getCurrentSessionId(): string | undefined {
    // Get session ID from localStorage or auth context
    try {
      const sessionCookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("give_docs_session_id="));
      return sessionCookie?.split("=")[1];
    } catch {
      return undefined;
    }
  }

  public exportMetrics(): MonitoringMetrics[] {
    try {
      return JSON.parse(localStorage.getItem("monitoring_metrics") || "[]");
    } catch {
      return [];
    }
  }

  public clearMetrics(): void {
    localStorage.removeItem("monitoring_metrics");
  }
}

// Export singleton instance getter
export const getMonitoringService = () => MonitoringService.getInstance();
