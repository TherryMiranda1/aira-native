import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { AiraColors, AiraColorsWithAlpha } from '@/constants/Colors';
import { OnboardingData } from '@/app/onboarding';
import { AiraVariants } from '@/constants/Themes';

interface CompletionStepProps {
  data: OnboardingData;
  onComplete: () => void;
}

export default function CompletionStep({ 
  data, 
  onComplete 
}: CompletionStepProps) {
  
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Celebración */}
        <View style={styles.celebrationContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="heart" size={64} color={AiraColors.primary} style={styles.pulseIcon} />
            <Ionicons name="sparkles" size={32} color="#facc15" style={styles.bounceIcon} />
            <Ionicons name="star" size={40} color="#a855f7" style={styles.pulseIcon} />
          </View>
          
          <ThemedText style={styles.title}>
            ¡Perfecto, {data.name || "hermosa"}!
          </ThemedText>
          
          <ThemedText style={styles.subtitle}>
            Tu plan está listo ✨
          </ThemedText>
        </View>

        {/* Mensaje personalizado */}
        <View style={styles.messageContainer}>
          <ThemedText style={styles.message}>
            He creado un plan completamente personalizado basado en todo lo que me has contado.
          </ThemedText>
          
          <ThemedText style={styles.message}>
            Recuerda que estoy aquí para apoyarte en cada paso.{' '}
            <ThemedText style={styles.highlight}>No hay prisa</ThemedText>, vamos a tu ritmo.
          </ThemedText>
        </View>

        {/* Resumen */}
        <View style={styles.summaryContainer}>
          <ThemedText style={styles.summaryTitle}>
            Tu resumen personal
          </ThemedText>
          
          <View style={styles.summaryItem}>
            <Ionicons name="flag-outline" size={24} color={AiraColors.primary} />
            <View style={styles.summaryTextContainer}>
              <ThemedText style={styles.summaryLabel}>Objetivo principal:</ThemedText>
              <ThemedText style={styles.summaryValue}>{data.primaryGoal || "Mejorar tu bienestar"}</ThemedText>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="time-outline" size={24} color={AiraColors.primary} />
            <View style={styles.summaryTextContainer}>
              <ThemedText style={styles.summaryLabel}>Compromiso:</ThemedText>
              <ThemedText style={styles.summaryValue}>{data.commitment || "A tu ritmo"}</ThemedText>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="fitness-outline" size={24} color={AiraColors.primary} />
            <View style={styles.summaryTextContainer}>
              <ThemedText style={styles.summaryLabel}>Actividad preferida:</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.preferences && data.preferences.length > 0 
                  ? data.preferences[0] 
                  : "Por definir"}
              </ThemedText>
            </View>
          </View>
          
          <View style={styles.summaryItem}>
            <Ionicons name="nutrition-outline" size={24} color={AiraColors.primary} />
            <View style={styles.summaryTextContainer}>
              <ThemedText style={styles.summaryLabel}>Nutrición:</ThemedText>
              <ThemedText style={styles.summaryValue}>
                {data.dietaryPreferences && data.dietaryPreferences.length > 0 
                  ? data.dietaryPreferences[0] 
                  : "Plan equilibrado"}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Botón de finalizar */}
        <TouchableOpacity
          style={styles.completeButton}
          onPress={onComplete}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.completeButtonText}>
            Comenzar mi viaje con Aira
          </ThemedText>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  celebrationContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pulseIcon: {
    margin: 4,
  },
  bounceIcon: {
    margin: 4,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
    color: AiraColors.foreground,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    color: AiraColors.foreground,
    textAlign: "center",
  },
  messageContainer: {
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 24,
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.8),
  },
  highlight: {
    color: AiraColors.primary,
  },
  summaryContainer: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    marginBottom: 16,
    textAlign: "center",
    color: AiraColors.foreground,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  summaryTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.7),
    marginBottom: 2,
  },
  summaryValue: {
    fontSize: 16,
    color: AiraColors.foreground,
  },
  completeButton: {
    backgroundColor: AiraColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: AiraVariants.tagRadius,
  },
  completeButtonText: {
    color: AiraColors.background,
    fontSize: 16,
    marginRight: 8,
  },
});
