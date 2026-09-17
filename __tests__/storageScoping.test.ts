import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import * as SecureStore from "expo-secure-store";

import { getUserId, getToken } from "../lib/authStorage";
import { getSavedGoals, saveGoals } from "../lib/goalStorage";
import {
  completeLesson,
  getLessonProgress,
} from "../lib/lessonProgress";

jest.mock("../lib/authStorage", () => ({
  getUserId: jest.fn(),
  getToken: jest.fn(),
}));

const mockStorage = new Map<string, string>();

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async (key: string) => mockStorage.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStorage.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockStorage.delete(key);
  }),
}));

const getUserIdMock = getUserId as jest.MockedFunction<typeof getUserId>;
const getTokenMock = getToken as jest.MockedFunction<typeof getToken>;

describe("account-scoped local mockStorage", () => {
  beforeEach(() => {
    mockStorage.clear();
    jest.clearAllMocks();
    getTokenMock.mockResolvedValue(null);
  });

  it("keeps goals separate when switching accounts", async () => {
    getUserIdMock.mockResolvedValue("user-a");
    await saveGoals(["Build apps"]);

    getUserIdMock.mockResolvedValue("user-b");
    expect(await getSavedGoals()).toEqual([]);
    await saveGoals(["Interview prep"]);

    getUserIdMock.mockResolvedValue("user-a");
    expect(await getSavedGoals()).toEqual(["Build apps"]);

    getUserIdMock.mockResolvedValue("user-b");
    expect(await getSavedGoals()).toEqual(["Interview prep"]);
  });

  it("keeps lesson progress separate when switching accounts", async () => {
    getUserIdMock.mockResolvedValue("user-a");
    await completeLesson(1);

    getUserIdMock.mockResolvedValue("user-b");
    expect(await getLessonProgress()).toEqual({
      highestUnlockedLesson: 1,
      completedLessons: [],
    });

    getUserIdMock.mockResolvedValue("user-a");
    expect(await getLessonProgress()).toEqual({
      highestUnlockedLesson: 2,
      completedLessons: [1],
    });
  });

  it("uses user-scoped SecureStore keys", async () => {
    getUserIdMock.mockResolvedValue("user-a");
    await saveGoals(["Build apps"]);
    await completeLesson(1);

    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "selectedGoals:user-a",
      JSON.stringify(["Build apps"])
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "highestUnlockedLesson:user-a",
      "2"
    );
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith(
      "completedLessons:user-a",
      JSON.stringify([1])
    );
  });
});
