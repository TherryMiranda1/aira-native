import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "../../components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { PersonalizedPlanInput } from "@/types/Assistant";
import { ThemedInput } from "@/components/ThemedInput";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { ThemedView } from "@/components/ThemedView";

interface PlanConfigFormProps {
  onSubmit: (data: PersonalizedPlanInput) => void;
  isLoading?: boolean;
  initialData?: Partial<PersonalizedPlanInput>;
}

interface FormSection {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  fields: string[];
  expanded: boolean;
}

export const PlanConfigForm = ({
  onSubmit,
  isLoading = false,
  initialData = {},
}: PlanConfigFormProps) => {
  const { showError } = useAlertHelpers();
  const [formData, setFormData] = useState<PersonalizedPlanInput>({
    fullName: initialData.fullName || "",
    age: initialData.age || 30,
    sexo: initialData.sexo || "Femenino",
    altura: initialData.altura || 165,
    peso: initialData.peso || 65,
    imc: initialData.imc || 24,
    objetivo: initialData.objetivo || "Mejora de la salud general",
    plazo: initialData.plazo || "3 meses",
    condiciones_medicas: initialData.condiciones_medicas || "",
    alergias: initialData.alergias || "",
    preferencias_nutricionales: initialData.preferencias_nutricionales || "",
    habitos_alimenticios: initialData.habitos_alimenticios || "",
    nivel_actividad_actual: initialData.nivel_actividad_actual || "",
    nivel_entrenamiento: initialData.nivel_entrenamiento || "Principiante",
    sesiones_semana: initialData.sesiones_semana || "3-4 días a la semana",
    minutos_por_sesion: initialData.minutos_por_sesion || "30-45 minutos",
    equipamiento_disponible: initialData.equipamiento_disponible || "",
    horario_entrenamiento: initialData.horario_entrenamiento || "Flexible",
    horario_comidas: initialData.horario_comidas || "",
    presupuesto_semana: initialData.presupuesto_semana || "Moderado",
    estres: initialData.estres || "",
    sueno: initialData.sueno || "",
    motivadores: initialData.motivadores || "",
    cookingAvailability: initialData.cookingAvailability || "Moderado",
    personalPriorities: initialData.personalPriorities || "Bienestar general",
    nutritionKnowledge: initialData.nutritionKnowledge || "Nivel general",
  });

  const [sections, setSections] = useState<FormSection[]>([
    {
      title: "Información Personal",
      icon: "person",
      fields: ["fullName", "age", "sexo", "altura", "peso"],
      expanded: true,
    },
    {
      title: "Objetivos y Metas",
      icon: "flag",
      fields: ["objetivo", "plazo", "personalPriorities"],
      expanded: false,
    },
    {
      title: "Actividad y Ejercicio",
      icon: "fitness",
      fields: [
        "nivel_actividad_actual",
        "nivel_entrenamiento",
        "sesiones_semana",
        "minutos_por_sesion",
        "equipamiento_disponible",
        "horario_entrenamiento",
      ],
      expanded: false,
    },
    {
      title: "Nutrición y Alimentación",
      icon: "restaurant",
      fields: [
        "preferencias_nutricionales",
        "habitos_alimenticios",
        "horario_comidas",
        "presupuesto_semana",
        "cookingAvailability",
        "nutritionKnowledge",
      ],
      expanded: false,
    },
    {
      title: "Salud y Condiciones",
      icon: "medical",
      fields: ["condiciones_medicas", "alergias", "estres", "sueno"],
      expanded: false,
    },
    {
      title: "Motivación",
      icon: "heart",
      fields: ["motivadores"],
      expanded: false,
    },
  ]);

  const toggleSection = (index: number) => {
    setSections((prev) =>
      prev.map((section, i) =>
        i === index ? { ...section, expanded: !section.expanded } : section
      )
    );
  };

  const updateField = (field: keyof PersonalizedPlanInput, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      fullName: "Nombre completo",
      age: "Edad",
      sexo: "Sexo",
      altura: "Altura (cm)",
      peso: "Peso (kg)",
      imc: "IMC",
      objetivo: "Objetivo principal",
      plazo: "Plazo deseado",
      condiciones_medicas: "Condiciones médicas",
      alergias: "Alergias e intolerancias",
      preferencias_nutricionales: "Preferencias nutricionales",
      habitos_alimenticios: "Hábitos alimenticios",
      nivel_actividad_actual: "Nivel de actividad actual",
      nivel_entrenamiento: "Experiencia en entrenamiento",
      sesiones_semana: "Sesiones por semana",
      minutos_por_sesion: "Duración por sesión",
      equipamiento_disponible: "Equipamiento disponible",
      horario_entrenamiento: "Horario de entrenamiento",
      horario_comidas: "Horario de comidas",
      presupuesto_semana: "Presupuesto semanal",
      estres: "Nivel de estrés",
      sueno: "Calidad del sueño",
      motivadores: "Motivadores personales",
      cookingAvailability: "Disponibilidad para cocinar",
      personalPriorities: "Prioridades personales",
      nutritionKnowledge: "Conocimiento nutricional",
    };
    return labels[field] || field;
  };

  const isNumericField = (field: string): boolean => {
    return ["age", "altura", "peso", "imc"].includes(field);
  };

  const isMultilineField = (field: string): boolean => {
    return [
      "condiciones_medicas",
      "alergias",
      "preferencias_nutricionales",
      "habitos_alimenticios",
      "nivel_actividad_actual",
      "equipamiento_disponible",
      "motivadores",
    ].includes(field);
  };

  const handleSubmit = () => {
    if (!formData.fullName?.trim()) {
      showError("Error", "Por favor ingresa tu nombre");
      return;
    }

    if (formData.age < 16 || formData.age > 100) {
      showError("Error", "Por favor ingresa una edad válida (16-100 años)");
      return;
    }

    onSubmit(formData);
  };

  const renderField = (field: string) => {
    const value = formData[field as keyof PersonalizedPlanInput];
    const isNumeric = isNumericField(field);
    const isMultiline = isMultilineField(field);

    return (
      <View key={field} style={styles.fieldContainer}>
        <ThemedText type="small" style={styles.fieldLabel}>
          {getFieldLabel(field)}
        </ThemedText>
        <ThemedInput
          style={[isMultiline && styles.multilineInput]}
          value={String(value || "")}
          onChangeText={(text) => {
            if (isNumeric) {
              const numValue = parseFloat(text) || 0;
              updateField(field as keyof PersonalizedPlanInput, numValue);
            } else {
              updateField(field as keyof PersonalizedPlanInput, text);
            }
          }}
          placeholder={`Ingresa ${getFieldLabel(field).toLowerCase()}`}
          placeholderTextColor={AiraColors.mutedForeground}
          keyboardType={isNumeric ? "numeric" : "default"}
          multiline={isMultiline}
          numberOfLines={isMultiline ? 3 : 1}
          editable={!isLoading}
        />
      </View>
    );
  };

  return (
    <View>
      <View style={styles.header}>
        <ThemedText type="default" style={styles.subtitle}>
          Completa la información para generar un plan adaptado a ti
        </ThemedText>
      </View>

      {sections.map((section, index) => (
        <ThemedView
          variant="border"
          key={index}
          style={styles.sectionContainer}
        >
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(index)}
            disabled={isLoading}
          >
            <LinearGradient
              colors={
                section.expanded
                  ? [AiraColors.primary, AiraColors.accent]
                  : [AiraColors.card, AiraColors.card]
              }
              style={styles.sectionIconContainer}
            >
              <Ionicons
                name={section.icon}
                size={18}
                color={section.expanded ? "white" : AiraColors.primary}
              />
            </LinearGradient>
            <View style={styles.sectionTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                {section.title}
              </ThemedText>
            </View>
            <Ionicons
              name={section.expanded ? "chevron-up" : "chevron-down"}
              size={18}
              color={AiraColors.mutedForeground}
            />
          </TouchableOpacity>

          {section.expanded && (
            <View style={styles.sectionContent}>
              {section.fields.map((field) => renderField(field))}
            </View>
          )}
        </ThemedView>
      ))}

      <TouchableOpacity
        style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        <LinearGradient
          colors={[AiraColors.primary, AiraColors.primary]}
          style={styles.submitButtonGradient}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ThemedText
                type="defaultSemiBold"
                style={styles.submitButtonText}
              >
                Generando plan...
              </ThemedText>
            </View>
          ) : (
            <View style={styles.submitContainer}>
              <Ionicons name="sparkles" size={20} color="white" />
              <ThemedText
                type="defaultSemiBold"
                style={styles.submitButtonText}
              >
                Generar Mi Plan
              </ThemedText>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  sectionContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {},
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  fieldContainer: {
    gap: 8,
  },
  fieldLabel: {},
  textInput: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    marginHorizontal: 16,
    marginVertical: 24,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  submitButtonText: {
    color: "white",
  },
});
