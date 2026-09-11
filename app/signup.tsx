import {
    Nunito_400Regular,
    Nunito_700Bold,
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
  
  export default function SignupScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const [fontsLoaded] = useFonts({
      Nunito_400Regular,
      Nunito_700Bold,
      Nunito_900Black,
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    const handleSignup = async () => {
      setErrorMessage("");
  
      try {
        const response = await fetch(`${API_URL}/auth/signup`, {
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
          setErrorMessage(data.error || "Sign up failed");
          return;
        }
  
        await saveToken(data.token);
  
        console.log("Signup successful");
  
        router.push("/goals");
      } catch (error) {
        console.error("Signup failed:", error);
  
        setErrorMessage(
          "Could not connect to the server. Please try again."
        );
      }
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.wordmark}>maco</Text>
  
        <View style={styles.formSection}>
          <Text style={styles.title}>Create an account</Text>
  
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#7A7A7A"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
  
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#7A7A7A"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
  
          {errorMessage !== "" && (
            <Text style={styles.errorText}>{errorMessage}</Text>
          )}
  
          <View style={styles.buttonWrapper}>
            <MacoPrimaryButton
              label="Sign up"
              onPress={handleSignup}
              width="58%"
              height={38}
              fontSize={15}
              borderRadius={8}
              shadowOffset={2}
            />
          </View>
  
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text
              style={styles.loginLink}
              onPress={() => router.push("/auth")}
            >
              Log in
            </Text>
          </Text>
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
      marginTop: 150,
      fontSize: 48,
      fontFamily: "Nunito_900Black",
      color: "#000000",
      zIndex: 2,
    },
  
    formSection: {
      width: "82%",
      marginTop: 38,
      zIndex: 2,
    },
  
    title: {
      fontSize: 24,
      fontFamily: "Nunito_700Bold",
      color: "#1F1F1F",
      marginBottom: 10,
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
      fontFamily: "Nunito_400Regular",
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
      marginTop: -2,
    },
  
    loginText: {
      marginTop: 8,
      textAlign: "center",
      fontSize: 14,
      fontFamily: "Nunito_700Bold",
      color: "#1F1F1F",
    },
  
    loginLink: {
      fontFamily: "Nunito_400Regular",
      textDecorationLine: "underline",
    },
  
    macoImage: {
      position: "absolute",
      bottom: 35,
      width: "82%",
      height: 310,
      zIndex: 0,
    },
  });