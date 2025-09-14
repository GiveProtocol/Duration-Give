// Mock for isows module to avoid ESM issues in tests
export const WebSocket = global.WebSocket || class MockWebSocket {
  constructor() {
    this.readyState = 0;
  }
  send() {}
  close() {}
  addEventListener() {}
  removeEventListener() {}
};

export const isows = {
  WebSocket
};