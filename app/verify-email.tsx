import {
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MacoPrimaryButton from "../components/MacoPrimaryButton";
import { API_URL } from "../lib/api";

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams();

  const email =
    typeof params.email === "string"
      ? params.email
      : "";

  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isResending, setIsResending] = useState(false);

  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_900Black,
  });

  if (!fontsLoaded) {
    return null;
  }

  const handleVerify = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (code.length !== 6) {
      setErrorMessage("Enter the 6-digit code from your email");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error || "That code didn't work. Try again."
        );
        return;
      }

      router.replace("/goals");
    } catch (error) {
      console.error("Email verification failed:", error);

      setErrorMessage(
        "Could not connect to the server. Please try again."
      );
    }
  };

  const handleResend = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    setIsResending(true);

    try {
      const response = await fetch(
        `${API_URL}/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(
          data.error || "Could not resend verification code"
        );
        return;
      }

      setCode("");
      setSuccessMessage("A new code was sent!");
    } catch (error) {
      console.error("Resend failed:", error);

      setErrorMessage(
        "Could not connect to the server. Please try again."
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.wordmark}>maco</Text>

      <View style={styles.content}>
        <Text style={styles.title}>Check your email!</Text>

        <Text style={styles.subtitle}>
          We sent a 6-digit code to
        </Text>

        <Text style={styles.email}>
          {email || "your email"}
        </Text>

        <TextInput
          style={styles.codeInput}
          placeholder="000000"
          placeholderTextColor="#A3A3A3"
          keyboardType="number-pad"
          maxLength={6}
          value={code}
          onChangeText={(value) => {
            const numbersOnly = value.replace(/\D/g, "");
            setCode(numbersOnly);
          }}
          textAlign="center"
        />

        {errorMessage !== "" && (
          <Text style={styles.errorText}>
            {errorMessage}
          </Text>
        )}

        {successMessage !== "" && (
          <Text style={styles.successText}>
            {successMessage}
          </Text>
        )}

        <View style={styles.buttonWrapper}>
          <MacoPrimaryButton
            label="Verify"
            onPress={handleVerify}
            width="58%"
            height={38}
            fontSize={15}
            borderRadius={8}
            shadowOffset={2}
          />
        </View>

        <Text style={styles.helperText}>
          The code expires in 10 minutes
        </Text>

        <View style={styles.resendRow}>
          <Text style={styles.resendQuestion}>
            {"Didn't get it? "}
          </Text>

          <Pressable
            onPress={handleResend}
            disabled={isResending}
          >
            <Text style={styles.resendLink}>
              {isResending ? "Sending..." : "Resend code"}
            </Text>
          </Pressable>
        </View>
      </View>

      <Image
        source={require("../assets/images/happy-maco-on-phone.png")}
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
    marginTop: 120,
    fontSize: 48,
    fontFamily: "Nunito_900Black",
    color: "#000000",
    zIndex: 2,
  },

  content: {
    width: "82%",
    marginTop: 45,
    alignItems: "center",
    zIndex: 2,
  },

  title: {
    fontSize: 24,
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: "Nunito_400Regular",
    color: "#1F1F1F",
  },

  email: {
    marginTop: 2,
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
  },

  codeInput: {
    width: "75%",
    height: 62,
    marginTop: 28,
    backgroundColor: "#FFF8EE",
    borderWidth: 2,
    borderColor: "#D9E8C3",
    borderRadius: 14,
    fontSize: 28,
    letterSpacing: 10,
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
    paddingHorizontal: 12,
  },

  errorText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#A94442",
    textAlign: "center",
  },

  successText: {
    marginTop: 10,
    fontSize: 13,
    fontFamily: "Nunito_600SemiBold",
    color: "#587344",
    textAlign: "center",
  },

  buttonWrapper: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },

  helperText: {
    marginTop: 12,
    fontSize: 12,
    fontFamily: "Nunito_600SemiBold",
    color: "#6A6A6A",
  },

  resendRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  resendQuestion: {
    fontSize: 13,
    fontFamily: "Nunito_400Regular",
    color: "#1F1F1F",
  },

  resendLink: {
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
    textDecorationLine: "underline",
  },

  macoImage: {
    position: "absolute",
    bottom: 25,
    width: "82%",
    height: 300,
    zIndex: 0,
  },
});