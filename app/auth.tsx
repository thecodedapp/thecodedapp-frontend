import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MacoPrimaryButton from "../components/MacoPrimaryButton";
import { API_URL } from "../lib/api";
import { saveToken } from "../lib/authStorage";

export default function AuthScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleLogin = async () => {
    setErrorMessage("");

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || "Login failed");
        return;
      }

      await saveToken(data.token);

      if (data.user.emailVerified) {
        router.replace("/goals");
      } else {
        router.replace({
          pathname: "/verify-email",
          params: {
            email: data.user.email,
          },
        });
      }
    } catch (error) {
      console.error("Login failed:", error);

      setErrorMessage(
        "Could not connect to the server. Please try again."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.wordmark}>maco</Text>

      <View style={styles.formSection}>
        <Text style={styles.title}>Welcome back!</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#3A3A3A"
          style={styles.input}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#3A3A3A"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
        />

        {errorMessage !== "" && (
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        )}

        <View style={styles.buttonWrapper}>
          <MacoPrimaryButton
            label="Login"
            onPress={handleLogin}
            width="58%"
            height={38}
            fontSize={15}
            borderRadius={8}
            shadowOffset={2}
          />
        </View>

        <Text style={styles.signupText}>
          New here?{" "}
          <Text
            style={styles.signupLink}
            onPress={() => router.push("/signup")}
          >
            Sign up
          </Text>
        </Text>
      </View>

      <Image
        source={require("../assets/images/maco-jump.jpeg")}
        style={styles.macoImage}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8EE",
    alignItems: "center",
    overflow: "hidden",
  },

  wordmark: {
    marginTop: 115,
    fontSize: 40,
    fontFamily: "Nunito_900Black",
    color: "#000000",
  },

  formSection: {
    width: "82%",
    marginTop: 42,

    // Keeps the form tappable above Maco's large image bounds.
    // Does not visually change the original layout.
    zIndex: 2,
  },

  title: {
    fontSize: 20,
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
    marginBottom: 14,
  },

  input: {
    width: "100%",
    height: 52,
    backgroundColor: "#FFF8EE",
    borderWidth: 2,
    borderColor: "#D9E8C3",
    borderRadius: 14,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: "#1F1F1F",
    marginBottom: 14,
  },

  errorText: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#A94442",
    textAlign: "center",
    marginTop: -4,
    marginBottom: 10,
  },

  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 2,
  },

  signupText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
  },

  signupLink: {
    fontFamily: "Nunito_400Regular",
    textDecorationLine: "underline",
  },

  macoImage: {
    position: "absolute",
    bottom: 18,
    width: "88%",
    height: 450,

    // Keeps the decorative image behind the form.
    zIndex: 0,
  },
});