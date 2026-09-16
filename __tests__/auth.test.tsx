import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import AuthScreen from "../app/auth";
import { saveToken } from "../lib/authStorage";
import { getGoalsCompleted } from "../lib/goalStorage";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("../lib/authStorage", () => ({
  saveToken: jest.fn(),
}));

jest.mock("../lib/goalStorage", () => ({
  getGoalsCompleted: jest.fn(),
}));

const fetchMock = jest.fn<typeof fetch>();
const getGoalsCompletedMock = getGoalsCompleted as jest.MockedFunction<
  typeof getGoalsCompleted
>;

describe("AuthScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
    getGoalsCompletedMock.mockResolvedValue(false);
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

    fireEvent.changeText(
      getByPlaceholderText("you@example.com"),
      "user@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Your password"), "Password1");
    fireEvent.press(getByText("Log In"));

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

  it("routes a verified returning user to the course map", async () => {
    getGoalsCompletedMock.mockResolvedValue(true);
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

    fireEvent.changeText(
      getByPlaceholderText("you@example.com"),
      "user@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Your password"), "Password1");
    fireEvent.press(getByText("Log In"));

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/course-map");
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

    fireEvent.changeText(
      getByPlaceholderText("you@example.com"),
      "user@example.com"
    );
    fireEvent.changeText(getByPlaceholderText("Your password"), "Password1");
    fireEvent.press(getByText("Log In"));

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

    fireEvent.changeText(
      getByPlaceholderText("you@example.com"),
      "user@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Your password"),
      "WrongPassword1"
    );
    fireEvent.press(getByText("Log In"));

    expect(await waitFor(() => getByText("Invalid email or password"))).toBeTruthy();
    expect(saveToken).not.toHaveBeenCalled();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("opens signup when the user presses Create an account", () => {
    const { getByText } = render(<AuthScreen />);

    fireEvent.press(getByText("Create an account"));

    expect(router.push).toHaveBeenCalledWith("/signup");
  });
});
