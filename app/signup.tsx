import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MacoPrimaryButton from "../components/MacoPrimaryButton";
import { API_URL } from "../lib/api";
import { saveToken } from "../lib/authStorage";

const COLORS = {
  cream: "#FFF8EE",
  forest: "#2F785B",
  navy: "#123B45",
  muted: "#657A8B",
  border: "#D8E8D0",
  pond: "#DFF7F6",
};

export default function SignupScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) return null;

  const handleSignup = async () => {
    setErrorMessage("");
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setErrorMessage(data.error || "Sign up failed");
        return;
      }

      await saveToken(data.token);
      router.replace({
        pathname: "/verify-email",
        params: { email: data.user.email },
      });
    } catch (error) {
      console.error("Signup failed:", error);
      setErrorMessage("Could not connect to the server. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.forest} />
          </Pressable>

          <Text style={styles.wordmark}>maco</Text>
          <Text style={styles.brandTagline}>Small Steps. A Brighter You.</Text>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Your coding journey starts here.</Text>

          <View style={styles.formSection}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputShell}>
              <Ionicons name="mail-outline" size={20} color={COLORS.muted} />
              <TextInput
                placeholder="you@example.com"
                placeholderTextColor="#91A0AA"
                style={styles.input}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <Text style={styles.label}>Password</Text>
            <View style={styles.inputShell}>
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.muted} />
              <TextInput
                placeholder="Create a password"
                placeholderTextColor="#91A0AA"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <Pressable onPress={() => setShowPassword((value) => !value)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            {errorMessage !== "" && <Text style={styles.errorText}>{errorMessage}</Text>}

            <View style={styles.buttonWrapper}>
              <MacoPrimaryButton
                label="Create account"
                onPress={handleSignup}
                width="100%"
                height={58}
                fontSize={18}
                borderRadius={18}
                shadowOffset={4}
              />
            </View>

            <Text style={styles.loginText}>
              Already have an account?{" "}
              <Text style={styles.loginLink} onPress={() => router.push("/auth")}>
                Log in
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.pondSection}>
          <Image
            source={require("../assets/images/pond-background-fade.png")}
            style={styles.pondBackground}
            resizeMode="cover"
          />

          <LinearGradient
            pointerEvents="none"
            colors={[
              COLORS.cream,
              "rgba(255,248,238,0.95)",
              "rgba(255,248,238,0.72)",
              "rgba(255,248,238,0.35)",
              "rgba(255,248,238,0)",
            ]}
            locations={[0, 0.18, 0.42, 0.7, 1]}
            style={styles.pondFade}
          />

          <Image
            source={require("../assets/images/happy-maco-on-phone.png")}
            style={styles.macoImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.pond },
  scrollContent: { flexGrow: 1, backgroundColor: COLORS.pond },
  topSection: {
    backgroundColor: COLORS.cream,
    paddingHorizontal: 26,
    paddingTop: 14,
    paddingBottom: 28,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DDF4E6",
    zIndex: 3,
  },
  wordmark: {
    marginTop: 10,
    fontSize: 52,
    lineHeight: 58,
    letterSpacing: -1.5,
    fontFamily: "Nunito_900Black",
    color: COLORS.forest,
  },
  brandTagline: {
    marginTop: -3,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: COLORS.muted,
  },
  title: {
    marginTop: 30,
    fontSize: 30,
    lineHeight: 36,
    fontFamily: "Nunito_900Black",
    color: COLORS.navy,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.muted,
  },
  formSection: { width: "100%", maxWidth: 420, marginTop: 28 },
  label: {
    marginLeft: 3,
    marginBottom: 7,
    fontSize: 14,
    fontFamily: "Nunito_800ExtraBold",
    color: COLORS.navy,
  },
  inputShell: {
    width: "100%",
    height: 58,
    marginBottom: 18,
    paddingHorizontal: 16,
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 18,
    backgroundColor: "#FFFDF8",
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.navy,
  },
  errorText: {
    marginTop: -6,
    marginBottom: 14,
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#A94442",
    textAlign: "center",
  },
  buttonWrapper: { width: "100%", alignItems: "center", marginTop: 2 },
  loginText: {
    marginTop: 20,
    textAlign: "center",
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: COLORS.muted,
  },
  loginLink: {
    color: COLORS.forest,
    fontFamily: "Nunito_900Black",
    textDecorationLine: "underline",
  },
  pondSection: {
    flexGrow: 1,
    minHeight: 340,
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.pond,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  pondBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
  },
  pondFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 170,
    zIndex: 1,
  },
  macoImage: {
    position: "absolute",
    top: 105,
    width: "68%",
    maxWidth: 300,
    height: 235,
    zIndex: 2,
  },
});