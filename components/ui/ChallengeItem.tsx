import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Challenge } from "@/services/api/challenge.service";

interface ChallengeItemProps {
  challenge: Challenge;
  categoryColors: string[];
  categoryLabel: string;
  onPress: (challenge: Challenge) => void;
}

export const ChallengeItem = ({
  challenge,
  categoryColors,
  categoryLabel,
  onPress,
}: ChallengeItemProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return AiraColors.primary;
      case "intermedio":
        return "#F59E0B";
      case "avanzado":
        return "#EF4444";
      default:
        return AiraColors.mutedForeground;
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return "Fácil";
      case "intermedio":
        return "Intermedio";
      case "avanzado":
        return "Avanzado";
      default:
        return difficulty;
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(challenge)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icon */}
        <LinearGradient
          colors={categoryColors as [ColorValue, ColorValue]}
          style={styles.iconContainer}
        >
          <Ionicons name="trophy" size={16} color="white" />
        </LinearGradient>

        {/* Content */}
        <View style={styles.textContainer}>
          <ThemedText style={styles.challengeTitle} numberOfLines={1}>
            {challenge.title}
          </ThemedText>
          <ThemedText style={styles.challengeDescription} numberOfLines={2}>
            {challenge.description}
          </ThemedText>
          
          <View style={styles.metadataContainer}>
            {/* Difficulty Badge */}
            <View style={styles.difficultyBadge}>
              <View 
                style={[
                  styles.difficultyDot, 
                  { backgroundColor: getDifficultyColor(challenge.dificultad) }
                ]}
              />
              <ThemedText style={styles.difficultyText}>
                {getDifficultyLabel(challenge.dificultad)}
              </ThemedText>
            </View>
            
            {/* Duration Badge */}
            {challenge.duration && (
              <View style={styles.durationBadge}>
                <Ionicons name="time" size={10} color={AiraColors.mutedForeground} />
                <ThemedText style={styles.durationText}>
                  {challenge.duration}
                </ThemedText>
              </View>
            )}
            
            {/* Popularity Badge */}
            {challenge.popularidad > 0 && (
              <View style={styles.popularityBadge}>
                <Ionicons name="heart" size={10} color={AiraColors.accent} />
                <ThemedText style={styles.popularityText}>
                  {challenge.popularidad}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Ionicons
            name="chevron-forward"
            size={16}
            color={AiraColors.mutedForeground}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 8,
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
     
    color: AiraColors.foreground,
    lineHeight: 20,
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 18,
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  difficultyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
     
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 10,
    color: AiraColors.mutedForeground,
     
  },
  popularityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  popularityText: {
    fontSize: 10,
    color: AiraColors.accent,
     
  },
  arrowContainer: {
    padding: 4,
  },
}); 