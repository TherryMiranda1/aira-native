import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ExerciseSuggestionOutput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentList, ContentText } from "./ContentCard";

interface ExerciseCardProps {
  exercise: ExerciseSuggestionOutput;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const instructionsList = exercise.instructions
    ?.split("\n")
    .map((item) => item.trim())
    .filter((item) => item && item.length > 0) || [];

  const motivationalMessages = [
    "¡Tu fuerza interior brilla! 💪✨",
    "Cada movimiento te hace más fuerte 🌟",
    "Tu cuerpo es capaz de cosas increíbles 🏃‍♀️",
    "¡Empodérate con cada repetición! 🔥",
  ];

  const randomMessage = motivationalMessages[
    Math.floor(Math.random() * motivationalMessages.length)
  ];

  return (
    <ContentCard
      title={exercise.exerciseName || "Ejercicio Sugerido"}
      subtitle="Ejercicio personalizado"
      description={exercise.benefits}
      icon="💪"
      variant="info"
    >
      {/* Mensaje motivacional */}
      <View style={styles.motivationContainer}>
        <View style={styles.motivationCard}>
          <ThemedText type="defaultItalic" style={styles.motivationText}>
            {randomMessage}
          </ThemedText>
        </View>
      </View>

      {instructionsList.length > 0 && (
        <ContentSection title="Cómo realizarlo" icon="📋">
          <ContentList items={instructionsList} type="numbered" />
        </ContentSection>
      )}

      {exercise.benefits && (
        <ContentSection title="Beneficios para ti" icon="✨">
          <ContentText variant="highlight">
            {exercise.benefits}
          </ContentText>
        </ContentSection>
      )}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  motivationContainer: {
    marginBottom: 16,
  },
  motivationCard: {
    backgroundColor: "#fce7f3",
    borderColor: "#f472b6",
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  motivationText: {
    color: "#be185d",
    textAlign: "center",
    fontSize: 14,
  },
}); 