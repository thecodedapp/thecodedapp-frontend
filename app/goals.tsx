import {
    Nunito_300Light,
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_900Black,
    useFonts,
} from "@expo-google-fonts/nunito";
import { useState } from "react";
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
  
  const goals = [
    "I'm new to coding",
    "I want to build things",
    "I want coding skills for work",
    "I'm preparing for interviews",
  ];
  
  export default function GoalsScreen() {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  
    const [fontsLoaded] = useFonts({
      Nunito_300Light,
      Nunito_400Regular,
      Nunito_600SemiBold,
      Nunito_700Bold,
      Nunito_900Black,
    });
  
    if (!fontsLoaded) {
      return null;
    }
  
    const toggleGoal = (goal: string) => {
      setSelectedGoals((currentGoals) => {
        const isAlreadySelected = currentGoals.includes(goal);
  
        if (isAlreadySelected) {
          return currentGoals.filter((item) => item !== goal);
        }
  
        return [...currentGoals, goal];
      });
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.wordmark}>maco</Text>
  
        <View style={styles.content}>
          <Text style={styles.title}>What brings you here?</Text>
  
          <Text style={styles.subtitle}>
            (You can change this later)
          </Text>
  
          <View style={styles.goalList}>
            {goals.map((goal) => {
              const isSelected = selectedGoals.includes(goal);
  
              return (
                <Pressable
                  key={goal}
                  style={[
                    styles.goalCard,
                    isSelected && styles.goalCardSelected,
                  ]}
                  onPress={() => toggleGoal(goal)}
                >
                  <Text
                    style={[
                      styles.goalText,
                      isSelected && styles.goalTextSelected,
                    ]}
                  >
                    {goal}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
  
        <Image
          source={require("../assets/images/happy-maco-on-phone.png")}
          style={styles.macoImage}
          resizeMode="contain"
        />
        {selectedGoals.length > 0 && (
        <Pressable style={styles.nextButton}>
            <Text style={styles.nextText}>Next →</Text>
        </Pressable>
        )}
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFF8EE",
      overflow: "hidden",
    },
  
    wordmark: {
      alignSelf: "flex-end",
      marginTop: 0,
      marginRight: 20,
      fontSize: 40,
      fontFamily: "Nunito_900Black",
      color: "#000000",
    },
  
    content: {
      marginTop: 82,
      paddingHorizontal: 34,
    },
  
    title: {
      fontSize: 29,
      fontFamily: "Nunito_700Bold",
      color: "#1F1F1F",
    },
  
    subtitle: {
      marginTop: -2,
      marginBottom: 18,
      fontSize: 12,
      fontFamily: "Nunito_600SemiBold",
      color: "#1F1F1F",
    },
  
    goalList: {
      gap: 14,
    },
  
    goalCard: {
      width: "100%",
      height: 84,
      justifyContent: "center",
      backgroundColor: "#B8D986",
      borderWidth: 2,
      borderColor: "#84995E",
      borderRadius: 16,
      paddingHorizontal: 20,
    },
  
    goalCardSelected: {
      backgroundColor: "#84995E",
      borderColor: "#84995E",
    },
  
    goalText: {
      fontSize: 16,
      fontFamily: "Nunito_400Regular",
      color: "#1F1F1F",
    },
  
    goalTextSelected: {
      fontFamily: "Nunito_600SemiBold",
      textAlign: "center",
    },

    nextButton: {
        position: "absolute",
        right: 28,
        bottom: 18,
      },
      
      nextText: {
        fontSize: 18,
        fontFamily: "Nunito_700Bold",
        color: "#1F1F1F",

        textShadowColor: "rgba(0, 0, 0, 0.18)",
        textShadowOffset: {
            width: 1,
            height: 2,
        },
        textShadowRadius: 2,
      },
  
    macoImage: {
      position: "absolute",
      bottom: 85,
      left: "72%",
      width: 251,
      height: 251,
      transform: [{ translateX: -125.5 }],
    },
  });