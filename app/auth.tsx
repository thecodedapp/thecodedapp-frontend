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
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
  
  import MacoPrimaryButton from "../components/MacoPrimaryButton";
  
  export default function AuthScreen() {
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
          />
  
          <TextInput
            placeholder="Password"
            placeholderTextColor="#3A3A3A"
            secureTextEntry
            style={styles.input}
          />
  
          <View style={styles.buttonWrapper}>
            <MacoPrimaryButton
            label="Login"
            onPress={() => router.push("/goals")}
            width="58%"
            height={38}
            fontSize={15}
            borderRadius={8}
            shadowOffset={2}
            />
          </View>
  
          <Text style={styles.signupText}>
            New here?{" "}
            <Text style={styles.signupLink}>
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
    },
  });