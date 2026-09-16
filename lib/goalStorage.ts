import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const GOALS_KEY = "selectedGoals";
const GOALS_COMPLETED_KEY = "goalsCompleted";

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

export const saveGoals = async (goals: string[]) => {
  await writeValue(GOALS_KEY, JSON.stringify(goals));
  await writeValue(GOALS_COMPLETED_KEY, goals.length > 0 ? "true" : "false");
};

export const getSavedGoals = async (): Promise<string[]> => {
  const storedGoals = await readValue(GOALS_KEY);

  if (!storedGoals) {
    return [];
  }

  try {
    const parsedGoals = JSON.parse(storedGoals);
    return Array.isArray(parsedGoals)
      ? parsedGoals.filter((goal): goal is string => typeof goal === "string")
      : [];
  } catch {
    return [];
  }
};

export const getGoalsCompleted = async () => {
  return (await readValue(GOALS_COMPLETED_KEY)) === "true";
};
