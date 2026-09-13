import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const week = [
  ["Mon", 42], ["Tue", 36], ["Wed", 40], ["Thu", 50], ["Fri", 58], ["Sat", 22], ["Sun", 16],
] as const;

export default function StatsScreen() {
  const [fontsLoaded] = useFonts({ Nunito_600SemiBold, Nunito_700Bold, Nunito_900Black });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.wordmark}>maco</Text>

        <View style={styles.hero}>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroTitle}>You’re Growing!</Text>
            <Text style={styles.heroText}>Keep going — you’re doing great!</Text>
          </View>
          <Text style={styles.frog}>🐸✨</Text>
        </View>

        <View style={styles.metrics}>
          {[['🔥', '3', 'Day Streak'], ['📖', '12', 'Lessons Completed'], ['⭐', '5', 'Badges Earned']].map(([icon, value, label]) => (
            <View key={label} style={styles.metric}>
              <Text style={styles.metricIcon}>{icon}</Text>
              <Text style={styles.metricValue}>{value}</Text>
              <Text style={styles.metricLabel}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Learning Progress</Text>
            <Text style={styles.progressValue}>45%</Text>
          </View>
          <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          <Text style={styles.small}>9 of 20 lessons completed</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>This Week</Text>
            <Text style={styles.small}>Keep it up! 💚</Text>
          </View>
          <View style={styles.chart}>
            {week.map(([day, height]) => (
              <View key={day} style={styles.day}>
                <View style={[styles.bar, { height }]} />
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.cardTitle}>Recent Achievements</Text>
            <Text style={styles.link}>See all</Text>
          </View>
          <View style={styles.badges}>
            {[['🌱','First Step'], ['⭐','3 Day Streak'], ['⛰️','Explorer'], ['🔒','Project']].map(([icon, label]) => (
              <View key={label} style={styles.badge}>
                <View style={styles.badgeCircle}><Text style={styles.badgeIcon}>{icon}</Text></View>
                <Text style={styles.badgeText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFFC" },
  content: { paddingHorizontal: 18 },
  wordmark: { fontFamily: "Nunito_900Black", fontSize: 34, color: "#2F7A58", textAlign: "center", marginBottom: 18 },
  hero: { flexDirection: "row", alignItems: "center", backgroundColor: "#E9F8F1", borderRadius: 22, padding: 16, marginBottom: 12 },
  heroTitle: { fontFamily: "Nunito_900Black", fontSize: 24, color: "#20383C" },
  heroText: { fontFamily: "Nunito_600SemiBold", fontSize: 12, color: "#60787A", marginTop: 3 },
  frog: { fontSize: 48 },
  metrics: { flexDirection: "row", gap: 10, marginBottom: 12 },
  metric: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 18, paddingVertical: 12, alignItems: "center", borderWidth: 1, borderColor: "#DCE9E0" },
  metricIcon: { fontSize: 20 },
  metricValue: { fontFamily: "Nunito_900Black", fontSize: 21, color: "#20383C" },
  metricLabel: { fontFamily: "Nunito_600SemiBold", fontSize: 9, color: "#667C7E", textAlign: "center" },
  card: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, marginBottom: 12, borderWidth: 1, borderColor: "#DCE9E0" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontFamily: "Nunito_700Bold", fontSize: 15, color: "#20383C" },
  progressValue: { fontFamily: "Nunito_900Black", color: "#2F7A58", fontSize: 16 },
  progressTrack: { height: 12, backgroundColor: "#DDEAE5", borderRadius: 999, marginTop: 10, overflow: "hidden" },
  progressFill: { width: "45%", height: "100%", backgroundColor: "#63B779", borderRadius: 999 },
  small: { fontFamily: "Nunito_600SemiBold", fontSize: 10, color: "#6B7F81", marginTop: 6 },
  chart: { height: 92, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: 14 },
  day: { alignItems: "center", justifyContent: "flex-end", flex: 1 },
  bar: { width: 16, borderRadius: 8, backgroundColor: "#65BF7D" },
  dayLabel: { fontFamily: "Nunito_600SemiBold", fontSize: 9, color: "#6B7F81", marginTop: 4 },
  link: { fontFamily: "Nunito_700Bold", fontSize: 11, color: "#2F7A58" },
  badges: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
  badge: { width: "23%", alignItems: "center" },
  badgeCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: "#EDF6DB", alignItems: "center", justifyContent: "center" },
  badgeIcon: { fontSize: 24 },
  badgeText: { fontFamily: "Nunito_600SemiBold", fontSize: 9, color: "#40595D", textAlign: "center", marginTop: 5 },
});
