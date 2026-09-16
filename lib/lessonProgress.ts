import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

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

export const getHighestUnlockedLesson = async () => {
  const storedValue = await readValue(HIGHEST_UNLOCKED_LESSON_KEY);
  const parsedValue = Number(storedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return Math.floor(parsedValue);
};

export const getCompletedLessons = async () => {
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
      // Fall through to the migration below.
    }
  }

  // Migrate progress created before completed lesson IDs were stored.
  const highestUnlockedLesson = await getHighestUnlockedLesson();
  const migratedCompletedLessons = Array.from(
    { length: Math.max(0, highestUnlockedLesson - 1) },
    (_, index) => index + 1
  );

  if (migratedCompletedLessons.length > 0) {
    await writeValue(
      COMPLETED_LESSONS_KEY,
      JSON.stringify(migratedCompletedLessons)
    );
  }

  return migratedCompletedLessons;
};

export const completeLesson = async (lessonNumber: number) => {
  const [currentHighest, completedLessons] = await Promise.all([
    getHighestUnlockedLesson(),
    getCompletedLessons(),
  ]);

  if (!completedLessons.includes(lessonNumber)) {
    const nextCompletedLessons = [...completedLessons, lessonNumber].sort(
      (a, b) => a - b
    );

    await writeValue(
      COMPLETED_LESSONS_KEY,
      JSON.stringify(nextCompletedLessons)
    );
  }

  const nextLesson = lessonNumber + 1;

  if (nextLesson > currentHighest) {
    await writeValue(HIGHEST_UNLOCKED_LESSON_KEY, String(nextLesson));
  }
};
