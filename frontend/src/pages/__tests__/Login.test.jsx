import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import API from "../../api/api";

const mockNavigate = jest.fn();

jest.mock("../../api/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

// ✅ Virtual mock so Jest does not need the real react-router-dom package here
jest.mock(
  "react-router-dom",
  () => ({
    useNavigate: () => mockNavigate,
    Link: ({ children, to }) => <a href={to}>{children}</a>,
  }),
  { virtual: true }
);

jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

describe("Login page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders login form", () => {
    render(<Login />);
    expect(screen.getByText(/login/i)).toBeInTheDocument();
  });

  test("submits login form and calls API", async () => {
    API.post.mockResolvedValue({
      data: {
        token: "fake-jwt-token",
        role: "MANAGER",
        email: "manager@siemens.com",
        fullName: "Manager User",
      },
    });

    render(<Login />);

    const emailInput =
      document.querySelector('input[name="email"]') ||
      screen.getByPlaceholderText(/email/i);

    const passwordInput =
      document.querySelector('input[name="password"]') ||
      screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, {
      target: { value: "manager@siemens.com" },
    });

    fireEvent.change(passwordInput, {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(API.post).toHaveBeenCalled();
    });
  });
});