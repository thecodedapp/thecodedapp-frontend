import {
  Nunito_300Light,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
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

        <View style={styles.pondSection}>
          <Image
            source={require("../assets/images/pond-background-fade.png")}
            style={styles.pondBackground}
            resizeMode="cover"
          />

          <View style={styles.pondGlow} />

          <Image
            source={require("../assets/images/happy-maco-on-phone.png")}
            style={styles.macoHero}
            resizeMode="contain"
          />

          <View style={styles.actions}>
            <Pressable
              onPress={() => router.push("/signup")}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward" size={25} color={COLORS.white} />
            </Pressable>

            <Pressable
              onPress={() => router.push("/auth")}
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
            >
              <Text style={styles.secondaryButtonText}>
                I Already Have an Account
              </Text>
            </Pressable>
          </View>

          <Text style={styles.bottomMessage}>
            Knowledge grows happier here. 💚
          </Text>
        </View>
      </ScrollView>
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
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 18,
    backgroundColor: COLORS.cream,
    zIndex: 2,
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

  heroSubtitle: {
    marginTop: 8,
    fontFamily: "Nunito_700Bold",
    fontSize: 20,
    color: COLORS.muted,
  },

  benefitsRow: {
    width: "100%",
    maxWidth: 390,
    marginTop: 26,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
  },

  benefitItem: {
    width: "30%",
    alignItems: "center",
  },

  benefitIconWrap: {
    width: 46,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  benefitLabel: {
    marginTop: 2,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    lineHeight: 16,
    textAlign: "center",
    color: COLORS.muted,
  },

  pondSection: {
    flex: 1,
    minHeight: 470,
    position: "relative",
    alignItems: "center",
    justifyContent: "flex-end",
    overflow: "hidden",
    backgroundColor: COLORS.pond,
  },

  pondBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },

  pondGlow: {
    position: "absolute",
    top: -80,
    left: -40,
    right: -40,
    height: 170,
    borderRadius: 100,
    backgroundColor: "rgba(255,248,238,0.72)",
  },

  macoHero: {
    position: "absolute",
    top: 6,
    width: "72%",
    maxWidth: 310,
    height: 235,
  },

  actions: {
    width: "100%",
    paddingHorizontal: 28,
    paddingBottom: 56,
    gap: 14,
    zIndex: 3,
  },

  primaryButton: {
    width: "100%",
    height: 68,
    paddingHorizontal: 28,
    borderRadius: 34,
    backgroundColor: COLORS.forest,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    shadowColor: COLORS.forestDark,
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    elevation: 5,
  },

  primaryButtonText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 22,
    color: COLORS.white,
  },

  secondaryButton: {
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
    bottom: 16,
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: "rgba(18,59,69,0.72)",
  },
});