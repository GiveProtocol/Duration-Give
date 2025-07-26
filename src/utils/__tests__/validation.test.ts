import { validateEmail, validatePassword, validateAmount } from "../validation";

describe("Validation utilities", () => {
  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      const validEmails = [
        "test@example.com",
        "user.name@domain.co.uk",
        "user+tag@example.org",
        "user123@test-domain.com",
      ];

      validEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(true);
      });
    });

    it("should reject invalid email addresses", () => {
      const invalidEmails = [
        "invalid-email",
        "@example.com",
        "test@",
        "",
        "test@.com",
      ];

      invalidEmails.forEach((email) => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });

  describe("validatePassword", () => {
    it("should validate strong passwords", () => {
      const validPasswords = [
        "StrongPass123!",
        "MySecure@Password1",
        "Complex#Pass99",
      ];

      validPasswords.forEach((password) => {
        expect(validatePassword(password)).toBe(true);
      });
    });

    it("should reject weak passwords", () => {
      const invalidPasswords = [
        "short", // Less than 8 characters
        "1234567", // Less than 8 characters
        "", // Empty string
      ];

      invalidPasswords.forEach((password) => {
        expect(validatePassword(password)).toBe(false);
      });
    });
  });

  describe("validateAmount", () => {
    it("should validate positive numbers", () => {
      const validAmounts = [1, 1.5, 100.99, 0.001, 1000000];

      validAmounts.forEach((amount) => {
        expect(validateAmount(amount)).toBe(true);
      });
    });

    it("should reject invalid amounts", () => {
      const invalidAmounts = [
        0,
        -1,
        -100.5,
        NaN,
        Infinity,
        1000001, // Over limit
      ];

      invalidAmounts.forEach((amount) => {
        expect(validateAmount(amount)).toBe(false);
      });
    });
  });
});
