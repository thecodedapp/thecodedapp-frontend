import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import WelcomeScreen from "../app/index";
import { deleteToken, getToken } from "../lib/authStorage";

jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("../lib/authStorage", () => ({
  getToken: jest.fn(),
  deleteToken: jest.fn(),
}));

const fetchMock = jest.fn<typeof fetch>();
const getTokenMock = getToken as jest.MockedFunction<typeof getToken>;

describe("WelcomeScreen auth bootstrap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
  });

  it("routes a verified saved session to goals", async () => {
    getTokenMock.mockResolvedValue("saved-token");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { email: "user@example.com", emailVerified: true },
      }),
    } as unknown as Response);

    render(<WelcomeScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith("/goals");
    });
    expect(deleteToken).not.toHaveBeenCalled();
  });

  it("routes an unverified saved session to email verification", async () => {
    getTokenMock.mockResolvedValue("saved-token");
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        user: { email: "user@example.com", emailVerified: false },
      }),
    } as unknown as Response);

    render(<WelcomeScreen />);

    await waitFor(() => {
      expect(router.replace).toHaveBeenCalledWith({
        pathname: "/verify-email",
        params: { email: "user@example.com" },
      });
    });
  });

  it("deletes an invalid saved token and shows the welcome screen", async () => {
    getTokenMock.mockResolvedValue("bad-token");
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Invalid or expired token" }),
    } as unknown as Response);

    const { findByText } = render(<WelcomeScreen />);

    expect(await findByText("Start learning")).toBeTruthy();
    expect(deleteToken).toHaveBeenCalledTimes(1);
  });

  it("keeps the saved token on a network failure and shows the welcome screen", async () => {
    getTokenMock.mockResolvedValue("saved-token");
    fetchMock.mockRejectedValue(new Error("network unavailable"));

    const { findByText } = render(<WelcomeScreen />);

    expect(await findByText("Start learning")).toBeTruthy();
    expect(deleteToken).not.toHaveBeenCalled();
  });
});
