import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { OnboardingData } from "@/app/onboarding";
import { AiraVariants } from "@/constants/Themes";

interface PersonalInfoStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function PersonalInfoStep({
  data,
  updateData,
  onNext,
  onPrev,
}: PersonalInfoStepProps) {
  const isValid =
    data.name && data.age && data.gender && data.height && data.weight;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="person" size={48} color={AiraColors.primary} />
          <ThemedText style={styles.title}>Cuéntame sobre ti</ThemedText>
          <ThemedText style={styles.subtitle}>
            Esta información me ayudará a crear el plan perfecto para ti
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Nombre */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>¿Cómo te llamas? 💕</ThemedText>
            <ThemedInput
              value={data.name}
              onChangeText={(value) => updateData({ name: value })}
              placeholder="Tu nombre"
              placeholderTextColor={AiraColorsWithAlpha.foregroundWithOpacity(
                0.4
              )}
            />
          </View>

          {/* Edad */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>¿Cuál es tu edad?</ThemedText>
            <ThemedInput
              variant="numeric"
              value={data.age}
              onChangeText={(value) => updateData({ age: value })}
              placeholder="Tu edad"
              keyboardType="numeric"
              placeholderTextColor={AiraColorsWithAlpha.foregroundWithOpacity(
                0.4
              )}
            />
          </View>

          {/* Género */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>Género</ThemedText>
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioOption,
                  data.gender === "female" && styles.radioSelected,
                ]}
                onPress={() => updateData({ gender: "female" })}
              >
                <ThemedText
                  style={[
                    styles.radioText,
                    data.gender === "female" && styles.radioTextSelected,
                  ]}
                >
                  Mujer
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioOption,
                  data.gender === "male" && styles.radioSelected,
                ]}
                onPress={() => updateData({ gender: "male" })}
              >
                <ThemedText
                  style={[
                    styles.radioText,
                    data.gender === "male" && styles.radioTextSelected,
                  ]}
                >
                  Hombre
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.radioOption,
                  data.gender === "other" && styles.radioSelected,
                ]}
                onPress={() => updateData({ gender: "other" })}
              >
                <ThemedText
                  style={[
                    styles.radioText,
                    data.gender === "other" && styles.radioTextSelected,
                  ]}
                >
                  Otro
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Altura y Peso */}
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <ThemedText style={styles.label}>Altura (cm)</ThemedText>
              <ThemedInput
                variant="numeric"
                value={data.height}
                onChangeText={(value) => updateData({ height: value })}
                placeholder="Altura"
                keyboardType="numeric"
                placeholderTextColor={AiraColorsWithAlpha.foregroundWithOpacity(
                  0.4
                )}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <ThemedText style={styles.label}>Peso (kg)</ThemedText>
              <ThemedInput
                variant="numeric"
                value={data.weight}
                onChangeText={(value) => updateData({ weight: value })}
                placeholder="Peso"
                keyboardType="numeric"
                placeholderTextColor={AiraColorsWithAlpha.foregroundWithOpacity(
                  0.4
                )}
              />
            </View>
          </View>
        </View>

        {/* Botones de navegación */}
        <View style={styles.navigation}>
          <TouchableOpacity style={styles.backButton} onPress={onPrev}>
            <Ionicons
              name="arrow-back"
              size={20}
              color={AiraColors.mutedForeground}
            />
            <ThemedText style={styles.backButtonText}>Atrás</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
            onPress={isValid ? onNext : undefined}
            disabled={!isValid}
          >
            <ThemedText style={styles.nextButtonText}>Siguiente</ThemedText>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
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
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    marginTop: 16,
    marginBottom: 8,
     
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: AiraColorsWithAlpha.foregroundWithOpacity(0.8),
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
     
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  radioOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.3),
    backgroundColor: AiraColors.background,
  },
  radioSelected: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderColor: AiraColors.primary,
  },
  radioText: {
    fontSize: 14,
     
  },
  radioTextSelected: {
    color: AiraColors.primary,
  },
  navigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  nextButton: {
    backgroundColor: AiraColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: AiraVariants.tagRadius,
  },
  nextButtonDisabled: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.5),
  },
  nextButtonText: {
    color: AiraColors.background,
    fontSize: 16,
    marginRight: 8,
  },
});
