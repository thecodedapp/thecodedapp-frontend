import {
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
  Nunito_900Black,
  useFonts,
} from "@expo-google-fonts/nunito";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MacoPrimaryButton from "../../components/MacoPrimaryButton";
import { completeLesson } from "../../lib/lessonProgress";

const COLORS = {
  cream: "#FFF8EE",
  green: "#2F785B",
  greenDark: "#236148",
  mint: "#DDF4E6",
  navy: "#123B45",
  muted: "#657A8B",
  border: "#D8E8D0",
  softBlue: "#EAF6F7",
  success: "#D8F2DF",
  successBorder: "#8FC79B",
  white: "#FFFFFF",
};

type ContentStep = {
  type: "content";
  title: string;
  body: string;
  callout?: string;
  bullets?: string[];
};

type QuizStep = {
  type: "quiz";
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  successText: string;
  retryText: string;
};

type CardsStep = {
  type: "cards";
  title: string;
  body: string;
  cards: { emoji: string; label: string }[];
  footer: string;
};

type CompleteStep = {
  type: "complete";
  title: string;
  body: string;
};

type LessonStep = ContentStep | QuizStep | CardsStep | CompleteStep;

const WHAT_IS_CODE_STEPS: LessonStep[] = [
  {
    type: "content",
    title: "Code is everywhere.",
    body:
      "Apps. Websites. Games. Cars. ATMs. They all work because someone wrote instructions telling a computer what to do.",
    callout: "Code is how we give computers instructions.",
  },
  {
    type: "content",
    title: "So... what is code?",
    body:
      "Code is a set of instructions written for a computer. Think of it like a recipe: a recipe tells you what to do step by step, and code does the same thing for a computer.",
    bullets: [
      "Get bread → Get user input",
      "Add cheese → Check the input",
      "Toast it → Show a result",
    ],
  },
  {
    type: "content",
    title: "Computers are VERY literal.",
    body:
      "Computers do not guess what you meant. They follow the instructions you give them, in the order you give them.",
    callout: "If the instructions are out of order, the result can be wrong too.",
  },
  {
    type: "quiz",
    title: "Tiny challenge",
    question: "You want Maco to turn on a lamp. Which order makes the most sense?",
    options: [
      "1. Find the lamp\n2. Press the power button\n3. The lamp turns on",
      "1. The lamp turns on\n2. Find the lamp\n3. Press the power button",
    ],
    correctIndex: 0,
    successText: "Exactly! The order of instructions matters.",
    retryText: "Almost! A computer needs the steps in a logical order.",
  },
  {
    type: "cards",
    title: "What can you make with code?",
    body: "A lot more than just websites.",
    cards: [
      { emoji: "📱", label: "Mobile apps" },
      { emoji: "🌐", label: "Websites" },
      { emoji: "🎮", label: "Games" },
      { emoji: "🤖", label: "AI tools" },
      { emoji: "⚙️", label: "Automations" },
      { emoji: "💻", label: "Software" },
    ],
    footer:
      "Different programming languages are good at different kinds of jobs. You'll learn about those soon.",
  },
  {
    type: "complete",
    title: "You just learned your first programming concept. 🌱",
    body:
      "Code is simply a way of giving computers instructions. And you're officially learning how to write them.",
  },
];

const MACO_BY_STEP: ImageSourcePropType[] = [
  require("../../assets/images/maco-thinking.png"),
  require("../../assets/images/maco-smiling-looking-up-to-the-side.png"),
  require("../../assets/images/maco-thinking.png"),
  require("../../assets/images/maco-gleeful.png"),
  require("../../assets/images/maco-happy-with-heart-halo.png"),
  require("../../assets/images/maco-jump.png"),
];

function MacoCompanion({
  source,
  centered = false,
}: {
  source: ImageSourcePropType;
  centered?: boolean;
}) {
  return (
    <View style={centered ? styles.macoWrapCentered : styles.macoWrap}>
      <Image
        source={source}
        style={[styles.macoImage, centered && styles.macoImageLarge]}
        resizeMode="contain"
      />
    </View>
  );
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const [fontsLoaded] = useFonts({
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
  });

  const steps = useMemo(() => {
    if (id === "what-is-code") return WHAT_IS_CODE_STEPS;
    return WHAT_IS_CODE_STEPS;
  }, [id]);

  if (!fontsLoaded) return null;

  const step = steps[stepIndex];
  const progress = (stepIndex + 1) / steps.length;
  const isLastStep = stepIndex === steps.length - 1;
  const macoSource = MACO_BY_STEP[stepIndex] ?? MACO_BY_STEP[0];

  const goNext = async () => {
    if (isLastStep) {
      if (id === "what-is-code") {
        await completeLesson(1);
      }

      router.replace("/course-map");
      return;
    }

    setSelectedOption(null);
    setStepIndex((current) => current + 1);
  };

  const canContinue = step.type !== "quiz" || selectedOption === step.correctIndex;

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screen}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={COLORS.green} />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.lessonEyebrow}>LESSON 1</Text>
            <Text style={styles.lessonTitle}>What is Code?</Text>
          </View>

          <Text style={styles.stepCount}>
            {stepIndex + 1} / {steps.length}
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>

        <ScrollView
          style={styles.contentScroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {step.type === "content" && (
            <View style={styles.lessonCard}>
              <MacoCompanion source={macoSource} />
              <Text style={[styles.stepTitle, styles.copyWithMaco]}>{step.title}</Text>
              <Text style={[styles.bodyText, styles.copyWithMaco]}>{step.body}</Text>

              {step.callout && (
                <View style={styles.callout}>
                  <Ionicons name="bulb-outline" size={21} color={COLORS.green} />
                  <Text style={styles.calloutText}>{step.callout}</Text>
                </View>
              )}

              {step.bullets && (
                <View style={styles.exampleList}>
                  {step.bullets.map((item) => (
                    <View key={item} style={styles.exampleRow}>
                      <View style={styles.exampleDot} />
                      <Text style={styles.exampleText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          )}

          {step.type === "quiz" && (
            <View style={styles.lessonCard}>
              <MacoCompanion source={macoSource} />
              <Text style={[styles.stepTitle, styles.copyWithMaco]}>{step.title}</Text>
              <Text style={[styles.bodyText, styles.copyWithMaco]}>{step.question}</Text>

              <View style={styles.optionsList}>
                {step.options.map((option, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrect = isSelected && index === step.correctIndex;
                  const isWrong = isSelected && index !== step.correctIndex;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => setSelectedOption(index)}
                      style={({ pressed }) => [
                        styles.optionCard,
                        isCorrect && styles.optionCorrect,
                        isWrong && styles.optionWrong,
                        pressed && styles.optionPressed,
                      ]}
                    >
                      <View style={styles.optionLetter}>
                        <Text style={styles.optionLetterText}>
                          {String.fromCharCode(65 + index)}
                        </Text>
                      </View>
                      <Text style={styles.optionText}>{option}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {selectedOption !== null && (
                <View
                  style={[
                    styles.feedbackBox,
                    selectedOption === step.correctIndex
                      ? styles.feedbackSuccess
                      : styles.feedbackRetry,
                  ]}
                >
                  <Text style={styles.feedbackText}>
                    {selectedOption === step.correctIndex
                      ? step.successText
                      : step.retryText}
                  </Text>
                </View>
              )}
            </View>
          )}

          {step.type === "cards" && (
            <View style={styles.lessonCard}>
              <MacoCompanion source={macoSource} />
              <Text style={[styles.stepTitle, styles.copyWithMaco]}>{step.title}</Text>
              <Text style={[styles.bodyText, styles.copyWithMaco]}>{step.body}</Text>

              <View style={styles.cardsGrid}>
                {step.cards.map((card) => (
                  <View key={card.label} style={styles.miniCard}>
                    <Text style={styles.cardEmoji}>{card.emoji}</Text>
                    <Text style={styles.cardLabel}>{card.label}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.footerText}>{step.footer}</Text>
            </View>
          )}

          {step.type === "complete" && (
            <View style={[styles.lessonCard, styles.completeCard]}>
              <View style={styles.completeIcon}>
                <Text style={styles.completeEmoji}>🌱</Text>
              </View>
              <Text style={[styles.stepTitle, styles.completeTitle]}>
                {step.title}
              </Text>
              <Text style={[styles.bodyText, styles.completeBody]}>{step.body}</Text>
              <MacoCompanion source={macoSource} centered />
            </View>
          )}
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={!canContinue ? styles.disabledButton : undefined}>
            <MacoPrimaryButton
              label={isLastStep ? "Finish Lesson" : "Continue"}
              onPress={() => {
                if (canContinue) void goNext();
              }}
              width="100%"
              height={60}
              fontSize={18}
              borderRadius={18}
              shadowOffset={4}
            />
          </View>
        </View>
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
  header: {
    minHeight: 76,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.mint,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  lessonEyebrow: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 11,
    letterSpacing: 1.2,
    color: COLORS.green,
  },
  lessonTitle: {
    marginTop: 2,
    fontFamily: "Nunito_900Black",
    fontSize: 18,
    color: COLORS.navy,
  },
  stepCount: {
    width: 44,
    textAlign: "right",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 13,
    color: COLORS.muted,
  },
  progressTrack: {
    height: 8,
    marginHorizontal: 22,
    borderRadius: 4,
    backgroundColor: "#E5E9E4",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 28,
    paddingBottom: 26,
  },
  lessonCard: {
    width: "100%",
    maxWidth: 560,
    flexGrow: 1,
    alignSelf: "center",
    padding: 24,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: "#FFFDF8",
    position: "relative",
  },
  stepTitle: {
    fontFamily: "Nunito_900Black",
    fontSize: 30,
    lineHeight: 36,
    color: COLORS.navy,
  },
  copyWithMaco: {
    paddingRight: 112,
  },
  bodyText: {
    marginTop: 14,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.muted,
  },
  callout: {
    marginTop: 24,
    padding: 16,
    borderRadius: 18,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: COLORS.softBlue,
  },
  calloutText: {
    flex: 1,
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 15,
    lineHeight: 21,
    color: COLORS.navy,
  },
  exampleList: {
    marginTop: 22,
    gap: 12,
  },
  exampleRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  exampleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 7,
    backgroundColor: COLORS.green,
  },
  exampleText: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.navy,
  },
  optionsList: {
    marginTop: 22,
    gap: 12,
  },
  optionCard: {
    minHeight: 84,
    padding: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  optionCorrect: {
    borderColor: COLORS.successBorder,
    backgroundColor: COLORS.success,
  },
  optionWrong: {
    borderColor: "#E6B0A8",
    backgroundColor: "#FFF0ED",
  },
  optionPressed: {
    transform: [{ scale: 0.99 }],
  },
  optionLetter: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.mint,
  },
  optionLetterText: {
    fontFamily: "Nunito_900Black",
    fontSize: 15,
    color: COLORS.greenDark,
  },
  optionText: {
    flex: 1,
    fontFamily: "Nunito_700Bold",
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.navy,
  },
  feedbackBox: {
    marginTop: 18,
    padding: 14,
    borderRadius: 16,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.success,
  },
  feedbackRetry: {
    backgroundColor: "#FFF0ED",
  },
  feedbackText: {
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.navy,
  },
  cardsGrid: {
    marginTop: 22,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  miniCard: {
    flexGrow: 1,
    flexBasis: "46%",
    minHeight: 108,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
  cardEmoji: {
    fontSize: 30,
  },
  cardLabel: {
    marginTop: 7,
    textAlign: "center",
    fontFamily: "Nunito_800ExtraBold",
    fontSize: 14,
    color: COLORS.navy,
  },
  footerText: {
    marginTop: 20,
    fontFamily: "Nunito_600SemiBold",
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.muted,
  },
  macoWrap: {
    position: "absolute",
    top: 14,
    right: 16,
    zIndex: 2,
  },
  macoWrapCentered: {
    marginTop: "auto",
    paddingTop: 18,
    alignItems: "center",
  },
  macoImage: {
    width: 104,
    height: 104,
  },
  macoImageLarge: {
    width: 170,
    height: 170,
  },
  completeCard: {
    alignItems: "center",
    paddingVertical: 34,
  },
  completeIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: COLORS.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  completeEmoji: {
    fontSize: 44,
  },
  completeTitle: {
    marginTop: 22,
    textAlign: "center",
    fontSize: 28,
  },
  completeBody: {
    textAlign: "center",
    maxWidth: 420,
  },
  bottomBar: {
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: COLORS.cream,
  },
  disabledButton: {
    opacity: 0.45,
  },
});