import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MacoPrimaryButton from "../components/MacoPrimaryButton";
import { API_URL } from "../lib/api";
import { saveToken } from "../lib/authStorage";

const COLORS = {
  cream: "#FFF8EE",
  forest: "#2F785B",
  navy: "#123B45",
  muted: "#657A8B",
  pond: "#DFF7F6",
  input: "#FFFDF8",
  inputBorder: "#CFE6D7",
};

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
      setErrorMessage("Could not connect to the server. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ImageBackground
        source={require("../assets/images/pond-background-fade.png")}
        style={styles.pondSection}
        imageStyle={styles.pondBackgroundImage}
        resizeMode="cover"
        pointerEvents="none"
      >
        <LinearGradient
          pointerEvents="none"
          colors={[
            COLORS.cream,
            "rgba(255,248,238,0.96)",
            "rgba(255,248,238,0.82)",
            "rgba(255,248,238,0.58)",
            "rgba(255,248,238,0.28)",
            "rgba(255,248,238,0)",
          ]}
          locations={[0, 0.14, 0.3, 0.5, 0.72, 1]}
          style={styles.pondFade}
        />

        <Image
          source={require("../assets/images/maco-jump.jpeg")}
          style={styles.macoImage}
          resizeMode="contain"
        />
      </ImageBackground>

      <View style={styles.topSection}>
        <Text style={styles.wordmark}>maco</Text>
        <Text style={styles.kicker}>Good to see you again</Text>
        <Text style={styles.title}>Welcome back!</Text>
        <Text style={styles.subtitle}>Pick up right where you left off.</Text>

        <View style={styles.formSection}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="you@example.com"
            placeholderTextColor="#8CA09A"
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            placeholder="Your password"
            placeholderTextColor="#8CA09A"
            secureTextEntry
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />

          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}

          <View style={styles.buttonWrapper}>
            <MacoPrimaryButton
              label="Log In"
              onPress={handleLogin}
              width="100%"
              height={58}
              fontSize={18}
              borderRadius={29}
              shadowOffset={4}
            />
          </View>

          <Text style={styles.signupText}>
            New here?{" "}
            <Text
              style={styles.signupLink}
              onPress={() => router.push("/signup")}
            >
              Create an account
            </Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    overflow: "hidden",
  },

  topSection: {
    zIndex: 2,
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 24,
    backgroundColor: "transparent",
  },

  wordmark: {
    textAlign: "center",
    fontSize: 54,
    lineHeight: 60,
    letterSpacing: -2,
    fontFamily: "Nunito_900Black",
    color: COLORS.forest,
  },

  kicker: {
    marginTop: -2,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: COLORS.muted,
  },

  title: {
    marginTop: 26,
    fontSize: 30,
    lineHeight: 34,
    textAlign: "center",
    fontFamily: "Nunito_900Black",
    color: COLORS.navy,
  },

  subtitle: {
    marginTop: 5,
    textAlign: "center",
    fontSize: 15,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.muted,
  },

  formSection: {
    width: "100%",
    marginTop: 26,
  },

  label: {
    marginLeft: 4,
    marginBottom: 7,
    fontSize: 14,
    fontFamily: "Nunito_800ExtraBold",
    color: COLORS.navy,
  },

  input: {
    width: "100%",
    height: 56,
    backgroundColor: COLORS.input,
    borderWidth: 2,
    borderColor: COLORS.inputBorder,
    borderRadius: 18,
    paddingHorizontal: 16,
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.navy,
    marginBottom: 16,
  },

  errorText: {
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#A94442",
    textAlign: "center",
    marginTop: -3,
    marginBottom: 12,
  },

  buttonWrapper: {
    width: "100%",
    marginTop: 4,
  },

  signupText: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: COLORS.muted,
  },

  signupLink: {
    fontFamily: "Nunito_800ExtraBold",
    color: COLORS.forest,
    textDecorationLine: "underline",
  },

  pondSection: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "85%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: COLORS.pond,
    zIndex: 0,
  },

  pondBackgroundImage: {
    width: "100%",
    height: "100%",
  },

  pondFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 240,
    zIndex: 2,
  },

  macoImage: {
    width: "78%",
    maxWidth: 320,
    height: 250,
    marginBottom: -18,
  },
});
