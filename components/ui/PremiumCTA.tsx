import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

interface PremiumCTAProps {
  variant?: "compact" | "full";
}

export const PremiumCTA = ({ variant = "compact" }: PremiumCTAProps) => {
  const handlePress = () => {
    router.push("/dashboard/premium-plans");
  };

  if (variant === "compact") {
    return (
      <TouchableOpacity onPress={handlePress} style={styles.compactContainer}>
        <LinearGradient
          colors={["#8B5CF6", "#A855F7", "#F59E0B"]}
          style={styles.compactGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.compactContent}>
            <View style={styles.compactLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="diamond" size={24} color={AiraColors.background} />
              </View>
              <View style={styles.compactText}>
                <ThemedText type="defaultSemiBold" style={styles.compactTitle}>
                  Desbloquea Aira Premium
                </ThemedText>
                <ThemedText style={styles.compactSubtitle}>
                  Acceso completo a todas las funciones
                </ThemedText>
              </View>
            </View>
            <Ionicons 
              name="chevron-forward" 
              size={20} 
              color={AiraColors.background} 
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.fullContainer}>
      <LinearGradient
        colors={["#1E1B4B", "#312E81", "#4338CA"]}
        style={styles.fullGradient}
      >
        <View style={styles.fullContent}>
          <View style={styles.fullHeader}>
            <Ionicons name="diamond" size={32} color={AiraColors.background} />
            <ThemedText type="subtitle" style={styles.fullTitle}>
              Aira Premium
            </ThemedText>
          </View>
          
          <ThemedText style={styles.fullDescription}>
            Experimenta todo el potencial de Aira con funciones avanzadas de IA, 
            contenido exclusivo y una experiencia sin anuncios.
          </ThemedText>

          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Ionicons name="flash" size={16} color={AiraColors.background} />
              <ThemedText style={styles.featureText}>IA Avanzada</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="star" size={16} color={AiraColors.background} />
              <ThemedText style={styles.featureText}>Sin Anuncios</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="create" size={16} color={AiraColors.background} />
              <ThemedText style={styles.featureText}>Contenido Exclusivo</ThemedText>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="shield-checkmark" size={16} color={AiraColors.background} />
              <ThemedText style={styles.featureText}>Soporte Prioritario</ThemedText>
            </View>
          </View>

          <View style={styles.ctaButton}>
            <ThemedText style={styles.ctaText}>Ver Planes</ThemedText>
            <Ionicons name="arrow-forward" size={16} color={AiraColors.background} />
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  compactContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  compactGradient: {
    padding: 16,
  },
  compactContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  compactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  compactText: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    color: AiraColors.background,
    marginBottom: 2,
  },
  compactSubtitle: {
    fontSize: 12,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
  },
  fullContainer: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#1E1B4B",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fullGradient: {
    padding: 24,
  },
  fullContent: {
    alignItems: "center",
  },
  fullHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  fullTitle: {
    fontSize: 24,
    color: AiraColors.background,
  },
  fullDescription: {
    fontSize: 14,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 16,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: AiraColors.background,
    fontWeight: "500",
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  ctaText: {
    fontSize: 14,
    color: AiraColors.background,
    fontWeight: "600",
  },
}); 