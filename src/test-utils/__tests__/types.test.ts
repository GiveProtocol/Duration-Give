import type { MockButtonProps, MockInputProps, MockCardProps } from "../types";
import { cssClasses } from "../types";

describe("types", () => {
  it("MockButtonProps includes expected properties", () => {
    const mockButton: MockButtonProps = {
      children: "Test",
      onClick: jest.fn(),
      variant: "primary",
      disabled: false,
      className: "test-class",
      type: "button",
    };

    expect(mockButton.children).toBe("Test");
    expect(typeof mockButton.onClick).toBe("function");
    expect(mockButton.variant).toBe("primary");
  });

  it("MockInputProps includes expected properties", () => {
    const mockInput: MockInputProps = {
      value: "test-value",
      onChange: jest.fn(),
      placeholder: "Enter text",
      disabled: false,
      className: "input-class",
      type: "text",
    };

    expect(mockInput.value).toBe("test-value");
    expect(typeof mockInput.onChange).toBe("function");
    expect(mockInput.type).toBe("text");
  });

  it("MockCardProps includes expected properties", () => {
    const mockCard: MockCardProps = {
      children: "Card content",
      className: "card-class",
      onClick: jest.fn(),
    };

    expect(mockCard.children).toBe("Card content");
    expect(mockCard.className).toBe("card-class");
    expect(typeof mockCard.onClick).toBe("function");
  });

  describe("cssClasses", () => {
    it("contains expected card classes", () => {
      expect(cssClasses.card.default).toEqual([
        "bg-white",
        "border",
        "border-gray-200",
        "rounded-lg",
        "p-4",
      ]);
      expect(cssClasses.card.success).toEqual([
        "bg-green-50",
        "border",
        "border-green-200",
        "rounded-lg",
        "p-4",
      ]);
      expect(cssClasses.card.error).toEqual([
        "p-3",
        "bg-red-50",
        "text-red-700",
        "text-sm",
        "rounded-md",
      ]);
    });

    it("contains expected button classes", () => {
      expect(cssClasses.button.primary).toEqual(["flex", "items-center"]);
      expect(cssClasses.button.secondary).toEqual(["flex", "items-center"]);
    });

    it("contains expected spinner classes", () => {
      expect(cssClasses.spinner.default).toEqual(["animate-spin"]);
    });
  });
});
