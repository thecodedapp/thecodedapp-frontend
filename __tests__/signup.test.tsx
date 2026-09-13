import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import SignupScreen from "../app/signup";
import { saveToken } from "../lib/authStorage";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("../lib/authStorage", () => ({
  saveToken: jest.fn(),
}));

const fetchMock = jest.fn<typeof fetch>();

describe("SignupScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
  });

  it("saves the token and routes to verification after signup", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "signup-token",
        user: { email: "newuser@example.com" },
      }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "newuser@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Password1");
    fireEvent.press(getByText("Sign up"));

    await waitFor(() => {
      expect(saveToken).toHaveBeenCalledWith("signup-token");
      expect(router.replace).toHaveBeenCalledWith({
        pathname: "/verify-email",
        params: { email: "newuser@example.com" },
      });
    });
  });

  it("shows backend password validation errors", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Password must be at least 8 characters and include an uppercase letter and a number",
      }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<SignupScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "newuser@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password");
    fireEvent.press(getByText("Sign up"));

    expect(
      await waitFor(() =>
        getByText(
          "Password must be at least 8 characters and include an uppercase letter and a number"
        )
      )
    ).toBeTruthy();
    expect(saveToken).not.toHaveBeenCalled();
  });

  it("opens login from the existing-account link", () => {
    const { getByText } = render(<SignupScreen />);

    fireEvent.press(getByText("Log in"));

    expect(router.push).toHaveBeenCalledWith("/auth");
  });
});
