import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { API_URL } from "./api";
import { getToken, getUserId } from "./authStorage";

const LEGACY_GOALS_KEY = "selectedGoals";
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

const getGoalsKey = async () => {
  const userId = await getUserId();
  return userId ? `${LEGACY_GOALS_KEY}:${userId}` : LEGACY_GOALS_KEY;
};

const readLocalGoals = async (): Promise<string[]> => {
  const storedGoals = await readValue(await getGoalsKey());
  if (!storedGoals) return [];

  try {
    const parsedGoals = JSON.parse(storedGoals);
    return Array.isArray(parsedGoals)
      ? parsedGoals.filter((goal): goal is string => typeof goal === "string")
      : [];
  } catch {
    return [];
  }
};

const saveLocalGoals = async (goals: string[]) => {
  await writeValue(await getGoalsKey(), JSON.stringify(goals));
  await writeValue(GOALS_COMPLETED_KEY, goals.length > 0 ? "true" : "false");
};

const pushGoalsToServer = async (goals: string[]) => {
  try {
    const token = await getToken();
    if (!token) return false;

    const response = await fetch(`${API_URL}/progress`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ goals }),
    });

    if (!response.ok) {
      console.warn(`Could not sync goals yet: ${response.status}`);
      return false;
    }

    return true;
  } catch (error) {
    console.warn("Could not sync goals yet:", error);
    return false;
  }
};

const getRemoteGoals = async (): Promise<string[] | null> => {
  try {
    const token = await getToken();
    if (!token) return null;

    const response = await fetch(`${API_URL}/progress`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return Array.isArray(data.goals)
      ? data.goals.filter((goal: unknown): goal is string => typeof goal === "string")
      : [];
  } catch {
    return null;
  }
};

export const saveGoals = async (goals: string[]) => {
  await saveLocalGoals(goals);
  await pushGoalsToServer(goals);
};

export const getSavedGoals = async (): Promise<string[]> => {
  const [localGoals, remoteGoals] = await Promise.all([
    readLocalGoals(),
    getRemoteGoals(),
  ]);

  if (remoteGoals !== null) {
    if (remoteGoals.length > 0) {
      await saveLocalGoals(remoteGoals);
      return remoteGoals;
    }

    if (localGoals.length > 0) {
      void pushGoalsToServer(localGoals);
    }
  }

  return localGoals;
};

export const getGoalsCompleted = async () => {
  const goals = await getSavedGoals();
  return goals.length > 0;
};
