import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { API_URL } from "./api";
import { getToken, getUserId } from "./authStorage";

const LEGACY_HIGHEST_UNLOCKED_LESSON_KEY = "highestUnlockedLesson";
const LEGACY_COMPLETED_LESSONS_KEY = "completedLessons";

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

const getScopedKeys = async () => {
  const userId = await getUserId();

  return {
    highest: userId
      ? `${LEGACY_HIGHEST_UNLOCKED_LESSON_KEY}:${userId}`
      : LEGACY_HIGHEST_UNLOCKED_LESSON_KEY,
    completed: userId
      ? `${LEGACY_COMPLETED_LESSONS_KEY}:${userId}`
      : LEGACY_COMPLETED_LESSONS_KEY,
  };
};

const getLocalHighestUnlockedLesson = async () => {
  const { highest } = await getScopedKeys();
  const storedValue = await readValue(highest);
  const parsedValue = Number(storedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) return 1;
  return Math.floor(parsedValue);
};

const getLocalCompletedLessons = async () => {
  const { completed } = await getScopedKeys();
  const storedValue = await readValue(completed);

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
  const { highest, completed } = await getScopedKeys();

  await Promise.all([
    writeValue(highest, String(highestUnlockedLesson)),
    writeValue(completed, JSON.stringify(completedLessons)),
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
    if (!token) return false;

    const response = await fetch(`${API_URL}/progress`, {
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

    if (!response.ok) {
      console.warn(`Could not sync lesson progress yet: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Could not sync lesson progress yet:", error);
    return false;
  }
};

export const getLessonProgress = async () => {
  const [localHighest, localCompleted, remote] = await Promise.all([
    getLocalHighestUnlockedLesson(),
    getLocalCompletedLessons(),
    getRemoteProgress(),
  ]);

  const completedLessons = Array.from(
    new Set([...localCompleted, ...(remote?.completedLessons ?? [])])
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
  const progress = await getLessonProgress();
  return progress.highestUnlockedLesson;
};

export const getCompletedLessons = async () => {
  const progress = await getLessonProgress();
  return progress.completedLessons;
};

export const completeLesson = async (lessonNumber: number) => {
  const { highestUnlockedLesson, completedLessons } = await getLessonProgress();
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
