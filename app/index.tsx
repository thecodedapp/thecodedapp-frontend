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
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { API_URL } from "../lib/api";
import { deleteToken, getToken } from "../lib/authStorage";

const COLORS = {
  cream: "#FFF8EE",
  forest: "#2F785B",
  forestDark: "#236148",
  navy: "#123B45",
  muted: "#657A8B",
  mint: "#DDF4E6",
  pond: "#DFF7F6",
  white: "#FFFFFF",
  pink: "#F78BA7",
  gold: "#F4B84C",
};

export default function WelcomeScreen() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [fontsLoaded] = useFonts({
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await getToken();

        if (!token) {
          setCheckingAuth(false);
          return;
        }

        const response = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();

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

          return;
        }

        await deleteToken();
      } catch (error) {
        console.error("Failed to verify auth:", error);
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  if (!fontsLoaded || checkingAuth) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Text style={styles.wordmark}>maco</Text>
          <Text style={styles.brandTagline}>Small Steps. A Brighter You.</Text>

          <Text style={styles.heroTitle}>
            Learn to code{"\n"}from anywhere.
          </Text>
          <Text style={styles.heroSubtitle}>Tiny lessons. Big skills.</Text>

          <View style={styles.benefitsRow}>
            <Benefit
              icon="leaf"
              iconColor={COLORS.forest}
              label={"Build\nreal skills"}
            />
            <Benefit
              icon="heart"
              iconColor={COLORS.pink}
              label={"Learn\nat your pace"}
            />
            <Benefit
              icon="star"
              iconColor={COLORS.gold}
              label={"A brighter\nyou"}
            />
          </View>
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

function Benefit({
  icon,
  iconColor,
  label,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
}) {
  return (
    <View style={styles.benefitItem}>
      <View style={styles.benefitIconWrap}>
        <Ionicons name={icon} size={27} color={iconColor} />
      </View>
      <Text style={styles.benefitLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollView: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },

  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.cream,
  },

  topSection: {
    alignItems: "center",
    marginTop: 60,
  },

  wordmark: {
    fontFamily: "Nunito_900Black",
    fontSize: 64,
    lineHeight: 70,
    letterSpacing: -2,
    color: COLORS.forest,
  },

  brandTagline: {
    marginTop: -2,
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: COLORS.muted,
  },

  heroTitle: {
    marginTop: 32,
    fontFamily: "Nunito_900Black",
    fontSize: 37,
    lineHeight: 40,
    letterSpacing: -1,
    textAlign: "center",
    color: COLORS.navy,
  },

  tagline: {
    marginTop: 50,
    fontSize: 32,
    lineHeight: 20,
    fontFamily: "Nunito_300Light",
    textAlign: "left",
    color: "#1F1F1F",
    paddingTop: 18,
  },

  buttonWrapper: {
    position: "absolute",
    bottom: 235,
    width: "100%",
    minHeight: 64,
    paddingHorizontal: 20,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.forest,
    backgroundColor: "rgba(255,248,238,0.96)",
    alignItems: "center",
    justifyContent: "center",
  },

  secondaryButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    textAlign: "center",
    color: COLORS.forest,
  },

  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.985 }],
  },

  bottomMessage: {
    position: "absolute",
    bottom: -55,
    width: "120%",
    height: 274,
  },
});
