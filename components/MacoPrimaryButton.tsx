import { Pressable, StyleSheet, Text, View } from "react-native";

type MacoPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  width?: number | `${number}%`;
  height?: number;
  fontSize?: number;
  showSparkle?: boolean;
  borderRadius?: number;
  shadowOffset?: number;
};

export default function MacoPrimaryButton({
  label,
  onPress,
  width = "77%",
  height = 100,
  fontSize = 22,
  showSparkle = true,
  borderRadius = 20,
  shadowOffset = 4.5,
}: MacoPrimaryButtonProps) {
  const scale = height / 100;

  const blockWidth = 5 * scale;
  const blockHeight = 6 * scale;

  const horizontalStep = 5 * scale;
  const verticalStep = 4 * scale;

  const sparkleWidth = horizontalStep * 5 + blockWidth;
  const sparkleHeight = verticalStep * 5 + blockHeight;

  const sparkleTop = 10 * scale;
  const sparkleRight = 10 * scale;

  return (
    <View style={[styles.wrapper, { width, height }]}>
      <View
        style={[
          styles.shadow,
          {
            height,
            top: shadowOffset,
            borderRadius,
          },
        ]}
      />

      <Pressable
        style={[
          styles.button,
          {
            height,
            borderRadius,
          },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.buttonText, { fontSize }]}>
          {label}
        </Text>

        {showSparkle && (
          <View
            style={[
              styles.sparkle,
              {
                top: sparkleTop,
                right: sparkleRight,
                width: sparkleWidth,
                height: sparkleHeight,
              },
            ]}
          >
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <View
                key={index}
                style={[
                  styles.sparkleBlock,
                  {
                    width: blockWidth,
                    height: blockHeight,
                    top: verticalStep * index,
                    left: horizontalStep * index,
                  },
                ]}
              />
            ))}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },

  shadow: {
    position: "absolute",
    width: "100%",
    backgroundColor: "#6F8153",
  },

  button: {
    width: "100%",
    backgroundColor: "#B8D986",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    fontFamily: "Nunito_700Bold",
    color: "#1F1F1F",
  },

  sparkle: {
    position: "absolute",
  },

  sparkleBlock: {
    position: "absolute",
    backgroundColor: "#FFF8EE",
  },
});