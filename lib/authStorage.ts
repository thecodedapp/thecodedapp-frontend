import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "authToken";

export const saveToken = async (token: string) => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, token);
    }

    return;
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(TOKEN_KEY);
    }

    return null;
  }

  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const deleteToken = async () => {
  if (Platform.OS === "web") {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
    }

    return;
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY);
};