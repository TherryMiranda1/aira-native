import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface InspirationItem {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  icon: keyof typeof Ionicons.glyphMap;
  href: string;
  badge?: string;
  features: string[];
  color: string[];
  estimatedTime: string;
  benefits: string[];
}

const { width } = Dimensions.get("window");

export default function InspirationCenterScreen() {
  const router = useRouter();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const inspirationItems: InspirationItem[] = [
    {
      id: "frases",
      title: "Frases Inspiradoras",
      description:
        "Descubre frases motivadoras y amorosas diseñadas para acompañarte en tu día a día y reforzar tu bienestar emocional.",
      shortDescription: "Motivación diaria que llega al corazón",
      icon: "heart",
      href: "/inspiration/frases",
      badge: "Nueva",
      features: [
        "Frases por categorías emocionales",
        "Contenido personalizado",
        "Recordatorios de autocompasión",
        "Mensajes para cada momento del día",
      ],
      benefits: [
        "Mejora el estado de ánimo",
        "Refuerza la autoestima",
        "Cultiva la motivación",
      ],
      color: ["#F472B6", "#FB7185"],
      estimatedTime: "1-2 min",
    },
    {
      id: "mini-retos",
      title: "Mini Retos de Bienestar",
      description:
        "Pequeños desafíos diarios que te ayudan a crear hábitos saludables de manera gradual y sin presión.",
      shortDescription: "Pequeños pasos, grandes cambios",
      icon: "star",
      href: "/inspiration/mini-retos",
      features: [
        "Retos adaptados a tu nivel",
        "Diversas categorías de bienestar",
        "Instrucciones paso a paso",
        "Seguimiento de progreso",
      ],
      benefits: [
        "Construye hábitos sostenibles",
        "Aumenta la confianza",
        "Mejora la disciplina amable",
      ],
      color: ["#FBBF24", "#F59E0B"],
      estimatedTime: "5-15 min",
    },
    {
      id: "rituales",
      title: "Rituales de Autocuidado",
      description:
        "Secuencias de actividades diseñadas para crear momentos especiales de conexión contigo misma y tu bienestar.",
      shortDescription: "Momentos sagrados para ti",
      icon: "sparkles",
      href: "/inspiration/rituales",
      badge: "Favorito",
      features: [
        "Rituales para diferentes momentos",
        "Pasos detallados y guiados",
        "Niveles de energía adaptables",
        "Beneficios emocionales claros",
      ],
      benefits: [
        "Reduce el estrés",
        "Mejora la conexión personal",
        "Crea espacios de calma",
      ],
      color: ["#A78BFA", "#818CF8"],
      estimatedTime: "10-30 min",
    },
  ];

  const stats = [
    { icon: "sparkles" as keyof typeof Ionicons.glyphMap, label: "Frases inspiradoras", value: "500+" },
    { icon: "heart" as keyof typeof Ionicons.glyphMap, label: "Corazones tocados", value: "98%" },
    { icon: "bulb" as keyof typeof Ionicons.glyphMap, label: "Momentos de claridad", value: "∞" },
  ];

  const handleCardPress = (item: InspirationItem) => {
    console.log("Navegando a:", item.href);
    // Implementar navegación real
    if (item.id === "frases") {
      router.push("/inspiration/frases");
    } else if (item.id === "mini-retos") {
      router.push("/inspiration/mini-retos");
    } else if (item.id === "rituales") {
      router.push("/inspiration/rituales");
    }
  };

  const renderInspirationCard = (item: InspirationItem, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.inspirationCard,
        hoveredCard === item.id && styles.hoveredCard,
      ]}
      onPress={() => handleCardPress(item)}
      onPressIn={() => setHoveredCard(item.id)}
      onPressOut={() => setHoveredCard(null)}
      activeOpacity={0.9}
    >
      {/* Background Gradient */}
      <LinearGradient
        colors={[
          ...item.color.map(color => `${color}0D`), // 5% opacity
        ] as [ColorValue, ColorValue, ...ColorValue[]]}
        style={styles.cardGradient}
      />

      {/* Badge */}
      {item.badge && (
        <LinearGradient
          colors={["#A855F7", "#EC4899"]}
          style={styles.badge}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ThemedText style={styles.badgeText}>{item.badge}</ThemedText>
        </LinearGradient>
      )}

      {/* Icon Container */}
      <LinearGradient
        colors={item.color as [ColorValue, ColorValue, ...ColorValue[]]}
        style={styles.iconContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Ionicons name={item.icon} size={24} color="white" />
      </LinearGradient>

      {/* Content */}
      <View style={styles.cardContent}>
        <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
        <ThemedText style={styles.cardShortDescription}>
          {item.shortDescription}
        </ThemedText>

        {/* Time Badge */}
        <View style={styles.timeBadge}>
          <Ionicons name="time-outline" size={12} color={AiraColors.mutedForeground} />
          <ThemedText style={styles.timeText}>{item.estimatedTime}</ThemedText>
        </View>

        {/* Description */}
        <ThemedText style={styles.cardDescription} numberOfLines={3}>
          {item.description}
        </ThemedText>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <ThemedText style={styles.featuresTitle}>Características:</ThemedText>
          {item.features.slice(0, 3).map((feature, idx) => (
            <View key={idx} style={styles.featureItem}>
              <View style={styles.featureBullet} />
              <ThemedText style={styles.featureText} numberOfLines={1}>
                {feature}
              </ThemedText>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.benefitsContainer}>
          <ThemedText style={styles.benefitsTitle}>Beneficios:</ThemedText>
          <View style={styles.benefitsList}>
            {item.benefits.map((benefit, idx) => (
              <View key={idx} style={styles.benefitBadge}>
                <ThemedText style={styles.benefitText}>{benefit}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <LinearGradient
          colors={item.color as [ColorValue, ColorValue, ...ColorValue[]]}
          style={styles.actionButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <ThemedText style={styles.actionButtonText}>
            Explorar {item.title}
          </ThemedText>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <PageView>
      <Topbar title="Centro de Inspiración" actions={<ProfileButton />} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <LinearGradient
          colors={[AiraColors.airaLavenderSoft, AiraColors.background]}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Ionicons name="heart" size={32} color={AiraColors.primary} />
            <ThemedText style={styles.headerTitle}>Centro de Inspiración</ThemedText>
            <ThemedText style={styles.headerDescription}>
              Tu espacio sagrado para encontrar motivación, crear hábitos amables y nutrir tu bienestar emocional. 💕
            </ThemedText>
            <ThemedText style={styles.headerAccent}>
              ¡Descubre, aprende y crece! 🌟
            </ThemedText>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Ionicons name={stat.icon} size={20} color={AiraColors.primary} />
              </View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={styles.statLabel}>{stat.label}</ThemedText>
            </View>
          ))}
        </View>

        {/* Inspiration Items */}
        <View style={styles.inspirationContainer}>
          {inspirationItems.map((item, index) => renderInspirationCard(item, index))}
        </View>

        {/* Call to Action */}
        <LinearGradient
          colors={[AiraColors.primary, AiraColors.accent]}
          style={styles.ctaContainer}
        >
          <View style={styles.ctaContent}>
            <Ionicons name="heart" size={28} color={AiraColors.background} />
            <ThemedText style={styles.ctaTitle}>
              Tu Bienestar es Nuestra Prioridad
            </ThemedText>
            <ThemedText style={styles.ctaDescription}>
              Cada frase, cada mini reto y cada ritual ha sido cuidadosamente
              diseñado para acompañarte en tu viaje hacia un bienestar auténtico
              y sostenible. 💕
            </ThemedText>
            <View style={styles.ctaButtons}>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push("/inspiration/frases")}
              >
                <ThemedText style={styles.ctaButtonText}>Comenzar con Frases</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push("/inspiration/mini-retos")}
              >
                <ThemedText style={styles.ctaButtonText}>Probar un Mini Reto</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.ctaButton}
                onPress={() => router.push("/inspiration/rituales")}
              >
                <ThemedText style={styles.ctaButtonText}>Crear un Ritual</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  headerContent: {
    alignItems: "center",
    maxWidth: width - 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: AiraColors.foreground,
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  headerDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 8,
  },
  headerAccent: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "600",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  statCard: {
    alignItems: "center",
    flex: 1,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  inspirationContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  inspirationCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    position: "relative",
  },
  hoveredCard: {
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.3),
    shadowOpacity: 0.2,
    elevation: 8,
  },
  cardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  badge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 10,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
    paddingTop: 0,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  cardShortDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 12,
  },
  timeBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
    marginBottom: 16,
  },
  featuresContainer: {
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AiraColors.primary,
    marginRight: 8,
  },
  featureText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    flex: 1,
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  benefitsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  benefitBadge: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  benefitText: {
    fontSize: 12,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.buttonRadius,
    gap: 8,
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  ctaContainer: {
    marginHorizontal: 16,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 24,
  },
  ctaContent: {
    padding: 24,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AiraColors.background,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 14,
    color: AiraColorsWithAlpha.backgroundWithOpacity(0.9),
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  ctaButtons: {
    gap: 12,
    width: "100%",
  },
  ctaButton: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.buttonRadius,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.backgroundWithOpacity(0.3),
  },
  ctaButtonText: {
    color: AiraColors.background,
    fontSize: 14,
    fontWeight: "600",
  },
});
