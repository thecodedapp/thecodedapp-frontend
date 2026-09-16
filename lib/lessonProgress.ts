import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { API_URL } from "./api";
import { getToken } from "./authStorage";

const HIGHEST_UNLOCKED_LESSON_KEY = "highestUnlockedLesson";
const COMPLETED_LESSONS_KEY = "completedLessons";

const readValue = async (key: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }

    return null;
  }

  return SecureStore.getItemAsync(key);
};

const writeValue = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }

    return;
  }

  await SecureStore.setItemAsync(key, value);
};

const getLocalHighestUnlockedLesson = async () => {
  const storedValue = await readValue(HIGHEST_UNLOCKED_LESSON_KEY);
  const parsedValue = Number(storedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) return 1;
  return Math.floor(parsedValue);
};

const getLocalCompletedLessons = async () => {
  const storedValue = await readValue(COMPLETED_LESSONS_KEY);

  if (storedValue) {
    try {
      const parsedValue = JSON.parse(storedValue);
      if (Array.isArray(parsedValue)) {
        return parsedValue
          .map(Number)
          .filter((value) => Number.isInteger(value) && value > 0);
      }
    } catch {
      // Fall through to the legacy migration below.
    }
  }

  const highestUnlockedLesson = await getLocalHighestUnlockedLesson();
  return Array.from(
    { length: Math.max(0, highestUnlockedLesson - 1) },
    (_, index) => index + 1
  );
};

const saveLocalProgress = async (
  highestUnlockedLesson: number,
  completedLessons: number[]
) => {
  await Promise.all([
    writeValue(HIGHEST_UNLOCKED_LESSON_KEY, String(highestUnlockedLesson)),
    writeValue(COMPLETED_LESSONS_KEY, JSON.stringify(completedLessons)),
  ]);
};

const getRemoteProgress = async (): Promise<{
  highestUnlockedLesson: number;
  completedLessons: number[];
} | null> => {
  try {
    const token = await getToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/progress`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return {
      highestUnlockedLesson:
        Number.isInteger(data.highestUnlockedLesson) &&
        data.highestUnlockedLesson > 0
          ? data.highestUnlockedLesson
          : 1,
      completedLessons: Array.isArray(data.completedLessons)
        ? data.completedLessons
            .map(Number)
            .filter((value: number) => Number.isInteger(value) && value > 0)
        : [],
    };
  } catch {
    return null;
  }
};

const pushProgressToServer = async (
  highestUnlockedLesson: number,
  completedLessons: number[]
) => {
  try {
    const token = await getToken();
    if (!token) return;

    await fetch(`${API_URL}/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        highestUnlockedLesson,
        completedLessons,
      }),
    });
  } catch (error) {
    console.warn("Could not sync lesson progress yet:", error);
  }
};

const getMergedProgress = async () => {
  const [localHighest, localCompleted, remote] = await Promise.all([
    getLocalHighestUnlockedLesson(),
    getLocalCompletedLessons(),
    getRemoteProgress(),
  ]);

  const completedLessons = Array.from(
    new Set([
      ...localCompleted,
      ...(remote?.completedLessons ?? []),
    ])
  ).sort((a, b) => a - b);

  const highestUnlockedLesson = Math.max(
    localHighest,
    remote?.highestUnlockedLesson ?? 1,
    completedLessons.length > 0 ? Math.max(...completedLessons) + 1 : 1
  );

  await saveLocalProgress(highestUnlockedLesson, completedLessons);

  if (
    remote &&
    (remote.highestUnlockedLesson !== highestUnlockedLesson ||
      remote.completedLessons.length !== completedLessons.length ||
      remote.completedLessons.some((lesson) => !completedLessons.includes(lesson)))
  ) {
    void pushProgressToServer(highestUnlockedLesson, completedLessons);
  }

  return { highestUnlockedLesson, completedLessons };
};

export const getHighestUnlockedLesson = async () => {
  const progress = await getMergedProgress();
  return progress.highestUnlockedLesson;
};

export const getCompletedLessons = async () => {
  const progress = await getMergedProgress();
  return progress.completedLessons;
};

export const completeLesson = async (lessonNumber: number) => {
  const { highestUnlockedLesson, completedLessons } = await getMergedProgress();
  const nextCompletedLessons = completedLessons.includes(lessonNumber)
    ? completedLessons
    : [...completedLessons, lessonNumber].sort((a, b) => a - b);
  const nextHighestUnlockedLesson = Math.max(
    highestUnlockedLesson,
    lessonNumber + 1
  );

  await saveLocalProgress(nextHighestUnlockedLesson, nextCompletedLessons);
  await pushProgressToServer(nextHighestUnlockedLesson, nextCompletedLessons);
};
