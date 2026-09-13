import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { deleteToken } from "../../lib/authStorage";

const menu = [
  ["person-outline", "Account"],
  ["notifications-outline", "Notifications"],
  ["moon-outline", "Theme"],
  ["help-circle-outline", "Help & Support"],
] as const;

export default function ProfileScreen() {
  const [fontsLoaded] = useFonts({ Nunito_600SemiBold, Nunito_700Bold, Nunito_900Black });
  if (!fontsLoaded) return null;

  const handleLogout = async () => {
    await deleteToken();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.content}>
        <Text style={styles.wordmark}>maco</Text>

        <View style={styles.profileTop}>
          <View style={styles.avatar}><Text style={styles.avatarEmoji}>👩🏻</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Alex</Text>
            <Text style={styles.tagline}>Lifelong learner 🌱</Text>
            <Text style={styles.bio}>Learning to build a kinder, brighter future — one lesson at a time. 💚</Text>
          </View>
        </View>

        <View style={styles.levelCard}>
          <Text style={styles.leaf}>🌱</Text>
          <View style={{ flex: 1 }}>
            <View style={styles.rowBetween}>
              <View>
                <Text style={styles.level}>Level 2</Text>
                <Text style={styles.levelName}>Curious Learner</Text>
              </View>
              <Text style={styles.xp}>120 / 250 XP</Text>
            </View>
            <View style={styles.progressTrack}><View style={styles.progressFill} /></View>
          </View>
        </View>

        <View style={styles.quoteCard}>
          <Text style={styles.quote}>“A little progress each day adds up to big results.”</Text>
          <View style={styles.quoteBottom}>
            <Text style={styles.macoName}>— Maco</Text>
            <Image source={require("../../assets/images/maco-peek.png")} style={styles.maco} resizeMode="contain" />
          </View>
        </View>

        <View style={styles.menuCard}>
          {menu.map(([icon, label], index) => (
            <View key={label} style={[styles.menuRow, index < menu.length - 1 && styles.menuBorder]}>
              <Ionicons name={icon} size={21} color="#385A61" />
              <Text style={styles.menuText}>{label}</Text>
              {label === "Theme" && <Text style={styles.themeValue}>Light</Text>}
              <Ionicons name="chevron-forward" size={18} color="#789094" />
            </View>
          ))}

          <Pressable style={styles.logoutRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E25555" />
            <Text style={styles.logoutText}>Log Out</Text>
            <Ionicons name="chevron-forward" size={18} color="#E25555" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FFFC" },
  content: { paddingHorizontal: 18 },
  wordmark: { fontFamily: "Nunito_900Black", fontSize: 34, color: "#2F7A58", textAlign: "center", marginBottom: 22 },
  profileTop: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 14 },
  avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: "#F7D8E2", alignItems: "center", justifyContent: "center", borderWidth: 4, borderColor: "#F2BFCF" },
  avatarEmoji: { fontSize: 38 },
  name: { fontFamily: "Nunito_900Black", fontSize: 23, color: "#20383C" },
  tagline: { fontFamily: "Nunito_700Bold", fontSize: 13, color: "#507077" },
  bio: { fontFamily: "Nunito_600SemiBold", fontSize: 10, color: "#708386", marginTop: 5 },
  levelCard: { flexDirection: "row", backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, borderWidth: 1, borderColor: "#DCE9E0", alignItems: "center", marginBottom: 12 },
  leaf: { fontSize: 34, marginRight: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  level: { fontFamily: "Nunito_900Black", fontSize: 16, color: "#20383C" },
  levelName: { fontFamily: "Nunito_600SemiBold", fontSize: 10, color: "#6A7F82" },
  xp: { fontFamily: "Nunito_700Bold", fontSize: 10, color: "#516E73" },
  progressTrack: { height: 10, backgroundColor: "#DDEAE5", borderRadius: 999, marginTop: 8, overflow: "hidden" },
  progressFill: { width: "48%", height: "100%", backgroundColor: "#63B779" },
  quoteCard: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 15, borderWidth: 1, borderColor: "#DCE9E0", marginBottom: 12 },
  quote: { fontFamily: "Nunito_700Bold", fontSize: 14, color: "#38565C", lineHeight: 20 },
  quoteBottom: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center" },
  macoName: { fontFamily: "Nunito_600SemiBold", fontSize: 11, color: "#6B7F81" },
  maco: { width: 74, height: 60 },
  menuCard: { backgroundColor: "#FFFFFF", borderRadius: 20, paddingHorizontal: 14, borderWidth: 1, borderColor: "#DCE9E0" },
  menuRow: { height: 56, flexDirection: "row", alignItems: "center", gap: 12 },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#E7EFEB" },
  menuText: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: 13, color: "#38565C" },
  themeValue: { fontFamily: "Nunito_600SemiBold", fontSize: 11, color: "#708386" },
  logoutRow: { height: 56, flexDirection: "row", alignItems: "center", gap: 12 },
  logoutText: { flex: 1, fontFamily: "Nunito_700Bold", fontSize: 13, color: "#E25555" },
});
