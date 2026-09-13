import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LilyPad from "../../components/LilyPad";

const lessons = [
  { title: "What is Programming?", locked: false },
  { title: "Variables and Data", locked: true },
  { title: "Your First Program", locked: true },
  { title: "Conditionals", locked: true },
  { title: "Build a Project", locked: true },
];

function Reeds({ side }: { side: "left" | "right" }) {
  return (
    <View style={[styles.reeds, side === "left" ? styles.reedsLeft : styles.reedsRight]}>
      <View style={[styles.reedLeaf, styles.reedLeafOne]} />
      <View style={[styles.reedLeaf, styles.reedLeafTwo]} />
      <View style={[styles.reedLeaf, styles.reedLeafThree]} />
      <View style={styles.cattailStem} />
      <View style={styles.cattail} />
    </View>
  );
}

export default function HomeScreen() {
  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_900Black,
  });

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.wordmark}>maco</Text>
        <View style={styles.headerRight}>
          <Text style={styles.streak}>🔥 3</Text>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>👩🏻</Text>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.courseCard}>
          <View style={styles.courseIconWrap}>
            <Text style={styles.courseIcon}>💻</Text>
          </View>
          <View style={styles.courseCopy}>
            <Text style={styles.courseTitle}>Learn to Code</Text>
            <Text style={styles.courseSubtitle}>
              Build your future, one step at a time.
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>

        <View style={styles.pond}>
          <View style={styles.pondGlowTop} />
          <View style={styles.pondGlowBottom} />
          <Reeds side="left" />
          <Reeds side="right" />

          <View style={[styles.rock, styles.rockOne]} />
          <View style={[styles.rock, styles.rockTwo]} />
          <View style={[styles.rock, styles.rockThree]} />
          <View style={[styles.smallPad, styles.smallPadLeft]} />
          <View style={[styles.smallPad, styles.smallPadRight]}>
            <Text style={styles.lotus}>🪷</Text>
          </View>

          {lessons.map((lesson, index) => {
            const leftAligned = index % 2 === 0;

            return (
              <View key={lesson.title} style={styles.lessonSection}>
                {index > 0 && (
                  <View
                    style={[
                      styles.pathDots,
                      leftAligned ? styles.pathDotsLeft : styles.pathDotsRight,
                    ]}
                  >
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                    <View style={styles.dot} />
                  </View>
                )}

                <View
                  style={[
                    styles.lessonRow,
                    leftAligned ? styles.rowLeft : styles.rowRight,
                  ]}
                >
                  <View style={styles.padScene}>
                    <View style={styles.rippleOuter} />
                    <View style={styles.rippleInner} />
                    <LilyPad
                      number={index + 1}
                      locked={lesson.locked}
                      size={index === 0 ? 102 : 92}
                    />
                  </View>

                  <View
                    style={[
                      styles.lessonLabel,
                      !leftAligned && styles.lessonLabelRight,
                    ]}
                  >
                    <Text style={styles.lessonText}>{lesson.title}</Text>
                  </View>
                </View>
              </View>
            );
          })}

          <View style={styles.macoArea}>
            <View style={styles.macoPadShadow} />
            <View style={styles.macoPad} />
            <Image
              source={require("../../assets/images/maco-peek.png")}
              style={styles.maco}
              resizeMode="contain"
            />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>You got this! 💚</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9EF",
  },
  header: {
    height: 62,
    paddingHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: {
    fontFamily: "Nunito_900Black",
    fontSize: 34,
    color: "#2F7A58",
    letterSpacing: 0.4,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  streak: {
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    color: "#E97B36",
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F7DDE5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F1C8D5",
  },
  avatarEmoji: {
    fontSize: 18,
  },
  scroll: {
    paddingHorizontal: 14,
    paddingBottom: 22,
  },
  courseCard: {
    minHeight: 78,
    backgroundColor: "#FFFDF9",
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#D8E8DD",
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#8BA99A",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  courseIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EAF5EC",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  courseIcon: {
    fontSize: 29,
  },
  courseCopy: {
    flex: 1,
  },
  courseTitle: {
    fontFamily: "Nunito_700Bold",
    fontSize: 17,
    color: "#20383C",
  },
  courseSubtitle: {
    fontFamily: "Nunito_600SemiBold",
    fontSize: 12,
    color: "#607779",
    marginTop: 2,
  },
  chevron: {
    fontFamily: "Nunito_700Bold",
    fontSize: 30,
    color: "#4093BA",
    marginLeft: 8,
  },
  pond: {
    minHeight: 955,
    borderRadius: 28,
    backgroundColor: "#AEEEF1",
    overflow: "hidden",
    paddingTop: 22,
    paddingBottom: 18,
    borderWidth: 1,
    borderColor: "#9ADFE5",
  },
  pondGlowTop: {
    position: "absolute",
    width: 280,
    height: 190,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.18)",
    top: -70,
    left: 70,
    transform: [{ rotate: "-10deg" }],
  },
  pondGlowBottom: {
    position: "absolute",
    width: 260,
    height: 170,
    borderRadius: 130,
    backgroundColor: "rgba(255,255,255,0.12)",
    bottom: 40,
    right: -60,
  },
  lessonSection: {
    position: "relative",
    zIndex: 2,
  },
  lessonRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
    paddingHorizontal: 34,
  },
  rowLeft: {
    justifyContent: "flex-start",
  },
  rowRight: {
    justifyContent: "flex-end",
    flexDirection: "row-reverse",
  },
  padScene: {
    width: 122,
    height: 94,
    alignItems: "center",
    justifyContent: "center",
  },
  rippleOuter: {
    position: "absolute",
    width: 118,
    height: 62,
    borderRadius: 59,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.62)",
    bottom: 10,
  },
  rippleInner: {
    position: "absolute",
    width: 102,
    height: 52,
    borderRadius: 51,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.48)",
    bottom: 15,
  },
  lessonLabel: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 17,
    paddingVertical: 9,
    paddingHorizontal: 13,
    maxWidth: 150,
    marginLeft: 6,
    shadowColor: "#6FAAB0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 1,
  },
  lessonLabelRight: {
    marginLeft: 0,
    marginRight: 6,
  },
  lessonText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    lineHeight: 17,
    color: "#244247",
  },
  pathDots: {
    height: 36,
    width: 20,
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -13,
    marginBottom: -2,
  },
  pathDotsLeft: {
    marginLeft: 84,
  },
  pathDotsRight: {
    alignSelf: "flex-end",
    marginRight: 84,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.82)",
  },
  reeds: {
    position: "absolute",
    width: 70,
    height: 160,
    zIndex: 1,
  },
  reedsLeft: {
    left: -8,
    top: 28,
  },
  reedsRight: {
    right: -8,
    bottom: 160,
    transform: [{ scaleX: -1 }],
  },
  reedLeaf: {
    position: "absolute",
    bottom: 0,
    width: 17,
    backgroundColor: "#5EAA65",
    borderRadius: 20,
    transformOrigin: "bottom",
  },
  reedLeafOne: {
    height: 105,
    left: 12,
    transform: [{ rotate: "-18deg" }],
  },
  reedLeafTwo: {
    height: 135,
    left: 30,
    transform: [{ rotate: "8deg" }],
  },
  reedLeafThree: {
    height: 86,
    left: 46,
    transform: [{ rotate: "24deg" }],
  },
  cattailStem: {
    position: "absolute",
    width: 5,
    height: 108,
    left: 47,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: "#4E8C54",
    transform: [{ rotate: "8deg" }],
  },
  cattail: {
    position: "absolute",
    width: 13,
    height: 34,
    left: 52,
    top: 30,
    borderRadius: 8,
    backgroundColor: "#A26E3E",
    transform: [{ rotate: "8deg" }],
  },
  rock: {
    position: "absolute",
    backgroundColor: "#78999A",
    borderRadius: 999,
    borderBottomWidth: 6,
    borderBottomColor: "#648486",
    zIndex: 1,
  },
  rockOne: {
    width: 58,
    height: 38,
    right: -10,
    top: 175,
  },
  rockTwo: {
    width: 49,
    height: 33,
    left: -8,
    top: 440,
  },
  rockThree: {
    width: 64,
    height: 41,
    right: -14,
    bottom: 72,
  },
  smallPad: {
    position: "absolute",
    width: 66,
    height: 38,
    borderRadius: 33,
    backgroundColor: "#62A95B",
    borderWidth: 2,
    borderColor: "#4B8D50",
    zIndex: 1,
  },
  smallPadLeft: {
    left: -22,
    top: 280,
    transform: [{ rotate: "-8deg" }],
  },
  smallPadRight: {
    right: -18,
    top: 515,
    transform: [{ rotate: "9deg" }],
  },
  lotus: {
    position: "absolute",
    top: -22,
    left: 17,
    fontSize: 26,
  },
  macoArea: {
    height: 155,
    marginTop: -6,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingLeft: 34,
    zIndex: 3,
  },
  macoPadShadow: {
    position: "absolute",
    left: 24,
    bottom: 1,
    width: 155,
    height: 60,
    borderRadius: 80,
    backgroundColor: "rgba(53,134,143,0.18)",
  },
  macoPad: {
    position: "absolute",
    left: 28,
    bottom: 9,
    width: 145,
    height: 58,
    borderRadius: 75,
    backgroundColor: "#66AD5E",
    borderWidth: 3,
    borderColor: "#4D8B4F",
  },
  maco: {
    width: 138,
    height: 122,
    marginLeft: 4,
    marginBottom: 18,
  },
  bubble: {
    position: "absolute",
    left: 160,
    bottom: 55,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
    shadowColor: "#6FAAB0",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 1,
  },
  bubbleText: {
    fontFamily: "Nunito_700Bold",
    fontSize: 13,
    color: "#244247",
  },
});
