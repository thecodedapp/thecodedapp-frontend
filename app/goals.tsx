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
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MacoPrimaryButton from "../components/MacoPrimaryButton";
import { deleteToken } from "../lib/authStorage";

const COLORS = {
  cream: "#FFF8EE",
  forest: "#2F785B",
  forestDark: "#236148",
  navy: "#123B45",
  muted: "#657A8B",
  mint: "#DDF4E6",
  pond: "#DFF7F6",
  card: "#EEF7DE",
  cardBorder: "#B8D986",
  selected: "#B8D986",
  selectedBorder: "#7E9B58",
  white: "#FFFFFF",
};

const goals = [
  {
    label: "I'm new to coding",
    icon: "leaf-outline" as const,
  },
  {
    label: "I want to build things",
    icon: "hammer-outline" as const,
  },
  {
    label: "I want coding skills for work",
    icon: "briefcase-outline" as const,
  },
  {
    label: "I'm preparing for interviews",
    icon: "code-slash-outline" as const,
  },
];

export default function GoalsScreen() {
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  if (!fontsLoaded) return null;

  const toggleGoal = (goal: string) => {
    setSelectedGoals((currentGoals) =>
      currentGoals.includes(goal)
        ? currentGoals.filter((item) => item !== goal)
        : [...currentGoals, goal]
    );
  };

  const handleLogout = async () => {
    await deleteToken();
    router.replace("/");
  };

  const canContinue = selectedGoals.length > 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <Text style={styles.wordmark}>maco</Text>
          <Text style={styles.brandTagline}>Small Steps. A Brighter You.</Text>

          <Text style={styles.title}>What brings you here?</Text>
          <Text style={styles.subtitle}>Choose as many as you like.</Text>

          <View style={styles.goalList}>
            {goals.map((goal) => {
              const isSelected = selectedGoals.includes(goal.label);

              return (
                <Pressable
                  key={goal.label}
                  onPress={() => toggleGoal(goal.label)}
                  style={({ pressed }) => [
                    styles.goalCard,
                    isSelected && styles.goalCardSelected,
                    pressed && styles.goalCardPressed,
                  ]}
                >
                  <View
                    style={[
                      styles.iconBubble,
                      isSelected && styles.iconBubbleSelected,
                    ]}
                  >
                    <Ionicons
                      name={goal.icon}
                      size={22}
                      color={isSelected ? COLORS.white : COLORS.forest}
                    />
                  </View>

                  <Text
                    style={[
                      styles.goalText,
                      isSelected && styles.goalTextSelected,
                    ]}
                  >
                    {goal.label}
                  </Text>

                  <View
                    style={[
                      styles.checkCircle,
                      isSelected && styles.checkCircleSelected,
                    ]}
                  >
                    {isSelected && (
                      <Ionicons name="checkmark" size={18} color={COLORS.white} />
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.buttonWrapper}>
            <View style={!canContinue ? styles.disabledButton : undefined}>
              <MacoPrimaryButton
                label="Continue"
                onPress={() => {
                  if (canContinue) {
                    router.replace("/course-map");
                  }
                }}
                width="100%"
                height={60}
                fontSize={19}
                borderRadius={18}
                shadowOffset={4}
              />
            </View>
          </View>

          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Log out</Text>
          </Pressable>
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
              "rgba(255,248,238,0.94)",
              "rgba(255,248,238,0.68)",
              "rgba(255,248,238,0.28)",
              "rgba(255,248,238,0)",
            ]}
            locations={[0, 0.2, 0.46, 0.73, 1]}
            style={styles.pondFade}
          />

          <Image
            source={require("../assets/images/maco-thinking.png")}
            style={styles.macoImage}
            resizeMode="contain"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: COLORS.pond,
  },
  topSection: {
    backgroundColor: COLORS.cream,
    paddingHorizontal: 26,
    paddingTop: 16,
    paddingBottom: 30,
    alignItems: "center",
  },
  wordmark: {
    fontSize: 54,
    lineHeight: 60,
    letterSpacing: -1.7,
    fontFamily: "Nunito_900Black",
    color: COLORS.forest,
  },
  brandTagline: {
    marginTop: -4,
    fontSize: 13,
    fontFamily: "Nunito_700Bold",
    color: COLORS.muted,
  },
  title: {
    marginTop: 30,
    fontSize: 31,
    lineHeight: 37,
    fontFamily: "Nunito_900Black",
    color: COLORS.navy,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 7,
    fontSize: 16,
    fontFamily: "Nunito_600SemiBold",
    color: COLORS.muted,
  },
  goalList: {
    width: "100%",
    maxWidth: 430,
    marginTop: 28,
    gap: 13,
  },
  goalCard: {
    minHeight: 76,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.card,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },
  goalCardSelected: {
    backgroundColor: COLORS.selected,
    borderColor: COLORS.selectedBorder,
  },
  goalCardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.94,
  },
  iconBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleSelected: {
    backgroundColor: COLORS.forest,
  },
  goalText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 21,
    fontFamily: "Nunito_700Bold",
    color: COLORS.navy,
  },
  goalTextSelected: {
    color: COLORS.forestDark,
    fontFamily: "Nunito_800ExtraBold",
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#A8BF87",
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    borderColor: COLORS.forest,
    backgroundColor: COLORS.forest,
  },
  buttonWrapper: {
    width: "100%",
    maxWidth: 430,
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.45,
  },
  logoutButton: {
    marginTop: 18,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Nunito_700Bold",
    color: COLORS.muted,
    textDecorationLine: "underline",
  },
  pondSection: {
    flexGrow: 1,
    minHeight: 300,
    position: "relative",
    overflow: "hidden",
    backgroundColor: COLORS.pond,
    alignItems: "center",
  },
  pondBackground: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    height: "100%",
  },
  pondFade: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 165,
    zIndex: 1,
  },
  macoImage: {
    position: "absolute",
    top: -33,
    width: "62%",
    maxWidth: 285,
    height: 220,
    zIndex: 10,
  },
});