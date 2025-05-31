import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          {/* Logo y título */}
          <View style={styles.logoContainer}>
            <View style={styles.heartContainer}>
              <Ionicons name="heart" size={64} color="#ec4899" />
              <View style={styles.sparkleContainer}>
                <Ionicons name="sparkles" size={24} color="#facc15" />
              </View>
            </View>
            <ThemedText style={styles.title}>¡Hola, hermosa!</ThemedText>
            <ThemedText style={styles.subtitle}>Soy Aira 💕</ThemedText>
          </View>

          {/* Mensaje de bienvenida */}
          <View style={styles.messageContainer}>
            <ThemedText style={styles.message}>
              Estoy aquí para acompañarte en este hermoso viaje hacia una
              versión más saludable y feliz de ti misma.
            </ThemedText>
            <ThemedText style={styles.message}>
              No voy a juzgarte ni presionarte. Vamos a crear un plan{" "}
              <ThemedText style={styles.highlight}>solo para ti</ThemedText>,
              respetando tu ritmo y tus necesidades.
            </ThemedText>
          </View>

          {/* Características */}
          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Ionicons
                name="heart-outline"
                size={32}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.featureTitle}>Empática</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Te entiendo y celebro cada paso
              </ThemedText>
            </View>

            <View style={styles.feature}>
              <Ionicons
                name="person-outline"
                size={32}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.featureTitle}>Personal</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Adaptada a tus necesidades únicas
              </ThemedText>
            </View>

            <View style={styles.feature}>
              <Ionicons
                name="shield-checkmark-outline"
                size={32}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.featureTitle}>Segura</ThemedText>
              <ThemedText style={styles.featureDescription}>
                Un espacio libre de juicios
              </ThemedText>
            </View>
          </View>

          {/* Botón de inicio */}
          <TouchableOpacity
            style={styles.button}
            onPress={onNext}
            activeOpacity={0.8}
          >
            <ThemedText style={styles.buttonText}>Comenzar mi viaje</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  content: {
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  heartContainer: {
    position: "relative",
    marginBottom: 16,
  },
  sparkleContainer: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  title: {
    fontSize: 32,
    paddingVertical: 4,
    marginBottom: 4,
    color: AiraColors.foreground,
  },
  subtitle: {
    fontSize: 24,
    color: AiraColors.foreground,
    paddingVertical: 4,
  },
  messageContainer: {
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 24,
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.8),
  },
  highlight: {
    color: AiraColors.primary,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 8,
  },
  feature: {
    alignItems: "center",
    flex: 1,
    padding: 8,
  },
  featureTitle: {
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 12,
    textAlign: "center",
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.7),
  },
  button: {
    backgroundColor: AiraColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: AiraVariants.tagRadius,
    width: "100%",
  },
  buttonText: {
    color: AiraColors.background,
    fontSize: 16,
    marginRight: 8,
  },
});
