import {
  validateVolunteerHours,
  formatVolunteerTime,
  isValidSkill,
} from "../volunteer";

describe("volunteer utils", () => {
  describe("validateVolunteerHours", () => {
    it("validates positive numbers", () => {
      expect(validateVolunteerHours(5)).toBe(true);
      expect(validateVolunteerHours(0.5)).toBe(true);
      expect(validateVolunteerHours(24)).toBe(true);
    });

    it("rejects invalid values", () => {
      expect(validateVolunteerHours(-1)).toBe(false);
      expect(validateVolunteerHours(0)).toBe(false);
      expect(validateVolunteerHours(25)).toBe(false);
    });
  });

  describe("formatVolunteerTime", () => {
    it("formats hours correctly", () => {
      expect(formatVolunteerTime(1)).toBe("1 hour");
      expect(formatVolunteerTime(2)).toBe("2 hours");
      expect(formatVolunteerTime(0.5)).toBe("0.5 hours");
    });
  });

  describe("isValidSkill", () => {
    it("validates skill names", () => {
      expect(isValidSkill("Programming")).toBe(true);
      expect(isValidSkill("Teaching")).toBe(true);
      expect(isValidSkill("")).toBe(false);
    });
  });
});
