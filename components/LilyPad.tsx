import { StyleSheet, Text, View } from "react-native";

type Props = {
  number?: number;
  locked?: boolean;
  size?: number;
};

export default function LilyPad({ number, locked = false, size = 92 }: Props) {
  return (
    <View style={[styles.shadow, { width: size, height: size * 0.72 }]}>
      <View
        style={[
          styles.pad,
          locked && styles.padLocked,
          { width: size, height: size * 0.72, borderRadius: size / 2 },
        ]}
      >
        <View style={styles.highlight} />
        <View style={styles.notch} />
        <Text style={styles.label}>{locked ? "🔒" : number}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadow: {
    backgroundColor: "#BDECF0",
    borderRadius: 999,
    paddingBottom: 5,
  },
  pad: {
    backgroundColor: "#6FAD57",
    borderWidth: 3,
    borderColor: "#4D8743",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  padLocked: {
    backgroundColor: "#5F8D82",
    borderColor: "#48746B",
  },
  highlight: {
    position: "absolute",
    width: "55%",
    height: "22%",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.18)",
    top: 8,
    left: 12,
  },
  notch: {
    position: "absolute",
    right: -7,
    top: -2,
    width: 28,
    height: 30,
    backgroundColor: "#D8F4F0",
    transform: [{ rotate: "35deg" }],
  },
  label: {
    fontFamily: "Nunito_900Black",
    fontSize: 24,
    color: "#FFFFFF",
  },
});
