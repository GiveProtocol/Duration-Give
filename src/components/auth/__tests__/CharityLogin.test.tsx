import React from "react"; // eslint-disable-line no-unused-vars
import { render, screen, fireEvent } from "@testing-library/react";
import { CharityLogin } from "../CharityLogin";

const mockLogin = jest.fn();

jest.mock("@/hooks/useAuth", () => ({
  useAuth: jest.fn(() => ({
    login: mockLogin,
    loading: false,
    error: null,
  })),
}));

describe("CharityLogin", () => {
  beforeEach(() => {
    mockLogin.mockClear();
  });

  it("renders login form", () => {
    render(<CharityLogin />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("calls login on form submission", () => {

    render(<CharityLogin />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@charity.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockLogin).toHaveBeenCalledWith(
      "test@charity.com",
      "password123",
      "charity",
    );
  });
});
