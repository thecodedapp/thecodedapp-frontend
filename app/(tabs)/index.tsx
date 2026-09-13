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
  { title: "Variables and Data", locked: false },
  { title: "Conditionals", locked: false },
  { title: "Loops", locked: false },
  { title: "Functions", locked: true },
  { title: "Build a Project", locked: true },
];

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
          <View style={styles.avatar}><Text>👩🏻</Text></View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.courseCard}>
          <Text style={styles.courseIcon}>💻</Text>
          <View style={styles.courseCopy}>
            <Text style={styles.courseTitle}>Learn to Code</Text>
            <Text style={styles.courseSubtitle}>Build your future, one step at a time.</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>

        <View style={styles.pond}>
          <View style={[styles.blob, styles.blobOne]} />
          <View style={[styles.blob, styles.blobTwo]} />
          <View style={[styles.blob, styles.blobThree]} />

          {lessons.map((lesson, index) => (
            <View
              key={lesson.title}
              style={[
                styles.lessonRow,
                index % 2 === 0 ? styles.rowLeft : styles.rowRight,
              ]}
            >
              <LilyPad number={index + 1} locked={lesson.locked} />
              <View style={styles.lessonLabel}>
                <Text style={styles.lessonText}>{lesson.title}</Text>
              </View>
            </View>
          ))}

          <View style={styles.macoWrap}>
            <Image
              source={require("../../assets/images/maco-peek.png")}
              style={styles.maco}
              resizeMode="contain"
            />
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>You can do this! 💚</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFDF7" },
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  wordmark: { fontFamily: "Nunito_900Black", fontSize: 34, color: "#2F7A58" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  streak: { fontFamily: "Nunito_700Bold", fontSize: 15, color: "#E97B36" },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F6DDE5",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: { paddingHorizontal: 16, paddingBottom: 28 },
  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE9E0",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  courseIcon: { fontSize: 34, marginRight: 12 },
  courseCopy: { flex: 1 },
  courseTitle: { fontFamily: "Nunito_700Bold", fontSize: 17, color: "#20383C" },
  courseSubtitle: { fontFamily: "Nunito_600SemiBold", fontSize: 12, color: "#5D7375", marginTop: 2 },
  chevron: { fontSize: 30, color: "#4A94B7" },
  pond: {
    minHeight: 760,
    borderRadius: 28,
    backgroundColor: "#CFF5F2",
    paddingVertical: 26,
    overflow: "hidden",
  },
  blob: { position: "absolute", backgroundColor: "#B7E4A6", borderRadius: 999 },
  blobOne: { width: 90, height: 90, left: -32, top: 70 },
  blobTwo: { width: 120, height: 120, right: -48, top: 250 },
  blobThree: { width: 85, height: 85, left: -20, bottom: 80 },
  lessonRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
    paddingHorizontal: 30,
    gap: 14,
  },
  rowLeft: { justifyContent: "flex-start" },
  rowRight: { justifyContent: "flex-end", flexDirection: "row-reverse" },
  lessonLabel: {
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 14,
    paddingVertical: 8,
    paddingHorizontal: 12,
    maxWidth: 150,
  },
  lessonText: { fontFamily: "Nunito_700Bold", fontSize: 13, color: "#244247" },
  macoWrap: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, marginTop: 2 },
  maco: { width: 110, height: 100 },
  bubble: { backgroundColor: "#FFFFFF", borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, marginLeft: 4 },
  bubbleText: { fontFamily: "Nunito_700Bold", fontSize: 13, color: "#244247" },
});
