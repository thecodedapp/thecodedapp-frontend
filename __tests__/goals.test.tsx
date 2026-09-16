import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";
import GoalsScreen from "../app/goals";
import { deleteToken } from "../lib/authStorage";
import { getSavedGoals, saveGoals } from "../lib/goalStorage";

jest.mock("expo-router", () => ({
  router: {
    replace: jest.fn(),
  },
}));

jest.mock("../lib/authStorage", () => ({
  deleteToken: jest.fn(),
}));

jest.mock("../lib/goalStorage", () => ({
  getSavedGoals: jest.fn(),
  saveGoals: jest.fn(),
}));

const getSavedGoalsMock = getSavedGoals as jest.MockedFunction<
  typeof getSavedGoals
>;

describe("GoalsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getSavedGoalsMock.mockResolvedValue([]);
  });

  it("shows Continue disabled before a goal is selected", async () => {
    const { findByText } = render(<GoalsScreen />);

    expect(await findByText("Continue")).toBeTruthy();
  });

  it("allows continuing after selecting a goal", async () => {
    const { findByText, getByText } = render(<GoalsScreen />);

    await findByText("I'm new to coding");
    fireEvent.press(getByText("I'm new to coding"));
    fireEvent.press(getByText("Continue"));

    await waitFor(() => {
      expect(saveGoals).toHaveBeenCalledWith(["I'm new to coding"]);
      expect(router.replace).toHaveBeenCalledWith("/course-map");
    });
  });

  it("does not continue after deselecting the only goal", async () => {
    const { findByText, getByText } = render(<GoalsScreen />);

    await findByText("I'm new to coding");
    fireEvent.press(getByText("I'm new to coding"));
    fireEvent.press(getByText("I'm new to coding"));
    fireEvent.press(getByText("Continue"));

    await waitFor(() => {
      expect(saveGoals).not.toHaveBeenCalled();
      expect(router.replace).not.toHaveBeenCalledWith("/course-map");
    });
  });

  it("restores saved goal selections", async () => {
    getSavedGoalsMock.mockResolvedValue(["I want to build things"]);

    const { findByText, getByText } = render(<GoalsScreen />);

    await findByText("I want to build things");
    fireEvent.press(getByText("Continue"));

    await waitFor(() => {
      expect(saveGoals).toHaveBeenCalledWith(["I want to build things"]);
      expect(router.replace).toHaveBeenCalledWith("/course-map");
    });
  });

  it("logs out and returns to the welcome screen", async () => {
    const { findByText, getByText } = render(<GoalsScreen />);

    await findByText("Log out");
    fireEvent.press(getByText("Log out"));

    await waitFor(() => {
      expect(deleteToken).toHaveBeenCalledTimes(1);
      expect(router.replace).toHaveBeenCalledWith("/");
    });
  });
});
