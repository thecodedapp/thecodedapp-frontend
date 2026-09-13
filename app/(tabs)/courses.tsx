import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const courses = [
  ["💻", "Learn to Code", "Start your coding journey", "10 lessons"],
  ["JS", "JavaScript Basics", "Bring websites to life", "12 lessons"],
  ["🛠️", "Build Projects", "Turn ideas into real apps", "8 lessons"],
  ["🧠", "Interview Prep", "Gain confidence for interviews", "10 lessons"],
];

export default function CoursesScreen() {
  const [fontsLoaded] = useFonts({ Nunito_600SemiBold, Nunito_700Bold, Nunito_900Black });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.wordmark}>maco</Text>
        <Text style={styles.title}>Choose Your Path</Text>
        <Text style={styles.subtitle}>Explore courses, build skills, and grow your future.</Text>

        <View style={styles.filters}>
          {["All", "Beginner", "Intermediate", "Advanced"].map((filter, i) => (
            <View key={filter} style={[styles.filter, i === 0 && styles.filterActive]}>
              <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{filter}</Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {courses.map(([icon, title, description, lessons]) => (
            <View key={title} style={styles.card}>
              <View style={styles.pad}><Text style={styles.icon}>{icon}</Text></View>
              <Text style={styles.cardTitle}>{title}</Text>
              <Text style={styles.cardDescription}>{description}</Text>
              <Text style={styles.lessons}>{lessons}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quizCard}>
          <Text style={styles.quizMascot}>🐸</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.quizTitle}>Not sure where to start?</Text>
            <Text style={styles.quizText}>Take a short quiz and we’ll find the best path for you!</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FFFD" },
  content: { padding: 20, paddingBottom: 28 },
  wordmark: { fontFamily: "Nunito_900Black", fontSize: 34, color: "#2F7A58", textAlign: "center", marginBottom: 18 },
  title: { fontFamily: "Nunito_900Black", fontSize: 28, color: "#20383C", textAlign: "center" },
  subtitle: { fontFamily: "Nunito_600SemiBold", fontSize: 13, color: "#60787A", textAlign: "center", marginTop: 4, marginBottom: 18 },
  filters: { flexDirection: "row", gap: 8, marginBottom: 18 },
  filter: { flex: 1, paddingVertical: 8, borderRadius: 999, backgroundColor: "#EAF4F0", alignItems: "center" },
  filterActive: { backgroundColor: "#3F8E67" },
  filterText: { fontFamily: "Nunito_600SemiBold", fontSize: 11, color: "#526D70" },
  filterTextActive: { color: "#FFFFFF" },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", gap: 12 },
  card: { width: "48%", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 14, borderWidth: 1, borderColor: "#DCE9E0" },
  pad: { width: 76, height: 54, borderRadius: 38, backgroundColor: "#A7D889", alignItems: "center", justifyContent: "center", alignSelf: "center", marginBottom: 10, borderWidth: 2, borderColor: "#6EA95A" },
  icon: { fontFamily: "Nunito_900Black", fontSize: 25, color: "#1E442E" },
  cardTitle: { fontFamily: "Nunito_700Bold", fontSize: 15, color: "#20383C", textAlign: "center" },
  cardDescription: { fontFamily: "Nunito_600SemiBold", fontSize: 11, color: "#6B7F81", textAlign: "center", minHeight: 32, marginTop: 3 },
  lessons: { fontFamily: "Nunito_600SemiBold", fontSize: 11, color: "#4E7771", marginTop: 10 },
  quizCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#E7F7F4", borderRadius: 20, padding: 14, marginTop: 16 },
  quizMascot: { fontSize: 34, marginRight: 10 },
  quizTitle: { fontFamily: "Nunito_700Bold", fontSize: 14, color: "#20383C" },
  quizText: { fontFamily: "Nunito_600SemiBold", fontSize: 11, color: "#61777A", marginTop: 2 },
  arrow: { fontSize: 30, color: "#3D91B0" },
});
