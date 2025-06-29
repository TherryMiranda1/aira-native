import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "../../components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Ritual } from "@/services/api/ritual.service";

interface RitualItemProps {
  ritual: Ritual;
  categoryColors: string[];
  categoryLabel: string;
  onPress: (ritual: Ritual) => void;
  onSchedule?: (ritualId: string, ritualTitle: string) => void;
}

export const RitualItem = ({
  ritual,
  categoryColors,
  categoryLabel,
  onPress,
  onSchedule,
}: RitualItemProps) => {
  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case "bajo":
        return "#10B981";
      case "medio":
        return "#F59E0B";
      case "alto":
        return "#EF4444";
      default:
        return AiraColors.mutedForeground;
    }
  };

  const getEnergyLabel = (energy: string) => {
    switch (energy) {
      case "bajo":
        return "Energía Baja";
      case "medio":
        return "Energía Media";
      case "alto":
        return "Energía Alta";
      default:
        return energy;
    }
  };

  const getMomentLabel = (moment: string) => {
    switch (moment) {
      case "manana":
        return "Mañana";
      case "mediodia":
        return "Mediodía";
      case "tarde":
        return "Tarde";
      case "noche":
        return "Noche";
      case "cualquier-momento":
        return "Cualquier momento";
      default:
        return moment;
    }
  };

  const getMomentIcon = (moment: string): keyof typeof Ionicons.glyphMap => {
    switch (moment) {
      case "manana":
        return "sunny";
      case "mediodia":
        return "sunny";
      case "tarde":
        return "partly-sunny";
      case "noche":
        return "moon";
      case "cualquier-momento":
        return "star";
      default:
        return "time";
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(ritual)}
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
          <ThemedText style={styles.ritualTitle} numberOfLines={1}>
            {ritual.titulo}
          </ThemedText>
          <ThemedText style={styles.ritualDescription} numberOfLines={2}>
            {ritual.descripcion}
          </ThemedText>
          
          <View style={styles.metadataContainer}>
            {/* Energy Badge */}
            {ritual.nivel_energia && (
              <View style={styles.energyBadge}>
                <View 
                  style={[
                    styles.energyDot, 
                    { backgroundColor: getEnergyColor(ritual.nivel_energia) }
                  ]}
                />
                <ThemedText style={styles.energyText}>
                  {getEnergyLabel(ritual.nivel_energia)}
                </ThemedText>
              </View>
            )}
            
            {/* Duration Badge */}
            {ritual.duracion_total && (
              <View style={styles.durationBadge}>
                <Ionicons name="time" size={10} color={AiraColors.mutedForeground} />
                <ThemedText style={styles.durationText}>
                  {ritual.duracion_total}
                </ThemedText>
              </View>
            )}

            {/* Moment Badge */}
            {ritual.momento_recomendado && (
              <View style={styles.momentBadge}>
                <Ionicons 
                  name={getMomentIcon(ritual.momento_recomendado)} 
                  size={10} 
                  color={AiraColors.accent} 
                />
                <ThemedText style={styles.momentText}>
                  {getMomentLabel(ritual.momento_recomendado)}
                </ThemedText>
              </View>
            )}
            
            {/* Steps Count */}
            {ritual.pasos && ritual.pasos.length > 0 && (
              <View style={styles.stepsBadge}>
                <Ionicons name="list" size={10} color={AiraColors.primary} />
                <ThemedText style={styles.stepsText}>
                  {ritual.pasos.length} pasos
                </ThemedText>
              </View>
            )}
            
            {/* Popularity Badge */}
            {ritual.popularidad > 0 && (
              <View style={styles.popularityBadge}>
                <Ionicons name="heart" size={10} color={AiraColors.accent} />
                <ThemedText style={styles.popularityText}>
                  {ritual.popularidad}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          {onSchedule && (
            <TouchableOpacity
              style={styles.scheduleButton}
              onPress={(e) => {
                e.stopPropagation();
                onSchedule(ritual.id, ritual.titulo);
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons
                name="calendar-outline"
                size={18}
                color={AiraColors.primary}
              />
            </TouchableOpacity>
          )}
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
  ritualTitle: {
    fontSize: 16,
     
    color: AiraColors.foreground,
    lineHeight: 20,
    marginBottom: 4,
  },
  ritualDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 18,
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  energyBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  energyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  energyText: {
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
  momentBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  momentText: {
    fontSize: 10,
    color: AiraColors.accent,
     
  },
  stepsBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stepsText: {
    fontSize: 10,
    color: AiraColors.primary,
     
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scheduleButton: {
    padding: 8,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
}); 