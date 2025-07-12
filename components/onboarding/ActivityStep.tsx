import React from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { OnboardingData } from "@/app/onboarding";
import { AiraVariants } from "@/constants/Themes";

interface ActivityStepProps {
  data: OnboardingData;
  updateData: (data: Partial<OnboardingData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const activityLevels = [
  "Sedentaria (poco o nada de ejercicio)",
  "Ligeramente activa (1-2 días/semana)",
  "Moderadamente activa (3-4 días/semana)",
  "Muy activa (5-6 días/semana)",
  "Extremadamente activa (ejercicio diario intenso)",
];

const experienceLevels = [
  "Principiante (nueva en el ejercicio)",
  "Intermedia (ejercicio ocasional)",
  "Avanzada (ejercicio regular)",
];

const activityPreferences = [
  "Cardio",
  "Entrenamiento de fuerza",
  "Yoga/Pilates",
  "HIIT",
  "Baile",
  "Deportes",
  "Caminatas/Senderismo",
  "Natación",
];

const equipmentOptions = [
  "Sin equipo (ejercicios con peso corporal)",
  "Pesas ligeras/bandas",
  "Equipo completo de gimnasio en casa",
  "Acceso a gimnasio",
];

const frequencyOptions = [
  "1-2 días por semana",
  "3-4 días por semana",
  "5-6 días por semana",
  "Todos los días",
];

const durationOptions = [
  "Menos de 30 minutos",
  "30-45 minutos",
  "45-60 minutos",
  "Más de 60 minutos",
];

export default function ActivityStep({
  data,
  updateData,
  onNext,
  onPrev,
}: ActivityStepProps) {
  const handlePreferenceToggle = (preference: string) => {
    const newPreferences = [...data.preferences];

    if (newPreferences.includes(preference)) {
      newPreferences.splice(newPreferences.indexOf(preference), 1);
    } else {
      newPreferences.push(preference);
    }

    updateData({ preferences: newPreferences });
  };

  const handleEquipmentToggle = (equipment: string) => {
    const newEquipment = [...data.equipment];

    if (newEquipment.includes(equipment)) {
      newEquipment.splice(newEquipment.indexOf(equipment), 1);
    } else {
      newEquipment.push(equipment);
    }

    updateData({ equipment: newEquipment });
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
          <Ionicons name="fitness" size={48} color={AiraColors.primary} />
          <ThemedText style={styles.title}>Actividad física</ThemedText>
          <ThemedText style={styles.subtitle}>
            Cuéntame sobre tu relación con el ejercicio para crear un plan que
            disfrutes
          </ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.form}>
          {/* Nivel de actividad actual */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuál es tu nivel de actividad física actual?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {activityLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.option,
                    data.currentActivity === level && styles.optionSelected,
                  ]}
                  onPress={() => updateData({ currentActivity: level })}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      data.currentActivity === level &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {level}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Experiencia */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuál es tu nivel de experiencia con el ejercicio?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {experienceLevels.map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.option,
                    data.experience === level && styles.optionSelected,
                  ]}
                  onPress={() => updateData({ experience: level })}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      data.experience === level && styles.optionTextSelected,
                    ]}
                  >
                    {level}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preferencias de actividad */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Qué tipo de actividades físicas te gustan? (Selecciona las que
              apliquen)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {activityPreferences.map((preference) => (
                <TouchableOpacity
                  key={preference}
                  style={[
                    styles.checkboxOption,
                    data.preferences.includes(preference) &&
                      styles.checkboxSelected,
                  ]}
                  onPress={() => handlePreferenceToggle(preference)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      data.preferences.includes(preference) &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {data.preferences.includes(preference) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={AiraColors.primary}
                      />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>
                    {preference}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Equipo disponible */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Con qué equipo cuentas? (Selecciona los que apliquen)
            </ThemedText>
            <View style={styles.checkboxGrid}>
              {equipmentOptions.map((equipment) => (
                <TouchableOpacity
                  key={equipment}
                  style={[
                    styles.checkboxOption,
                    data.equipment.includes(equipment) &&
                      styles.checkboxSelected,
                  ]}
                  onPress={() => handleEquipmentToggle(equipment)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      data.equipment.includes(equipment) &&
                        styles.checkboxChecked,
                    ]}
                  >
                    {data.equipment.includes(equipment) && (
                      <Ionicons
                        name="checkmark"
                        size={16}
                        color={AiraColors.primary}
                      />
                    )}
                  </View>
                  <ThemedText style={styles.checkboxText}>
                    {equipment}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Frecuencia */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Con qué frecuencia te gustaría hacer ejercicio?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {frequencyOptions.map((frequency) => (
                <TouchableOpacity
                  key={frequency}
                  style={[
                    styles.option,
                    data.frequency === frequency && styles.optionSelected,
                  ]}
                  onPress={() => updateData({ frequency: frequency })}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      data.frequency === frequency && styles.optionTextSelected,
                    ]}
                  >
                    {frequency}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Duración */}
          <View style={styles.inputGroup}>
            <ThemedText style={styles.label}>
              ¿Cuánto tiempo puedes dedicar a cada sesión de ejercicio?
            </ThemedText>
            <View style={styles.optionsContainer}>
              {durationOptions.map((duration) => (
                <TouchableOpacity
                  key={duration}
                  style={[
                    styles.option,
                    data.duration === duration && styles.optionSelected,
                  ]}
                  onPress={() => updateData({ duration: duration })}
                >
                  <ThemedText
                    style={[
                      styles.optionText,
                      data.duration === duration && styles.optionTextSelected,
                    ]}
                  >
                    {duration}
                  </ThemedText>
                </TouchableOpacity>
              ))}
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
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.3),
    backgroundColor: AiraColors.background,
    marginBottom: 8,
  },
  optionSelected: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    borderColor: AiraColors.primary,
  },
  optionText: {
    fontSize: 14,
     
  },
  optionTextSelected: {
    color: AiraColors.primary,
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
  checkboxChecked: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.2),
  },
  checkboxText: {
    fontSize: 14,
     
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
