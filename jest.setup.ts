import { jest } from "@jest/globals";

jest.mock("@expo-google-fonts/nunito", () => ({
  Nunito_300Light: "Nunito_300Light",
  Nunito_400Regular: "Nunito_400Regular",
  Nunito_600SemiBold: "Nunito_600SemiBold",
  Nunito_700Bold: "Nunito_700Bold",
  Nunito_800ExtraBold: "Nunito_800ExtraBold",
  Nunito_900Black: "Nunito_900Black",
  useFonts: () => [true],
}));

jest.mock("react-native-safe-area-context", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    SafeAreaView: ({ children, ...props }: any) =>
      React.createElement(View, props, children),
  };
});
