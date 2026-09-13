import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import GoalsScreen from "../app/goals";
import { deleteToken } from "../lib/authStorage";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("../lib/authStorage", () => ({
  deleteToken: jest.fn(),
}));

describe("GoalsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("does not show Next before a goal is selected", () => {
    const { queryByText } = render(<GoalsScreen />);

    expect(queryByText("Next →")).toBeNull();
  });

  it("shows Next after selecting a goal", () => {
    const { getByText } = render(<GoalsScreen />);

    fireEvent.press(getByText("I'm new to coding"));

    expect(getByText("Next →")).toBeTruthy();
  });

  it("hides Next again after deselecting the only goal", () => {
    const { getByText, queryByText } = render(<GoalsScreen />);

    fireEvent.press(getByText("I'm new to coding"));
    fireEvent.press(getByText("I'm new to coding"));

    expect(queryByText("Next →")).toBeNull();
  });

  it("logs out and returns to the welcome screen", async () => {
    const { getByText } = render(<GoalsScreen />);

    fireEvent.press(getByText("Log out"));

    await waitFor(() => {
      expect(deleteToken).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });
});
