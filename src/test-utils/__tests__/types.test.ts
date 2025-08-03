import type { MockButtonProps, MockInputProps, MockCardProps } from "../types";

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
    expect(mockButton.onClick).toBeInstanceOf(Function);
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
    expect(mockInput.onChange).toBeInstanceOf(Function);
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
    expect(mockCard.onClick).toBeInstanceOf(Function);
  });
});
