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
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MacoPrimaryButton from "../components/MacoPrimaryButton";

export default function WelcomeScreen() {
  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black
  });
  
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topSection}>
        <Text style={styles.wordmark}>maco</Text>

        <Text style={styles.tagline}>
          Learn to code{"\n"}anywhere
        </Text>
      </View>

  <View style={styles.buttonWrapper}>
    <MacoPrimaryButton
      label="Start learning"
      onPress={() => router.push("/auth")}
    />
  </View>

      <Image
        source={require("../assets/images/maco-peek.png")}
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

  topSection: {
    alignItems: "center",
    marginTop: 60,
  },

  wordmark: {
    fontSize: 74,
    fontFamily: "Nunito_900Black",
    color: "#000000",
  },

  tagline: {
    marginTop: 50,
    fontSize: 32,
    lineHeight: 20,
    fontFamily: "Nunito_300Light",
    textAlign: "left",
    color: "#1F1F1F",
    paddingTop: 18
  },
  
  buttonWrapper: {
    position: "absolute",
    bottom: 235,
    width: "100%",
    alignItems: "center",
  },

  macoImage: {
    position: "absolute",
    bottom: -55,
    width: "120%",
    height: 274,
  },
});