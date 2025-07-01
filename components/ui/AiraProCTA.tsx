import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import Purchases, { PurchasesOffering } from "react-native-purchases";
import { presentPaywall } from "@/utils/payments";

interface AiraProCTAProps {
  onPress?: () => void;
}

export const AiraProCTA: React.FC<AiraProCTAProps> = () => {
  const [onboardingOffering, setOnboardingOffering] =
    useState<PurchasesOffering | null>(null);

  useEffect(() => {
    const fetchOfferings = async () => {
      const offerings = await Purchases.getOfferings();
      const result = offerings.all["onboarding"];
      console.log(result);
      setOnboardingOffering(result);
    };
    fetchOfferings();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.discountBadge}>
          <ThemedText type="defaultSemiBold" style={styles.discountText}>
            -50% 🔥
          </ThemedText>
        </View>
        <Ionicons name="star" size={28} color="#fbbf24" />
      </View>

      <ThemedText type="title" style={styles.title}>
        Desbloquea Aira Pro
      </ThemedText>

      <ThemedText type="default" style={styles.subtitle}>
        Acceso ilimitado a planes personalizados, recetas exclusivas y mucho más
      </ThemedText>

      <View style={styles.features}>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <ThemedText type="default" style={styles.featureText}>
            Planes ilimitados
          </ThemedText>
        </View>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <ThemedText type="default" style={styles.featureText}>
            Recetas premium
          </ThemedText>
        </View>
        <View style={styles.feature}>
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <ThemedText type="default" style={styles.featureText}>
            Sin anuncios
          </ThemedText>
        </View>
      </View>

      <Button
        text="Comenzar mi transformación ✨"
        size="lg"
        fullWidth
        onPress={() => {
          if (onboardingOffering) {
            presentPaywall(onboardingOffering);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  discountBadge: {
    backgroundColor: AiraColors.primary,
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  subtitle: {
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.7),
    marginBottom: 16,
    lineHeight: 20,
  },
  features: {
    marginBottom: 20,
    gap: 8,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
  },
  featureText: {
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.8),
    marginLeft: 8,
    fontSize: 13,
  },
});
