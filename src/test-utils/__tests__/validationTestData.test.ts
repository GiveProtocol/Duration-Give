import {
  validEmailCases,
  invalidEmailCases,
  validPasswordCases,
  invalidPasswordCases,
  validNameCases,
  invalidNameCases,
} from "../validationTestData";

describe("validationTestData", () => {
  describe("validEmailCases", () => {
    it("contains valid email examples", () => {
      expect(validEmailCases).toContain("test@example.com");
      expect(validEmailCases).toContain("user.name@domain.org");
      expect(validEmailCases.length).toBeGreaterThan(0);

      validEmailCases.forEach((email) => {
        expect(typeof email).toBe("string");
        expect(email).toContain("@");
      });
    });
  });

  describe("invalidEmailCases", () => {
    it("contains invalid email examples", () => {
      expect(invalidEmailCases).toContain("invalid-email");
      expect(invalidEmailCases).toContain("test@");
      expect(invalidEmailCases.length).toBeGreaterThan(0);

      invalidEmailCases.forEach((email) => {
        expect(typeof email).toBe("string");
      });
    });
  });

  describe("validPasswordCases", () => {
    it("contains valid password examples", () => {
      expect(validPasswordCases.length).toBeGreaterThan(0);

      validPasswordCases.forEach((password) => {
        expect(typeof password).toBe("string");
        expect(password.length).toBeGreaterThanOrEqual(8);
      });
    });
  });

  describe("invalidPasswordCases", () => {
    it("contains invalid password examples", () => {
      expect(invalidPasswordCases).toContain("123");
      expect(invalidPasswordCases).toContain("weak");
      expect(invalidPasswordCases.length).toBeGreaterThan(0);
    });
  });

  describe("validNameCases", () => {
    it("contains valid name examples", () => {
      expect(validNameCases).toContain("John Doe");
      expect(validNameCases).toContain("Test Organization");
      expect(validNameCases.length).toBeGreaterThan(0);
    });
  });

  describe("invalidNameCases", () => {
    it("contains invalid name examples", () => {
      expect(invalidNameCases).toContain("");
      expect(invalidNameCases.length).toBeGreaterThan(0);
    });
  });
});
