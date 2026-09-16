import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router, useLocalSearchParams } from "expo-router";
import VerifyEmailScreen from "../app/verify-email";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
  useLocalSearchParams: jest.fn(),
}));

const fetchMock = jest.fn<typeof fetch>();
const paramsMock = useLocalSearchParams as jest.MockedFunction<typeof useLocalSearchParams>;

describe("VerifyEmailScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    paramsMock.mockReturnValue({ email: "user@example.com" });
    globalThis.fetch = fetchMock as unknown as typeof globalThis.fetch;
  });

  it("routes to goals after successful verification", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Email verified successfully" }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<VerifyEmailScreen />);

    fireEvent.changeText(getByPlaceholderText("000000"), "123456");
    fireEvent.press(getByText("Verify"));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining("/auth/verify-email"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ email: "user@example.com", code: "123456" }),
        })
      );
      expect(router.replace).toHaveBeenCalledWith("/goals");
    });
  });

  it("shows an error before calling the server for an incomplete code", () => {
    const { getByPlaceholderText, getByText } = render(<VerifyEmailScreen />);

    fireEvent.changeText(getByPlaceholderText("000000"), "123");
    fireEvent.press(getByText("Verify"));

    expect(getByText("Enter the 6-digit code from your email")).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows a backend verification error", async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Verification code is invalid or expired" }),
    } as unknown as Response);

    const { getByPlaceholderText, getByText } = render(<VerifyEmailScreen />);

    fireEvent.changeText(getByPlaceholderText("000000"), "999999");
    fireEvent.press(getByText("Verify"));

    expect(
      await waitFor(() => getByText("Verification code is invalid or expired"))
    ).toBeTruthy();
    expect(router.replace).not.toHaveBeenCalled();
  });

  it("resends the verification code and shows success", async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Verification code resent" }),
    } as unknown as Response);

    const { getByText } = render(<VerifyEmailScreen />);

    fireEvent.press(getByText("Resend code"));

    expect(await waitFor(() => getByText("A new code was sent!"))).toBeTruthy();
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/auth/resend-verification"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ email: "user@example.com" }),
      })
    );
  });
});
