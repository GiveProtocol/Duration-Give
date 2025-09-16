// Mock for isows module to avoid ESM issues in tests
export const WebSocket = global.WebSocket || class MockWebSocket {
  constructor() {
    this.readyState = 0;
    this.listeners = {};
  }
  
  send(data) {
    // Empty mock implementation for WebSocket send
    if (this.readyState !== 1) {
      throw new Error('WebSocket is not in OPEN state');
    }
    // In a real implementation, this would send data
    // For mock purposes, we just validate the state
  }
  
  close() {
    // Empty mock implementation for WebSocket close
    this.readyState = 3; // CLOSED state
  }
  
  addEventListener(event, handler) {
    // Empty mock implementation for addEventListener
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(handler);
  }
  
  removeEventListener(event, handler) {
    // Empty mock implementation for removeEventListener
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(h => h !== handler);
    }
  }
};

export const isows = {
  WebSocket
};