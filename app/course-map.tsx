import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";

import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { deleteToken } from "../lib/authStorage";
import { getLessonByNumber } from "../lib/lessonCatalog";
import { getLessonProgress } from "../lib/lessonProgress";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const PAGE_HEIGHT = 2600;

const COLORS = {
  cream: "#FFF8EE",
  green: "#2F785B",
  darkGreen: "#285E4A",
  navy: "#183044",
  muted: "#63778A",
  white: "#FFFFFF",
};

const ASSETS = {
  pondFade: require("../assets/images/pond-background-fade.png"),
  pondRepeatable: require("../assets/images/pond-background-repeatable.png"),
  lilyOpenLight: require("../assets/images/open-light-green-lily-pad-1.png"),
  lilyOpenishDark: require("../assets/images/dark-green-openish-lily-pad.png"),
  lilySlightlyClosedMedium: require("../assets/images/medium-green-slightly-closed-lily-pad.png"),
  lilySlightlyClosedMedium2: require("../assets/images/medium-green-slightly-closed-lily-pad-2.png"),
  lilySlightlyClosedDark: require("../assets/images/dark-green-slightly-closed-lily-pad.png"),
  lilyClosedDark: require("../assets/images/dark-green-closed-lily-pad.png"),
};

type Lesson = {
  id: number;
  title?: string;
  image: ImageSourcePropType;
  locked?: boolean;
  completed?: boolean;
  current?: boolean;
  side: "left" | "right";
  placeholder?: boolean;
  scale?: number;
};

const lessons: Lesson[] = [
  {
    id: 1,
    title: "What is\nCode?",
    image: ASSETS.lilyOpenLight,
    side: "left",
  },
  {
    id: 2,
    title: "How Computers\nThink",
    image: ASSETS.lilyOpenishDark,
    side: "right",
  },
  {
    id: 3,
    title: "What Can You\nBuild?",
    image: ASSETS.lilySlightlyClosedMedium,
    side: "left",
  },
  {
    id: 4,
    title: "Programming\nLanguages",
    image: ASSETS.lilySlightlyClosedDark,
    side: "right",
  },
  {
    id: 5,
    title: "Build a Project",
    image: ASSETS.lilyClosedDark,
    side: "left",
  },
  {
    id: 6,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
  },
  {
    id: 7,
    image: ASSETS.lilyClosedDark,
    locked: true,
    side: "left",
    placeholder: true,
  },
  {
    id: 8,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
  },
  {
    id: 9,
    image: ASSETS.lilyClosedDark,
    locked: true,
    side: "left",
    placeholder: true,
  },
  {
    id: 10,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
  },
  {
    id: 11,
    image: ASSETS.lilyClosedDark,
    locked: true,
    side: "left",
    placeholder: true,
  },
  {
    id: 12,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
  },
  {
    id: 13,
    image: ASSETS.lilyClosedDark,
    locked: true,
    side: "left",
    placeholder: true,
  },
  {
    id: 14,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
  },
  {
    id: 15,
    image: ASSETS.lilyClosedDark,
    locked: true,
    side: "left",
    placeholder: true,
    scale: 0.95,
  },
  {
    id: 16,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
    scale: 0.9,
  },
  {
    id: 17,
    image: ASSETS.lilyClosedDark,
    locked: true,
    side: "left",
    placeholder: true,
    scale: 0.84,
  },
  {
    id: 18,
    image: ASSETS.lilySlightlyClosedDark,
    locked: true,
    side: "right",
    placeholder: true,
    scale: 0.76,
  },
];

function PondBackground() {
  return (
    <View pointerEvents="none" style={styles.backgroundLayer}>
      <Image source={ASSETS.pondFade} style={styles.pondTop} resizeMode="cover" />
      <Image
        source={ASSETS.pondRepeatable}
        style={[styles.pondRepeat, { top: 850 }]}
        resizeMode="cover"
      />
      <Image
        source={ASSETS.pondRepeatable}
        style={[styles.pondRepeat, { top: 1500 }]}
        resizeMode="cover"
      />
      <Image
        source={ASSETS.pondRepeatable}
        style={[styles.pondRepeat, { top: 2150 }]}
        resizeMode="cover"
      />
    </View>
  );
}

function BottomFade() {
  return (
    <LinearGradient
      pointerEvents="none"
      colors={[
        "rgba(255,248,238,0)",
        "rgba(255,248,238,0.18)",
        "rgba(255,248,238,0.5)",
        "rgba(255,248,238,0.82)",
        "#FFF8EE",
      ]}
      locations={[0, 0.25, 0.5, 0.76, 1]}
      style={styles.bottomFade}
    />
  );
}

function Header({ onLogout }: { onLogout: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Log out"
        onPress={onLogout}
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.logoutButtonPressed,
        ]}
      >
        <Ionicons name="log-out-outline" size={17} color={COLORS.green} />
        <Text style={styles.logoutText}>Log out</Text>
      </Pressable>
      <Text style={styles.logo}>maco</Text>
      <View style={styles.headerRight}>
        <View style={styles.streak}>
          <Text style={styles.flame}>🔥</Text>
          <Text style={styles.streakNumber}>3</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>👩🏻</Text>
        </View>
      </View>
    </View>
  );
}

function CourseBanner() {
  return (
    <Pressable
      style={({ pressed }) => [styles.courseBanner, pressed && styles.pressed]}
    >
      <View style={styles.courseIcon}>
        <Text style={styles.laptopEmoji}>💻</Text>
      </View>
      <View style={styles.courseBannerText}>
        <Text style={styles.courseTitle}>Learn to Code</Text>
        <Text style={styles.courseSubtitle}>
          Build your future, one step at a time.
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={23} color="#2994C9" />
    </Pressable>
  );
}

function LessonLabel({
  title,
  locked,
  completed,
  current,
}: {
  title: string;
  locked?: boolean;
  completed?: boolean;
  current?: boolean;
}) {
  return (
    <View
      style={[
        styles.lessonLabel,
        locked && styles.lockedLabel,
        completed && styles.completedLabel,
        current && styles.currentLabel,
      ]}
    >
      {current && <Text style={styles.currentEyebrow}>UP NEXT</Text>}
      <Text
        style={[
          styles.lessonLabelText,
          locked && styles.lockedLabelText,
          completed && styles.completedLabelText,
          current && styles.currentLabelText,
        ]}
      >
        {title}
      </Text>
    </View>
  );
}

function LessonNode({ lesson }: { lesson: Lesson }) {
  const staggerOffset = lesson.side === "left" ? -24 : 24;
  const scale = lesson.scale ?? 1;
  const lessonDefinition = getLessonByNumber(lesson.id);

  return (
    <Pressable
      disabled={lesson.locked || !lessonDefinition}
      style={({ pressed }) => [
        styles.lessonRow,
        lesson.current && styles.currentLessonRow,
        pressed && !lesson.locked && lessonDefinition && styles.lessonPressed,
      ]}
      onPress={() => {
        if (lessonDefinition) {
          router.push(`/lesson/${lessonDefinition.id}`);
        }
      }}
    >
      <View
        style={[
          styles.padOnlyPosition,
          {
            transform: [{ translateX: staggerOffset }, { scale }],
          },
        ]}
      >
        <View style={styles.padContainer}>
          <Image
            source={lesson.image}
            style={[
              styles.lilyPad,
              lesson.placeholder && styles.placeholderPad,
              lesson.current && styles.currentLilyPad,
            ]}
            resizeMode="contain"
          />

          <View style={styles.padOverlay}>
            {lesson.locked ? (
              <Ionicons
                name="lock-closed"
                size={lesson.placeholder ? 23 : 27}
                color={
                  lesson.placeholder
                    ? "rgba(255,255,255,0.68)"
                    : "#FFFFFF"
                }
              />
            ) : lesson.completed ? (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark" size={22} color={COLORS.green} />
              </View>
            ) : lesson.current ? (
              <View style={styles.currentBadge}>
                <Text style={styles.currentBadgeText}>{lesson.id}</Text>
              </View>
            ) : (
              <Text style={styles.padNumber}>{lesson.id}</Text>
            )}
          </View>
        </View>
      </View>

      {lesson.title && (
        <View
          style={[
            styles.labelPosition,
            { marginLeft: 74 + staggerOffset },
          ]}
        >
          <LessonLabel
            title={lesson.title}
            locked={lesson.locked}
            completed={lesson.completed}
            current={lesson.current}
          />
        </View>
      )}
    </Pressable>
  );
}

function CoursePath({
  highestUnlockedLesson,
  completedLessons,
}: {
  highestUnlockedLesson: number;
  completedLessons: number[];
}) {
  return (
    <View style={styles.path}>
      {lessons.map((lesson) => {
        const lessonExists = Boolean(getLessonByNumber(lesson.id));
        const locked =
          lesson.placeholder ||
          lesson.id > highestUnlockedLesson ||
          !lessonExists;
        const completed = completedLessons.includes(lesson.id);
        const current =
          !locked && !completed && lesson.id === highestUnlockedLesson;

        return (
          <LessonNode
            key={lesson.id}
            lesson={{ ...lesson, locked, completed, current }}
          />
        );
      })}
    </View>
  );
}

export default function CourseMap() {
  const [highestUnlockedLesson, setHighestUnlockedLesson] = useState(1);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadProgress = async () => {
        const progress = await getLessonProgress();

        if (isActive) {
          setHighestUnlockedLesson(progress.highestUnlockedLesson);
          setCompletedLessons(progress.completedLessons);
        }
      };

      void loadProgress();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const handleLogout = async () => {
    await deleteToken();
    router.replace("/auth");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.screen}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <PondBackground />
          <Header onLogout={() => void handleLogout()} />
          <CourseBanner />
          <CoursePath
            highestUnlockedLesson={highestUnlockedLesson}
            completedLessons={completedLessons}
          />
          <BottomFade />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  screen: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    minHeight: PAGE_HEIGHT,
    paddingBottom: 0,
    position: "relative",
  },
  backgroundLayer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: PAGE_HEIGHT,
    overflow: "hidden",
  },
  pondTop: {
    position: "absolute",
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: 860,
  },
  pondRepeat: {
    position: "absolute",
    left: 0,
    width: SCREEN_WIDTH,
    height: 900,
  },
  bottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: PAGE_HEIGHT - 650,
    height: 650,
    zIndex: 999,
    elevation: 999,
  },
  header: {
    height: 64,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutButton: {
    width: 82,
    minHeight: 34,
    paddingHorizontal: 8,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.74)",
  },
  logoutButtonPressed: {
    opacity: 0.72,
  },
  logoutText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    color: COLORS.green,
  },
  logo: {
    fontFamily: "Nunito_900Black",
    fontSize: 30,
    color: COLORS.green,
    letterSpacing: -1,
  },
  headerRight: {
    width: 82,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 10,
  },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  flame: {
    fontSize: 21,
  },
  streakNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 16,
    color: "#FF785B",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F6C8B8",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: 21,
  },
  courseBanner: {
    marginHorizontal: 18,
    marginTop: 2,
    height: 78,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.94)",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#1C5A52",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    elevation: 4,
  },
  pressed: {
    transform: [{ scale: 0.985 }],
  },
  courseIcon: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  laptopEmoji: {
    fontSize: 37,
  },
  courseBannerText: {
    flex: 1,
  },
  courseTitle: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 17,
    color: COLORS.navy,
  },
  courseSubtitle: {
    marginTop: 2,
    fontFamily: "Nunito_400Regular",
    fontSize: 12,
    color: COLORS.muted,
  },
  path: {
    marginTop: 6,
    paddingBottom: 0,
  },
  lessonRow: {
    height: 132,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  currentLessonRow: {
    zIndex: 2,
  },
  lessonPressed: {
    transform: [{ scale: 0.97 }],
  },
  padOnlyPosition: {
    alignItems: "center",
    justifyContent: "center",
  },
  padContainer: {
    width: 147,
    height: 128,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  lilyPad: {
    width: 147,
    height: 128,
  },
  currentLilyPad: {
    transform: [{ scale: 1.05 }],
  },
  placeholderPad: {
    opacity: 0.9,
  },
  padOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 11,
  },
  padNumber: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 30,
    color: "#FFFFFF",
    textShadowColor: "rgba(31, 88, 62, 0.28)",
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 2,
  },
  currentBadge: {
    minWidth: 48,
    height: 48,
    paddingHorizontal: 10,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 3,
    borderColor: COLORS.green,
  },
  currentBadgeText: {
    fontFamily: "Nunito_900Black",
    fontSize: 21,
    color: COLORS.green,
  },
  completedBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    borderWidth: 2,
    borderColor: "rgba(47,120,91,0.18)",
  },
  labelPosition: {
    position: "absolute",
    left: "50%",
  },
  lessonLabel: {
    minWidth: 98,
    maxWidth: 116,
    paddingVertical: 8,
    paddingHorizontal: 11,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 16,
    shadowColor: "#236A72",
    shadowOpacity: 0.08,
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  lessonLabelText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 12,
    lineHeight: 15,
    color: COLORS.navy,
  },
  lockedLabel: {
    opacity: 0.85,
  },
  lockedLabelText: {
    color: "#566F72",
  },
  completedLabel: {
    borderWidth: 1.5,
    borderColor: "rgba(47,120,91,0.2)",
  },
  completedLabelText: {
    color: COLORS.green,
  },
  currentLabel: {
    borderWidth: 2,
    borderColor: COLORS.green,
    backgroundColor: "rgba(255,253,248,0.98)",
  },
  currentEyebrow: {
    marginBottom: 2,
    fontFamily: "Nunito_900Black",
    fontSize: 8,
    letterSpacing: 0.8,
    color: COLORS.green,
  },
  currentLabelText: {
    fontFamily: "Nunito_800ExtraBold",
    color: COLORS.navy,
  },
});