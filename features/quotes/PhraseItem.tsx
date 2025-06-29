import React from "react";
import { View, TouchableOpacity, StyleSheet, ColorValue } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Phrase } from "@/services/api/phrase.service";

interface PhraseItemProps {
  phrase: Phrase;
  categoryColors: string[];
  categoryLabel: string;
  onPress: (phrase: Phrase) => void;
}

export const PhraseItem = ({
  phrase,
  categoryColors,
  categoryLabel,
  onPress,
}: PhraseItemProps) => {
  const getMomentIcon = (moment?: string) => {
    switch (moment) {
      case "manana":
        return "sunny";
      case "dia":
        return "sunny";
      case "tarde":
        return "partly-sunny";
      case "noche":
        return "moon";
      default:
        return "star";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(phrase)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {/* Icon */}
        <LinearGradient
          colors={categoryColors as [ColorValue, ColorValue]}
          style={styles.iconContainer}
        >
          <Ionicons name="sparkles" size={16} color="white" />
        </LinearGradient>

        {/* Content */}
        <View style={styles.textContainer}>
          <ThemedText style={styles.phraseText} numberOfLines={2}>
            &quot;{phrase.frase}&quot;
          </ThemedText>

          <View style={styles.metadataContainer}>
            {phrase.momento_recomendado && (
              <View style={styles.momentBadge}>
                <Ionicons
                  name={getMomentIcon(phrase.momento_recomendado)}
                  size={10}
                  color={AiraColors.mutedForeground}
                />
              </View>
            )}

            {phrase.popularidad > 0 && (
              <View style={styles.popularityBadge}>
                <Ionicons name="heart" size={10} color={AiraColors.accent} />
                <ThemedText style={styles.popularityText}>
                  {phrase.popularidad}
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
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  phraseText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
    marginBottom: 4,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  momentBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
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
