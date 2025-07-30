import { InputValidator } from "../inputValidation";

describe("InputValidator", () => {
  describe("validateEmail", () => {
    it("validates correct email addresses", () => {
      expect(InputValidator.validateEmail("test@example.com")).toBe(true);
      expect(InputValidator.validateEmail("user.name+tag@domain.co.uk")).toBe(
        true,
      );
      expect(InputValidator.validateEmail("user123@test-domain.org")).toBe(
        true,
      );
    });

    it("rejects invalid email addresses", () => {
      expect(InputValidator.validateEmail("")).toBe(false);
      expect(InputValidator.validateEmail("invalid")).toBe(false);
      expect(InputValidator.validateEmail("test@")).toBe(false);
      expect(InputValidator.validateEmail("@example.com")).toBe(false);
      expect(InputValidator.validateEmail("test@.com")).toBe(false);
      expect(InputValidator.validateEmail("test@example")).toBe(false);
      expect(InputValidator.validateEmail("test..test@example.com")).toBe(
        false,
      );
    });
  });

  describe("validatePassword", () => {
    it("validates strong passwords", () => {
      expect(InputValidator.validatePassword("Password123!")).toBe(true);
      expect(InputValidator.validatePassword("SecurePass1@")).toBe(true);
      expect(InputValidator.validatePassword("MyP@ssw0rd")).toBe(true);
    });

    it("rejects weak passwords", () => {
      expect(InputValidator.validatePassword("")).toBe(false);
      expect(InputValidator.validatePassword("password")).toBe(false); // no uppercase, no number, no special
      expect(InputValidator.validatePassword("PASSWORD")).toBe(false); // no lowercase, no number, no special
      expect(InputValidator.validatePassword("Password")).toBe(false); // no number, no special
      expect(InputValidator.validatePassword("Password1")).toBe(false); // no special character
      expect(InputValidator.validatePassword("Pass1!")).toBe(false); // too short
      expect(InputValidator.validatePassword("password123!")).toBe(false); // no uppercase
    });
  });

  describe("validateURL", () => {
    it("validates correct HTTPS URLs", () => {
      expect(InputValidator.validateURL("https://example.com")).toBe(true);
      expect(InputValidator.validateURL("https://www.example.com")).toBe(true);
      expect(InputValidator.validateURL("https://example.com/path")).toBe(true);
      expect(
        InputValidator.validateURL(
          "https://subdomain.example.com/path/to/page",
        ),
      ).toBe(true);
      expect(
        InputValidator.validateURL("https://api.example.co.uk/v1/endpoint"),
      ).toBe(true);
    });

    it("rejects invalid URLs", () => {
      expect(InputValidator.validateURL("")).toBe(false);
      expect(InputValidator.validateURL("http://example.com")).toBe(false); // not HTTPS
      expect(InputValidator.validateURL("https://")).toBe(false); // incomplete
      expect(InputValidator.validateURL("https://example")).toBe(false); // no TLD
      expect(InputValidator.validateURL("example.com")).toBe(false); // no protocol
      expect(InputValidator.validateURL("ftp://example.com")).toBe(false); // wrong protocol
    });
  });

  describe("sanitizeInput", () => {
    it("removes HTML tags and quotes", () => {
      expect(
        InputValidator.sanitizeInput('<script>alert("test")</script>'),
      ).toBe("scriptalert(test)/script");
      expect(InputValidator.sanitizeInput("<div>content</div>")).toBe(
        "divcontent/div",
      );
      expect(
        InputValidator.sanitizeInput(
          "text with \"quotes\" and 'single quotes'",
        ),
      ).toBe("text with quotes and single quotes");
    });

    it("trims whitespace", () => {
      expect(InputValidator.sanitizeInput("  test  ")).toBe("test");
      expect(InputValidator.sanitizeInput("\n\ttest\n\t")).toBe("test");
    });

    it("handles empty and whitespace-only strings", () => {
      expect(InputValidator.sanitizeInput("")).toBe("");
      expect(InputValidator.sanitizeInput("   ")).toBe("");
      expect(InputValidator.sanitizeInput("\n\t")).toBe("");
    });

    it("preserves safe content", () => {
      expect(InputValidator.sanitizeInput("normal text")).toBe("normal text");
      expect(InputValidator.sanitizeInput("text with numbers 123")).toBe(
        "text with numbers 123",
      );
      expect(
        InputValidator.sanitizeInput("text-with-dashes_and_underscores"),
      ).toBe("text-with-dashes_and_underscores");
    });
  });

  describe("validateAmount", () => {
    it("validates correct amounts", () => {
      expect(InputValidator.validateAmount(10)).toBe(true);
      expect(InputValidator.validateAmount(100.5)).toBe(true);
      expect(InputValidator.validateAmount(0.01)).toBe(true);
      expect(InputValidator.validateAmount(999999.99)).toBe(true);
      expect(InputValidator.validateAmount(1000000)).toBe(true); // max amount
    });

    it("rejects invalid amounts", () => {
      expect(InputValidator.validateAmount(0)).toBe(false); // zero
      expect(InputValidator.validateAmount(-10)).toBe(false); // negative
      expect(InputValidator.validateAmount(1000001)).toBe(false); // too large
      expect(InputValidator.validateAmount(10.123)).toBe(false); // more than 2 decimal places
      expect(InputValidator.validateAmount(Infinity)).toBe(false);
      expect(InputValidator.validateAmount(-Infinity)).toBe(false);
      expect(InputValidator.validateAmount(NaN)).toBe(false);
    });

    it("handles edge cases for decimal precision", () => {
      expect(InputValidator.validateAmount(0.99)).toBe(true);
      expect(InputValidator.validateAmount(1.0)).toBe(true);
      expect(InputValidator.validateAmount(10.999)).toBe(false); // 3 decimal places
      expect(InputValidator.validateAmount(0.001)).toBe(false); // 3 decimal places
    });
  });

  describe("static properties", () => {
    it("has the correct regex patterns", () => {
      expect(InputValidator.EMAIL_REGEX).toBeInstanceOf(RegExp);
      expect(InputValidator.PASSWORD_REGEX).toBeInstanceOf(RegExp);
      expect(InputValidator.URL_REGEX).toBeInstanceOf(RegExp);
    });

    it("email regex matches expected pattern", () => {
      expect(InputValidator.EMAIL_REGEX.test("test@example.com")).toBe(true);
      expect(InputValidator.EMAIL_REGEX.test("invalid")).toBe(false);
    });

    it("password regex matches expected pattern", () => {
      expect(InputValidator.PASSWORD_REGEX.test("Password123!")).toBe(true);
      expect(InputValidator.PASSWORD_REGEX.test("weak")).toBe(false);
    });

    it("URL regex matches expected pattern", () => {
      expect(InputValidator.URL_REGEX.test("https://example.com")).toBe(true);
      expect(InputValidator.URL_REGEX.test("http://example.com")).toBe(false);
    });
  });
});
