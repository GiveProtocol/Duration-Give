// Shared test helpers to reduce duplication in auth tests
export const createMockAuthFlow = (mockType: 'success' | 'error', errorDetails?: any) => {
  if (mockType === 'success') {
    return {
      data: { user: { id: '123', email: 'test@example.com' }, session: {} },
      error: null
    };
  }
  return {
    data: { user: null, session: null },
    error: errorDetails || { message: 'Test error' }
  };
};

export const createMockWeb3Flow = (mockType: 'success' | 'error', errorDetails?: any) => {
  if (mockType === 'success') {
    return ['0x1234567890123456789012345678901234567890'];
  }
  throw errorDetails || new Error('Test error');
};

export const commonExpectations = {
  authSuccess: (screen: any) => {
    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
  },
  authError: (screen: any, message: string) => {
    expect(screen.getByTestId('error')).toHaveTextContent(message);
  },
  web3Connected: (screen: any) => {
    expect(screen.getByTestId('connected')).toHaveTextContent('connected');
  },
  web3Disconnected: (screen: any) => {
    expect(screen.getByTestId('connected')).toHaveTextContent('disconnected');
  }
};