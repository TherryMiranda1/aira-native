import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ThemedText } from "../ThemedText";
import { AiraColors } from "../../constants/Colors";
import { AiraVariants } from "../../constants/Themes";
import { useChallenges } from "../../hooks/services/useChallenges";

interface DailySuggestionProps {
  title?: string;
  subtitle?: string;
  onChallengeClick?: (challenge: any) => void;
}

export const DailySuggestion = ({
  title = "Tu mini reto del día",
  subtitle = "Un pequeño paso hacia tu bienestar",
  onChallengeClick,
}: DailySuggestionProps) => {
  const router = useRouter();
  const [challenge, setChallenge] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getRandomChallenge } = useChallenges();

  const loadRandomChallenge = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const randomChallenge = await getRandomChallenge();

      if (randomChallenge) {
        setChallenge(randomChallenge);
      } else {
        setError("No hay mini retos disponibles");
      }
    } catch (err) {
      console.error("Error loading daily challenge:", err);
      setError("Error al cargar el mini reto");
    } finally {
      setLoading(false);
    }
  }, [getRandomChallenge]);

  useEffect(() => {
    loadRandomChallenge();
  }, [loadRandomChallenge]);

  const handleChallengeClick = useCallback(() => {
    if (!challenge) return;

    if (onChallengeClick) {
      onChallengeClick(challenge);
      return;
    }

    router.push(`/dashboard/inspiration/mini-retos?id=${challenge.id}`);
  }, [challenge, onChallengeClick, router]);

  const handleRefresh = useCallback(() => {
    loadRandomChallenge();
  }, [loadRandomChallenge]);

  const getEmojiForType = (type: string) => {
    switch (type) {
      case "Momento suave":
        return "☕";
      case "Movimiento gentil":
        return "🌸";
      case "Nutrición amorosa":
        return "🥗";
      case "Reflexión breve":
        return "💭";
      default:
        return "✨";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return { bg: "rgba(16, 185, 129, 0.1)", text: "#059669" };
      case "intermedio":
        return { bg: "rgba(245, 158, 11, 0.1)", text: "#D97706" };
      case "avanzado":
        return { bg: "rgba(239, 68, 68, 0.1)", text: "#DC2626" };
      default:
        return { bg: "rgba(107, 114, 128, 0.1)", text: "#6B7280" };
    }
  };

  if (loading) {
    return (
      <View style={styles.card}>
        <View style={styles.suggestionContainer}>
          <View style={styles.emojiContainer}>
            <ThemedText style={styles.suggestionEmoji}>⏳</ThemedText>
          </View>
          <View style={styles.suggestionContent}>
            <ThemedText style={styles.loadingText}>
              Cargando tu mini reto del día...
            </ThemedText>
          </View>
        </View>
      </View>
    );
  }

  if (error || !challenge) {
    return (
      <View style={styles.card}>
        <View style={styles.suggestionContainer}>
          <View style={styles.emojiContainer}>
            <ThemedText style={styles.suggestionEmoji}>❌</ThemedText>
          </View>
          <View style={styles.suggestionContent}>
            <ThemedText style={styles.errorText}>
              {error || "No se pudo cargar tu mini reto del día"}
            </ThemedText>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <ThemedText style={styles.retryButtonText}>
                Intentar de nuevo
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const difficultyColors = getDifficultyColor(challenge.dificultad);

  return (
    <View style={styles.card}>
      <View style={styles.suggestionContainer}>
        <View style={styles.emojiContainer}>
          <ThemedText style={styles.suggestionEmoji}>
            {getEmojiForType(challenge.categoria || "default")}
          </ThemedText>
          <TouchableOpacity
            style={styles.refreshIconButton}
            onPress={handleRefresh}
          >
            <Ionicons
              name="refresh-outline"
              size={16}
              color={AiraColors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.suggestionContent}>
          <View style={styles.badgeContainer}>
            <View style={styles.suggestionTypeContainer}>
              <ThemedText style={styles.suggestionType}>{title}</ThemedText>
            </View>
            {challenge.dificultad && (
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: difficultyColors.bg },
                ]}
              >
                <ThemedText
                  style={[
                    styles.difficultyText,
                    { color: difficultyColors.text },
                  ]}
                >
                  {challenge.dificultad}
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText style={styles.suggestionTitle}>
            {challenge.title}
          </ThemedText>

          <ThemedText style={styles.suggestionDescription} numberOfLines={2}>
            {challenge.description}
          </ThemedText>

          <TouchableOpacity
            style={styles.suggestionButton}
            onPress={handleChallengeClick}
          >
            <Ionicons name="star-outline" size={16} color="#4F46E5" />
            <ThemedText style={styles.suggestionButtonText}>
              Aceptar el reto ✨
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      {subtitle && (
        <ThemedText style={styles.subtitleText}>{subtitle}</ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
  },
  suggestionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  emojiContainer: {
    position: "relative",
    marginRight: 16,
  },
  suggestionEmoji: {
    fontSize: 40,
  },
  refreshIconButton: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    backgroundColor: AiraColors.background,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  suggestionContent: {
    flex: 1,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionTypeContainer: {
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  suggestionType: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
     
  },
  difficultyBadge: {
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  difficultyText: {
    fontSize: 10,
     
  },
  suggestionTitle: {
    fontSize: 16,
    color: AiraColors.foreground,
    marginBottom: 8,
     
  },
  suggestionDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 12,
    lineHeight: 20,
  },
  suggestionButton: {
    backgroundColor: AiraColors.airaLavender,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  suggestionButtonText: {
    color: "#4F46E5",
    fontSize: 14,
     
  },
  subtitleText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginTop: 12,
  },
  loadingText: {
    fontSize: 16,
    color: AiraColors.foreground,
    textAlign: "center",
  },
  errorText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: AiraColors.secondary,
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    fontSize: 14,
    color: AiraColors.foreground,
     
  },
});
