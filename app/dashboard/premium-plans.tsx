import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { Topbar } from "@/components/ui/Topbar";
import { PremiumCarousel } from "@/components/ui/PremiumCarousel";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { PageView } from "@/components/ui/PageView";

const premiumFeatures = [
  {
    id: "premium",
    title: "Aira Premium",
    description: "Tu compañera completa de bienestar",
    icon: "sparkles" as const,
    gradient: ["#8B5CF6", "#A855F7"],
    benefits: [
      "Chat con Aira, tu compañera personal",
      "Recetas y ejercicios ilimitados",
      "Planes personalizados completos",
      "Descarga contenido en PDF",
      "Métricas ilimitadas",
      "Historial completo sin límites",
      "Rutinas de Aira y comunidad",
      "Añade contenido al calendario",
      "Personaliza el carácter de Aira",
    ],
    isHighlighted: true,
  },
  {
    id: "free",
    title: "Plan Gratuito",
    description: "Comienza tu viaje de bienestar",
    icon: "heart-outline" as const,
    gradient: ["#64748B", "#94A3B8"],
    benefits: [
      "Planificar tu día",
      "Recetas y ejercicios limitados",
      "Mini retos y rituales limitados",
      "Una métrica (como peso)",
      "Historial máximo de un mes",
    ],
    isHighlighted: false,
  },
];

export default function PremiumPlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState("premium");

  return (
    <PageView>
      <Topbar title="Suscribirse" showBackButton onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <PremiumCarousel
          features={premiumFeatures}
          onFeaturePress={(feature) => setSelectedPlan(feature.id)}
          selectedPlan={selectedPlan}
        />

        {/* Subscribe Button */}
        <View style={styles.subscribeSection}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={() => router.push("/default-paywall")}
          >
            <LinearGradient
              colors={[
                AiraColors.foreground,
                AiraColorsWithAlpha.foregroundWithOpacity(0.9),
              ]}
              style={styles.subscribeGradient}
            >
              <ThemedText style={styles.subscribeText}>
                Únete a Aira Premium
              </ThemedText>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={AiraColors.background}
              />
            </LinearGradient>
          </TouchableOpacity>

          <ThemedText style={styles.disclaimerText}>
            Cancela cuando quieras. Tu bienestar, tu decisión. Se aplicarán
            términos y condiciones.
          </ThemedText>
        </View>
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  heroSection: {
    padding: 32,
    alignItems: "center",
    marginBottom: 8,
  },
  heroContent: {
    alignItems: "center",
  },
  heroTitle: {
    fontSize: 32,
    color: AiraColors.background,
    marginTop: 16,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    textAlign: "center",
    lineHeight: 24,
  },
  pricingSection: {
    padding: 16,
    marginTop: 16,
  },
  pricingHeader: {
    marginBottom: 24,
  },
  pricingTitle: {
    fontSize: 24,
     
    marginBottom: 8,
  },
  pricingDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  planCardSelected: {
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  planGradient: {
    padding: 20,
    position: "relative",
  },
  planGradientSelected: {
    borderWidth: 2,
    borderColor: AiraColors.primary,
  },
  popularBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 12,
    color: AiraColors.background,
    fontWeight: "600",
  },
  planHeader: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    color: AiraColors.background,
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 28,
    color: AiraColors.background,
    marginRight: 4,
  },
  planPeriod: {
    fontSize: 16,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.7),
  },
  planDescription: {
    fontSize: 14,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.8),
    lineHeight: 20,
  },
  planFeatures: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: AiraColors.background,
    flex: 1,
    lineHeight: 20,
  },
  selectedIndicator: {
    position: "absolute",
    top: 16,
    left: 16,
  },
  subscribeSection: {
    padding: 16,
    paddingBottom: 32,
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  subscribeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 12,
  },
  subscribeText: {
    fontSize: 18,
    color: AiraColors.background,
    fontWeight: "600",
  },
  disclaimerText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 16,
  },
});
