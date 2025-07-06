import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
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
    id: "experiencia",
    title: "Experiencia mejorada",
    description: "Disfruta de Aira sin interrupciones",
    icon: "star" as const,
    gradient: ["#8B5CF6", "#A855F7"],
    benefits: [
      "Mitad de anuncios en Para ti y Siguiendo",
      "Un poco más boost en respuestas",
      "Editar publicación",
      "Publicaciones más largas",
      "Reproducción de vídeo en segundo plano",
      "Descargar vídeos",
    ],
    isHighlighted: false,
  },
  {
    id: "grok-ai",
    title: "Grok AI",
    description: "Inteligencia artificial avanzada",
    icon: "flash" as const,
    gradient: ["#F59E0B", "#F97316"],
    benefits: [
      "Límites de uso más altos",
      "Desbloquear DeepSearch y Pensar",
      "Acceso anticipado a nuevas funciones",
    ],
    isHighlighted: true,
  },
  {
    id: "centro-creador",
    title: "Centro del creador",
    description: "Herramientas para creadores de contenido",
    icon: "create" as const,
    gradient: ["#10B981", "#059669"],
    benefits: [
      "Escribir Artículos",
      "Recibe dinero por postear",
      "Suscripciones para creadores",
    ],
    isHighlighted: false,
  },
];

const pricingPlans = [
  {
    id: "monthly",
    name: "Plan Mensual",
    price: "$30.000,00",
    period: "/mes",
    description: "Perfecto para probar todas las funciones",
    features: [
      "Todos los beneficios premium",
      "Soporte prioritario",
      "Cancelación en cualquier momento",
    ],
    gradient: ["#6366F1", "#8B5CF6"],
  },
  {
    id: "yearly",
    name: "Plan Anual",
    price: "$300.000,00",
    period: "/año",
    description: "El mejor valor - ahorra 2 meses",
    features: [
      "Todos los beneficios premium",
      "Soporte prioritario",
      "Descuento del 17%",
      "Facturación anual",
    ],
    gradient: ["#059669", "#10B981"],
    isPopular: true,
  },
];

export default function PremiumPlansScreen() {
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handleFeaturePress = (feature: any) => {
    Alert.alert(
      feature.title,
      `Descubre más sobre: ${feature.description}\n\n${feature.benefits.join(
        "\n• "
      )}`,
      [{ text: "Entendido", style: "default" }]
    );
  };

  const handleSubscribe = () => {
    const plan = pricingPlans.find((p) => p.id === selectedPlan);
    Alert.alert("Suscripción", `¿Confirmar suscripción al ${plan?.name}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Suscribirse",
        style: "default",
        onPress: () => {
          Alert.alert("¡Gracias!", "Tu suscripción está siendo procesada.");
        },
      },
    ]);
  };

  return (
    <PageView>
      <Topbar title="Suscribirse" showBackButton onBack={() => router.back()} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Hero */}
        {/* <LinearGradient
          colors={["#1E1B4B", "#312E81", "#4338CA"]}
          style={styles.heroSection}
        >
          <View style={styles.heroContent}>
            <Ionicons name="diamond" size={48} color={AiraColors.background} />
            <ThemedText type="title" style={styles.heroTitle}>
              Aira Premium
            </ThemedText>
            <ThemedText style={styles.heroSubtitle}>
              Desbloquea todo el potencial de tu bienestar personal
            </ThemedText>
          </View>
        </LinearGradient> */}

        {/* Premium Features Carousel */}
        <PremiumCarousel
          features={premiumFeatures}
          onFeaturePress={handleFeaturePress}
        />

        {/* Pricing Plans */}
        {/* <View style={styles.pricingSection}>
          <View style={styles.pricingHeader}>
            <ThemedText type="subtitle" style={styles.pricingTitle}>
              Elige tu plan
            </ThemedText>
            <ThemedText style={styles.pricingDescription}>
              Selecciona la opción que mejor se adapte a ti
            </ThemedText>
          </View>

          <View style={styles.plansContainer}>
            {pricingPlans.map((plan) => (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  selectedPlan === plan.id && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan.id)}
              >
                <LinearGradient
                  colors={plan.gradient as [string, string, string]}
                  style={[
                    styles.planGradient,
                    selectedPlan === plan.id && styles.planGradientSelected,
                  ]}
                >
                  {plan.isPopular && (
                    <View style={styles.popularBadge}>
                      <ThemedText style={styles.popularText}>
                        Más Popular
                      </ThemedText>
                    </View>
                  )}

                  <View style={styles.planHeader}>
                    <ThemedText type="defaultSemiBold" style={styles.planName}>
                      {plan.name}
                    </ThemedText>
                    <View style={styles.priceContainer}>
                      <ThemedText type="title" style={styles.planPrice}>
                        {plan.price}
                      </ThemedText>
                      <ThemedText style={styles.planPeriod}>
                        {plan.period}
                      </ThemedText>
                    </View>
                    <ThemedText style={styles.planDescription}>
                      {plan.description}
                    </ThemedText>
                  </View>

                  <View style={styles.planFeatures}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={AiraColors.background}
                        />
                        <ThemedText style={styles.featureText}>
                          {feature}
                        </ThemedText>
                      </View>
                    ))}
                  </View>

                  {selectedPlan === plan.id && (
                    <View style={styles.selectedIndicator}>
                      <Ionicons
                        name="checkmark-circle"
                        size={24}
                        color={AiraColors.background}
                      />
                    </View>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* Subscribe Button */}
        <View style={styles.subscribeSection}>
          <TouchableOpacity
            style={styles.subscribeButton}
            onPress={handleSubscribe}
          >
            <LinearGradient
              colors={["#8B5CF6", "#A855F7"]}
              style={styles.subscribeGradient}
            >
              <ThemedText style={styles.subscribeText}>
                Empieza ahora
                {pricingPlans.find((p) => p.id === selectedPlan)?.price}
              </ThemedText>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={AiraColors.background}
              />
            </LinearGradient>
          </TouchableOpacity>

          <ThemedText style={styles.disclaimerText}>
            Puedes cancelar en cualquier momento. Se aplicarán términos y
            condiciones.
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
    color: AiraColors.foreground,
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
