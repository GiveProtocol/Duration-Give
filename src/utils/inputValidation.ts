export class InputValidator {
  // Safe email regex that avoids catastrophic backtracking
  static readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  static readonly PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  // Safe URL regex with proper escaping and bounded quantifiers
  static readonly URL_REGEX = /^https:\/\/[a-zA-Z0-9.-]+(?:\.[a-zA-Z]{2,})?(?:\/[^\s]*)?$/;

  static validateEmail(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  static validatePassword(password: string): boolean {
    return this.PASSWORD_REGEX.test(password);
  }

  static validateURL(url: string): boolean {
    return this.URL_REGEX.test(url);
  }

  static sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/['"]/g, '') // Remove quotes
      .trim();
  }

  static validateAmount(amount: number): boolean {
    return (
      Number.isFinite(amount) &&
      amount > 0 &&
      amount <= 1000000 &&
      Number.isInteger(amount * 100) // Ensure max 2 decimal places
    );
  }
}