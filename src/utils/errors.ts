import { AuthErrorCode } from "../types/auth";

export interface AuthError extends Error {
  code: AuthErrorCode;
}

export function getAuthErrorMessage(code: AuthErrorCode): string {
  const messages: Record<AuthErrorCode, string> = {
    invalid_credentials: "Invalid email or password",
    email_taken: "This email is already registered",
    weak_password: "Password must be at least 8 characters long",
    invalid_email: "Please enter a valid email address",
    network_error: "Network error. Please check your connection",
  };

  return messages[code] || "An unexpected error occurred";
}

export function createAuthError(code: AuthErrorCode): AuthError {
  const error = new Error(getAuthErrorMessage(code)) as AuthError;
  error.code = code;
  return error;
}
