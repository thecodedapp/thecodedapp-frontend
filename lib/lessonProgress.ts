import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const HIGHEST_UNLOCKED_LESSON_KEY = "highestUnlockedLesson";

const readValue = async () => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(HIGHEST_UNLOCKED_LESSON_KEY);
    }

    return null;
  }

  return SecureStore.getItemAsync(HIGHEST_UNLOCKED_LESSON_KEY);
};

const writeValue = async (value: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(HIGHEST_UNLOCKED_LESSON_KEY, value);
    }

    return;
  }

  await SecureStore.setItemAsync(HIGHEST_UNLOCKED_LESSON_KEY, value);
};

export const getHighestUnlockedLesson = async () => {
  const storedValue = await readValue();
  const parsedValue = Number(storedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1;
  }

  return Math.floor(parsedValue);
};

export const completeLesson = async (lessonNumber: number) => {
  const currentHighest = await getHighestUnlockedLesson();
  const nextLesson = lessonNumber + 1;

  if (nextLesson > currentHighest) {
    await writeValue(String(nextLesson));
  }
};
