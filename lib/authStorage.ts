import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "authToken";
const USER_ID_KEY = "authUserId";

const setValue = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
    return;
  }

  await SecureStore.setItemAsync(key, value);
};

const getValue = async (key: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(key);
    }
    return null;
  }

  return SecureStore.getItemAsync(key);
};

const deleteValue = async (key: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
    return;
  }

  await SecureStore.deleteItemAsync(key);
};

export const saveUserId = async (userId: string) => {
  await setValue(USER_ID_KEY, userId);
};

export const getUserId = async () => getValue(USER_ID_KEY);

export const saveToken = async (token: string, userId?: string) => {
  await setValue(TOKEN_KEY, token);

  if (userId) {
    await saveUserId(userId);
  }
};

export const getToken = async () => getValue(TOKEN_KEY);

export const deleteToken = async () => {
  await Promise.all([deleteValue(TOKEN_KEY), deleteValue(USER_ID_KEY)]);
};
