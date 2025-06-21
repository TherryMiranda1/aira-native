import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/Buttons/SignOutButton";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";

export default function ProfileScreen() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <PageView>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <Topbar title="Mi Perfil" showBackButton />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Información del Perfil */}
        <View style={styles.card}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <ThemedText style={styles.greeting} type="title">
            ¡Hola, {user?.firstName || user?.emailAddresses?.[0].emailAddress}!
            💜
          </ThemedText>
          <ThemedText style={styles.message}>
            Me alegra tanto tenerte aquí. Cada día que dedicas a cuidarte es un
            regalo hermoso que te das a ti misma.
          </ThemedText>
        </View>

        {/* Mensaje Motivacional */}
        <View style={styles.card}>
          <View style={styles.heartContainer}>
            <Ionicons name="heart" size={32} color="#ec4899" />
          </View>
          <ThemedText style={styles.message}>
            <ThemedText style={styles.sparkle}>✨</ThemedText> Recuerda: tu
            bienestar es una prioridad.{"\n"}
            Estoy aquí para acompañarte en cada paso de tu hermoso viaje.
          </ThemedText>
        </View>

        {/* Onboarding */}
        <TouchableOpacity
          style={styles.linkCard}
          activeOpacity={0.9}
          onPress={() => router.push("/onboarding")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#e0e7ff" }]}>
            <Ionicons name="compass-outline" size={24} color="#4f46e5" />
          </View>
          <View style={styles.linkContent}>
            <ThemedText style={styles.linkTitle}>Comienza tu viaje</ThemedText>
            <ThemedText style={styles.linkDescription}>
              Cuentame sobre ti, para poder ofrecerte una experiencia
              personalizada.
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={AiraColors.primary}
          />
        </TouchableOpacity>

        {/* Configuración */}
        <TouchableOpacity
          style={styles.linkCard}
          activeOpacity={0.9}
          onPress={() => alert("Funcionalidad de configuración en desarrollo")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#e0e7ff" }]}>
            <Ionicons name="settings-outline" size={24} color="#4f46e5" />
          </View>
          <View style={styles.linkContent}>
            <ThemedText style={styles.linkTitle}>
              Personalización Avanzada
            </ThemedText>
            <ThemedText style={styles.linkDescription}>
              Ajusta Aira a tu estilo y preferencias únicas
            </ThemedText>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={AiraColors.primary}
          />
        </TouchableOpacity>
        <SignOutButton />
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    backgroundColor: AiraColors.background,
  },
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.7),
    textAlign: "center",
    lineHeight: 22,
  },
  heartContainer: {
    marginBottom: 12,
  },
  sparkle: {
    fontSize: 18,
  },
  linkCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: AiraVariants.tagRadius,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  linkDescription: {
    fontSize: 13,
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.7),
  },
});
