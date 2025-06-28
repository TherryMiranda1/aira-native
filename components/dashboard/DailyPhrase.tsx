import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "../ThemedText";
import { AiraColors } from "../../constants/Colors";
import { AiraVariants } from "../../constants/Themes";
import { usePhrases } from "../../hooks/services/usePhrases";

interface DailyPhraseProps {
  showRefreshButton?: boolean;
}

export const DailyPhrase = ({ showRefreshButton = true }: DailyPhraseProps) => {
  const [currentPhrase, setCurrentPhrase] = useState<any>(null);
  const [localLoading, setLocalLoading] = useState(true);

  const { phrases, loading, error, getRandomPhrase, fetchRandomPhrases } =
    usePhrases({
      filters: { activo: true },
      autoFetch: true,
    });

  useEffect(() => {
    if (phrases.length > 0) {
      const randomPhrase = getRandomPhrase();
      setCurrentPhrase(randomPhrase);
      setLocalLoading(false);
    }
  }, [phrases, getRandomPhrase]);

  const refreshPhrase = useCallback(async () => {
    setLocalLoading(true);
    try {
      await fetchRandomPhrases(10);
    } catch (error) {
      console.error("Error refreshing phrase:", error);
      setLocalLoading(false);
    }
  }, [fetchRandomPhrases]);

  const selectNewPhrase = useCallback(() => {
    if (phrases.length > 1) {
      let newPhrase;
      do {
        newPhrase = getRandomPhrase();
      } while (newPhrase?.id === currentPhrase?.id && phrases.length > 1);
      setCurrentPhrase(newPhrase);
    }
  }, [phrases, getRandomPhrase, currentPhrase]);

  const isLoading = loading || localLoading;

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]}
        start={{ x: 0.3, y: 0 }}
        style={styles.card}
      >
        <View style={styles.sparkleContainer}>
          <Ionicons
            name="sparkles-outline"
            size={28}
            color={AiraColors.primary}
          />
        </View>
        <ThemedText style={styles.loadingMessage}>
          Cargando tu frase inspiradora...
        </ThemedText>
      </LinearGradient>
    );
  }

  if (error || !currentPhrase) {
    return (
      <LinearGradient
        colors={["#0f2027", "#203a43", "#2c5364"]}
        start={{ x: 0.3, y: 0 }}
        style={styles.card}
      >
        <View style={styles.sparkleContainer}>
          <Ionicons name="heart-outline" size={28} color={AiraColors.primary} />
        </View>
        <ThemedText style={styles.errorMessage}>
          {error || "No se pudo cargar tu frase de inspiración"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={refreshPhrase}>
          <ThemedText style={styles.retryButtonText}>
            Intentar de nuevo
          </ThemedText>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={["#0f2027", "#203a43", "#2c5364"]}
      start={{ x: 0.3, y: 0 }}
      style={styles.card}
    >
      <View style={styles.headerContainer}>
        <View style={styles.sparkleContainer}>
          <Ionicons
            name="sparkles-outline"
            size={28}
            color={AiraColors.primary}
          />
        </View>
        {showRefreshButton && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={selectNewPhrase}
          >
            <Ionicons
              name="refresh-outline"
              size={20}
              color={AiraColors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      <ThemedText style={styles.dailyMessage}>
        &quot;{currentPhrase.frase}&quot;
      </ThemedText>

      {currentPhrase.autor && (
        <ThemedText style={styles.authorText}>
          — {currentPhrase.autor}
        </ThemedText>
      )}

      {currentPhrase.categoria && (
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <ThemedText style={styles.categoryText}>
              {currentPhrase.categoria}
            </ThemedText>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  sparkleContainer: {
    alignItems: "flex-start",
  },
  refreshButton: {
    padding: 4,
  },
  dailyMessage: {
    fontSize: 18,
    color: AiraColors.background,
    lineHeight: 26,
    textAlign: "left",
  },
  authorText: {
    fontSize: 14,
    color: AiraColors.background,
    fontStyle: "italic",
    marginTop: 8,
    opacity: 0.8,
  },
  categoryContainer: {
    marginTop: 12,
    alignItems: "flex-start",
  },
  categoryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 12,
    color: AiraColors.background,
     
  },
  loadingMessage: {
    fontSize: 18,
    color: AiraColors.background,
    lineHeight: 26,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: AiraColors.background,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: "center",
  },
  retryButtonText: {
    fontSize: 14,
    color: AiraColors.background,
     
  },
});
