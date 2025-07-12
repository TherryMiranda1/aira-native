import React, { useState, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "../../constants/Colors";
import { AiraVariants } from "../../constants/Themes";
import { useEvents } from "../../hooks/services/useEvents";
import { useToastHelpers } from "../ui/ToastSystem";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

type MoodType =
  | "radiante"
  | "tranquila"
  | "reflexiva"
  | "cansada"
  | "sensible"
  | "neutral";

interface MoodOption {
  id: MoodType;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  textColor: string;
  borderColor: string;
  description: string;
}

const moodOptions: MoodOption[] = [
  {
    id: "radiante",
    label: "Radiante",
    icon: "sunny-outline",
    color: AiraColorsWithAlpha.sageWithOpacity(0.2),
    textColor: "#CA8A04",
    borderColor: "#FEF08A",
    description: "Me siento llena de energía",
  },
  {
    id: "tranquila",
    label: "Tranquila",
    icon: "happy-outline",
    color: AiraColorsWithAlpha.lavenderWithOpacity(0.2),
    textColor: "#059669",
    borderColor: "#A7F3D0",
    description: "En paz conmigo misma",
  },
  {
    id: "reflexiva",
    label: "Reflexiva",
    icon: "cloud-outline",
    color: AiraColorsWithAlpha.coralWithOpacity(0.2),
    textColor: "#7C3AED",
    borderColor: "#DDD6FE",
    description: "Pensando en mí",
  },
  {
    id: "cansada",
    label: "Cansada",
    icon: "moon-outline",
    color: AiraColorsWithAlpha.sageWithOpacity(0.2),
    textColor: "#B45309",
    borderColor: "#FDE68A",
    description: "Necesito descansar",
  },
  {
    id: "sensible",
    label: "Sensible",
    icon: "heart-outline",
    color: AiraColorsWithAlpha.destructiveWithOpacity(0.2),
    textColor: "#BE185D",
    borderColor: "#FECDD3",
    description: "Sintiendo mucho hoy",
  },
  {
    id: "neutral",
    label: "Neutral",
    icon: "remove-outline",
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.2),
    textColor: "#4B5563",
    borderColor: "#E5E7EB",
    description: "Día común",
  },
];

interface MoodTrackerProps {
  title?: string;
  onMoodSaved?: (mood: MoodType) => void;
}

export const MoodTracker = ({
  title = "¿Cómo te sientes ahora mismo?",
  onMoodSaved,
}: MoodTrackerProps) => {
  const { user } = useUser();
  const { createEvent } = useEvents();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [savingMood, setSavingMood] = useState(false);
  const backgroundColor = useThemeColor({}, "background");

  const handleMoodSelection = useCallback(
    async (moodId: MoodType) => {
      if (!user?.id) {
        showErrorToast(
          "Error",
          "Debes estar autenticada para registrar tu estado emocional"
        );
        return;
      }

      setSelectedMood(moodId);
      setSavingMood(true);

      try {
        const moodLabels = {
          radiante: "Radiante",
          tranquila: "Tranquila",
          reflexiva: "Reflexiva",
          cansada: "Cansada",
          sensible: "Sensible",
          neutral: "Neutral",
        };

        const moodColors = {
          radiante: "yellow",
          tranquila: "green",
          reflexiva: "purple",
          cansada: "orange",
          sensible: "pink",
          neutral: "gray",
        };

        await createEvent({
          eventType: "mood",
          moodData: {
            mood: moodId,
          },
          title: `Estado emocional: ${moodLabels[moodId]}`,
          startTime: new Date().toISOString(),
          category: "selfcare",
          priority: "low",
          color: moodColors[moodId] as any,
          notes: "Registrado desde el mood tracker",
          recurrence: { type: "none" },
          metadata: {
            source: "mood-tracker",
            timezone: "America/Mexico_City",
          },
        });

        showSuccessToast(
          "Estado emocional registrado",
          `Te sientes ${moodLabels[
            moodId
          ].toLowerCase()}. Gracias por compartir conmigo 💕`
        );

        onMoodSaved?.(moodId);
      } catch (error) {
        console.error("Error saving mood:", error);
        showErrorToast(
          "Error al registrar",
          "No pudimos guardar tu estado emocional. Inténtalo de nuevo."
        );
        setSelectedMood("");
      } finally {
        setSavingMood(false);
      }
    },
    [user?.id, createEvent, onMoodSaved, showSuccessToast, showErrorToast]
  );

  return (
    <ThemedView style={styles.card}>
      <ThemedText style={styles.cardTitle}>{title}</ThemedText>

      <View style={styles.moodGrid}>
        {moodOptions.map((mood) => {
          const isSelected = selectedMood === mood.id;
          const isDisabled = savingMood;

          return (
            <TouchableOpacity
              key={mood.id}
              style={[
                styles.moodCard,
                {
                  backgroundColor,
                  borderColor: isSelected ? mood.textColor : mood.borderColor,
                  borderWidth: isSelected ? 2 : 1,
                  opacity: isDisabled ? 0.5 : 1,
                },
              ]}
              onPress={() => !isDisabled && handleMoodSelection(mood.id)}
              disabled={isDisabled}
              activeOpacity={0.7}
            >
              <Ionicons name={mood.icon} size={24} color={mood.textColor} />
              <ThemedText
                type="defaultSemiBold"
                style={[styles.moodLabel, { color: mood.textColor }]}
              >
                {mood.label}
              </ThemedText>
              <ThemedText
                style={[styles.moodDescription, { color: mood.textColor }]}
                numberOfLines={2}
              >
                {mood.description}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedMood && !savingMood && (
        <View style={styles.moodFeedback}>
          <ThemedText type="defaultItalic" style={styles.moodFeedbackText}>
            Gracias por compartir conmigo. Es válido sentirse así, y estoy aquí
            para apoyarte 💕
          </ThemedText>
        </View>
      )}

      {savingMood && (
        <View style={styles.moodFeedback}>
          <ThemedText style={styles.moodFeedbackText}>
            Guardando tu estado emocional... ✨
          </ThemedText>
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moodCard: {
    width: "48%",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  moodLabel: {
    fontSize: 14,
    marginTop: 8,
    marginBottom: 4,
  },
  moodDescription: {
    fontSize: 12,
    textAlign: "center",
    opacity: 0.8,
  },
  moodFeedback: {
    marginTop: 12,
    padding: 12,
    borderRadius: AiraVariants.cardRadius,
  },
  moodFeedbackText: {
    fontSize: 14,
    textAlign: "center",
  },
});
