import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { ImageBackground, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

        <ImageBackground
          source={require("../../assets/images/pond-background-step1.jpg")}
          style={styles.pondBackground}
          imageStyle={styles.pondBackgroundImage}
          resizeMode="cover"
        />
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
  pondBackground: {
    width: "100%",
    height: 820,
    overflow: "hidden",
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "#9ADFE5",
  },
  pondBackgroundImage: {
    borderRadius: 28,
  },
});
