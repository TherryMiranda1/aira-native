import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { OnboardingData } from "@/app/onboarding";
import { AiraVariants } from "@/constants/Themes";

interface HealthStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const healthConditions = [
  "Diabetes",
  "Hipertensión",
  "Problemas tiroideos",
  "Problemas cardíacos",
  "Asma",
  "Artritis",
  "Depresión/Ansiedad",
  "Ninguna",
];

const commonAllergies = [
  "Frutos secos",
  "Mariscos",
  "Huevos",
  "Lácteos",
  "Gluten",
  "Soja",
  "Ninguna",
];

export default function HealthStep({
  data,
  updateData,
  onNext,
  onPrev,
}: HealthStepProps) {
  const handleConditionToggle = (condition: string) => {
    if (condition === "Ninguna") {
      updateData({
        healthConditions: data.healthConditions.includes("Ninguna")
          ? []
          : ["Ninguna"],
      });
    } else {
      const newConditions = [...data.healthConditions];
      // Eliminar "Ninguna" si se selecciona otra condición
      if (newConditions.includes("Ninguna")) {
        newConditions.splice(newConditions.indexOf("Ninguna"), 1);
      }

      // Alternar la condición seleccionada
      if (newConditions.includes(condition)) {
        newConditions.splice(newConditions.indexOf(condition), 1);
      } else {
        newConditions.push(condition);
      }

      updateData({ healthConditions: newConditions });
    }
  };

  const handleAllergyToggle = (allergy: string) => {
    if (allergy === "Ninguna") {
      updateData({
        allergies: data.allergies.includes("Ninguna") ? [] : ["Ninguna"],
      });
    } else {
      const newAllergies = [...data.allergies];
      // Eliminar "Ninguna" si se selecciona otra alergia
      if (newAllergies.includes("Ninguna")) {
        newAllergies.splice(newAllergies.indexOf("Ninguna"), 1);
      }

      // Alternar la alergia seleccionada
      if (newAllergies.includes(allergy)) {
        newAllergies.splice(newAllergies.indexOf(allergy), 1);
      } else {
        newAllergies.push(allergy);
      }

      updateData({ allergies: newAllergies });
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="heart" size={48} color={AiraColors.primary} />
          <ThemedText style={styles.title}>Cuidemos tu salud</ThemedText>
          <ThemedText style={styles.subtitle}>
            Es importante que conozca tu estado de salud para cuidarte mejor
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Condiciones de salud */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Tienes alguna condición de salud? (Puedes seleccionar varias)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {healthConditions.map((condition) => (
                <TouchableOpacity
                  key={condition}
                  style={[
                    styles.checkboxOption,
                    data.healthConditions.includes(condition) &&
                      styles.checkboxSelected,
                  ]}
                  onPress={() => handleConditionToggle(condition)}
                >
                  <View style={styles.checkbox}>
                    {data.healthConditions.includes(condition) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={AiraColors.primary}
                      />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>
                    {condition}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Alergias */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Tienes alguna alergia alimentaria? (Puedes seleccionar varias)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {commonAllergies.map((allergy) => (
                <TouchableOpacity
                  key={allergy}
                  style={[
                    styles.checkboxOption,
                    data.allergies.includes(allergy) && styles.checkboxSelected,
                  ]}
                  onPress={() => handleAllergyToggle(allergy)}
                >
                  <View style={styles.checkbox}>
                    {data.allergies.includes(allergy) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={AiraColors.primary}
                      />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>{allergy}</ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Medicamentos */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Tomas algún medicamento regularmente?
            </ThemedText>
            <TextInput
              style={styles.textArea}
              value={data.medications}
              onChangeText={(value) => updateData({ medications: value })}
              placeholder="Escribe aquí los medicamentos que tomas (opcional)"
              placeholderTextColor={AiraColorsWithAlpha.foregroundWithOpacity(
                0.4
              )}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Lesiones */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Tienes alguna lesión o limitación física?
            </ThemedText>
            <TextInput
              style={styles.textArea}
              value={data.injuries}
              onChangeText={(value) => updateData({ injuries: value })}
              placeholder="Escribe aquí tus lesiones o limitaciones (opcional)"
              placeholderTextColor={AiraColorsWithAlpha.foregroundWithOpacity(
                0.4
              )}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
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

          <TouchableOpacity style={styles.nextButton} onPress={onNext}>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
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
    color: AiraColors.foreground,
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
    marginBottom: 12,
    color: AiraColors.foreground,
  },
  checkboxGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  checkboxOption: {
    flexDirection: "row",
    alignItems: "center",
    width: "48%",
    marginBottom: 8,
  },
  checkboxSelected: {
    opacity: 1,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 2,
    borderColor: AiraColors.primary,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  checkboxText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  textArea: {
    backgroundColor: AiraColors.background,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
    borderRadius: AiraVariants.cardRadius,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 100,
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
  nextButtonText: {
    color: AiraColors.background,
    fontSize: 16,
    marginRight: 8,
  },
});
