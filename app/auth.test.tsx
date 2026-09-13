import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import AuthScreen from "./auth";
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

describe("AuthScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
  });

  it("logs in a verified user, saves the token, and routes to goals", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "test-token",
        user: {
          email: "user@example.com",
          emailVerified: true,
        },
      }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "user@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Password1");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            email: "user@example.com",
            password: "Password1",
          }),
        })
      );
      expect(saveToken).toHaveBeenCalledWith("test-token");
      expect(router.replace).toHaveBeenCalledWith("/goals");
    });
  });

  it("routes an unverified user to email verification", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        token: "test-token",
        user: {
          email: "user@example.com",
          emailVerified: false,
        },
      }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "user@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "Password1");
    fireEvent.press(getByText("Login"));

    await waitFor(() => {
      expect(saveToken).toHaveBeenCalledWith("test-token");
      expect(router.replace).toHaveBeenCalledWith({
        pathname: "/verify-email",
        params: {
          email: "user@example.com",
        },
      });
    });
  });

  it("shows the backend error when login fails", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({
        error: "Invalid email or password",
      }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<AuthScreen />);

    fireEvent.changeText(getByPlaceholderText("Email"), "user@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "WrongPassword1");
    fireEvent.press(getByText("Login"));

    expect(await waitFor(() => getByText("Invalid email or password"))).toBeTruthy();
    expect(saveToken).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("opens signup when the user presses Sign up", () => {
    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText("Sign up"));

    expect(router.push).toHaveBeenCalledWith("/signup");
  });
});
