import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import {
  PersonalizedPlanInput,
  PersonalizedPlanOutput,
} from "@/types/Assistant";
import { useAlertHelpers } from "@/components/ui/AlertSystem";
import { useToastHelpers } from "@/components/ui/ToastSystem";
import { ThemedView } from "@/components/ThemedView";

interface GeneratedPlanSectionProps {
  plan: PersonalizedPlanOutput;
  inputParams: PersonalizedPlanInput;
  onSave: () => Promise<void>;
  onRegenerate: () => void;
  onEditParams?: () => void;
  isSaving?: boolean;
  isRegenerating?: boolean;
  isFromCompleteProfile?: boolean;
}

export const GeneratedPlanSection = ({
  plan,
  inputParams,
  onSave,
  onRegenerate,
  onEditParams,
  isSaving = false,
  isRegenerating = false,
  isFromCompleteProfile = false,
}: GeneratedPlanSectionProps) => {
  const { showConfirm } = useAlertHelpers();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  const [expandedSections, setExpandedSections] = useState({
    nutrition: true,
    workout: false,
    tracking: false,
    params: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = async () => {
    try {
      await onSave();
      showSuccessToast(
        "¡Éxito!",
        "Tu plan personalizado se ha guardado correctamente"
      );
    } catch (error) {
      showErrorToast(
        "Error",
        "No se pudo guardar el plan. Inténtalo de nuevo."
      );
    }
  };

  const handleRegenerate = () => {
    showConfirm(
      "Regenerar Plan",
      "¿Estás segura de que quieres generar un nuevo plan? Se perderá el plan actual.",
      onRegenerate
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <LinearGradient
          colors={[AiraColors.primary, AiraColors.accent]}
          style={styles.headerGradient}
        >
          <Ionicons name="sparkles" size={28} color="white" />
          <ThemedText type="title" style={styles.headerTitle}>
            Tu Plan Personalizado
          </ThemedText>
          <ThemedText type="default" style={styles.headerSubtitle}>
            Diseñado especialmente para ti
          </ThemedText>
        </LinearGradient>
      </View>

      <View style={styles.controlsSection}>
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={styles.regenerateButton}
            onPress={handleRegenerate}
            disabled={isRegenerating}
          >
            <Ionicons
              name={isRegenerating ? "hourglass" : "refresh"}
              size={18}
              color={AiraColors.primary}
            />
            <ThemedText type="small" style={styles.regenerateButtonText}>
              {isRegenerating ? "Regenerando..." : "Regenerar"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={isSaving}
          >
            <LinearGradient
              colors={["#10B981", "#059669"]}
              style={styles.saveGradient}
            >
              <Ionicons
                name={isSaving ? "hourglass" : "bookmark"}
                size={18}
                color="white"
              />
              <ThemedText type="small" style={styles.saveButtonText}>
                {isSaving ? "Guardando..." : "Guardar Plan"}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      <ThemedView variant="border" style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("nutrition")}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.sectionIcon}
          >
            <Ionicons name="restaurant" size={20} color="white" />
          </LinearGradient>
          <View style={styles.sectionTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Plan Nutricional
            </ThemedText>
            <ThemedText type="small" style={styles.sectionSubtitle}>
              Tu guía alimentaria personalizada
            </ThemedText>
          </View>
          <Ionicons
            name={expandedSections.nutrition ? "chevron-up" : "chevron-down"}
            size={18}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        {expandedSections.nutrition && (
          <View style={styles.sectionContent}>
            <View style={styles.messageContainer}>
              <ThemedText type="default" style={styles.messageText}>
                {plan.planNutricional.mensajeIntroductorio}
              </ThemedText>
            </View>

            <View style={styles.macrosContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Distribución de Macronutrientes
              </ThemedText>
              <View style={styles.macrosGrid}>
                <View style={styles.macroCard}>
                  <ThemedText type="small" style={styles.macroLabel}>
                    Calorías
                  </ThemedText>
                  <ThemedText type="small" style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.caloriasTotales}
                  </ThemedText>
                </View>
                <View style={styles.macroCard}>
                  <ThemedText type="small" style={styles.macroLabel}>
                    Proteínas
                  </ThemedText>
                  <ThemedText type="small" style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.proteinas}
                  </ThemedText>
                </View>
                <View style={styles.macroCard}>
                  <ThemedText type="small" style={styles.macroLabel}>
                    Carbohidratos
                  </ThemedText>
                  <ThemedText type="small" style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.carbohidratos}
                  </ThemedText>
                </View>
                <View style={styles.macroCard}>
                  <ThemedText type="small" style={styles.macroLabel}>
                    Grasas
                  </ThemedText>
                  <ThemedText type="small" style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.grasas}
                  </ThemedText>
                </View>
              </View>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Distribución de Comidas
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {plan.planNutricional.distribucionComidas}
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Ideas de Comidas
              </ThemedText>
              {plan.planNutricional.ejemplosRecetasPlatos
                .slice(0, 3)
                .map((meal, index) => (
                  <View key={index} style={styles.mealContainer}>
                    <ThemedText type="small" style={styles.mealTitle}>
                      {meal.tipoComida}
                    </ThemedText>
                    {meal.opciones.slice(0, 2).map((option, optIndex) => (
                      <View key={optIndex} style={styles.mealOption}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color={AiraColors.primary}
                        />
                        <ThemedText type="small" style={styles.mealOptionText}>
                          {option}
                        </ThemedText>
                      </View>
                    ))}
                  </View>
                ))}
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Consejos de Preparación
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {plan.planNutricional.consejosPreparacionTiming}
              </ThemedText>
            </View>
          </View>
        )}
      </ThemedView>

      <ThemedView variant="border" style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("workout")}
        >
          <LinearGradient
            colors={["#EF4444", "#F97316"]}
            style={styles.sectionIcon}
          >
            <Ionicons name="fitness" size={20} color="white" />
          </LinearGradient>
          <View style={styles.sectionTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Programa de Entrenamiento
            </ThemedText>
            <ThemedText type="small" style={styles.sectionSubtitle}>
              Tu rutina de ejercicios personalizada
            </ThemedText>
          </View>
          <Ionicons
            name={expandedSections.workout ? "chevron-up" : "chevron-down"}
            size={18}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        {expandedSections.workout && (
          <ThemedView variant="border" style={styles.sectionContent}>
            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Tipo de Ejercicio
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {plan.programaEntrenamiento.tipoEjercicio}
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Frecuencia Semanal
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {plan.programaEntrenamiento.frecuenciaVolumenSemanal}
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Sesiones de Entrenamiento
              </ThemedText>
              {plan.programaEntrenamiento.ejerciciosDetalladosPorSesion
                .slice(0, 2)
                .map((session, index) => (
                  <View key={index} style={styles.sessionContainer}>
                    <ThemedText type="small" style={styles.sessionTitle}>
                      {session.nombreSesion}
                    </ThemedText>
                    {session.descripcionSesion && (
                      <ThemedText
                        type="small"
                        style={styles.sessionDescription}
                      >
                        {session.descripcionSesion}
                      </ThemedText>
                    )}
                    <View style={styles.exercisesContainer}>
                      {session.ejercicios
                        .slice(0, 3)
                        .map((exercise, exIndex) => (
                          <View key={exIndex} style={styles.exerciseCard}>
                            <ThemedText
                              type="small"
                              style={styles.exerciseName}
                            >
                              {exercise.nombreEjercicio}
                            </ThemedText>
                            <ThemedText
                              type="small"
                              style={styles.exerciseDetails}
                            >
                              {exercise.seriesRepeticiones} • Descanso:{" "}
                              {exercise.descanso}
                            </ThemedText>
                            {exercise.alternativaOpcional && (
                              <ThemedText
                                type="defaultItalic"
                                style={styles.exerciseAlternative}
                              >
                                Alternativa: {exercise.alternativaOpcional}
                              </ThemedText>
                            )}
                          </View>
                        ))}
                    </View>
                  </View>
                ))}
            </View>

            {plan.programaEntrenamiento.opcionesAlternativas && (
              <View style={styles.subsectionContainer}>
                <ThemedText
                  type="defaultSemiBold"
                  style={styles.subsectionTitle}
                >
                  Opciones Alternativas
                </ThemedText>
                <ThemedText type="small" style={styles.subsectionText}>
                  {plan.programaEntrenamiento.opcionesAlternativas}
                </ThemedText>
              </View>
            )}
          </ThemedView>
        )}
      </ThemedView>

      <ThemedView variant="border" style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("tracking")}
        >
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            style={styles.sectionIcon}
          >
            <Ionicons name="analytics" size={20} color="white" />
          </LinearGradient>
          <View style={styles.sectionTitleContainer}>
            <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
              Seguimiento y Progreso
            </ThemedText>
            <ThemedText type="small" style={styles.sectionSubtitle}>
              Cómo medir tu evolución
            </ThemedText>
          </View>
          <Ionicons
            name={expandedSections.tracking ? "chevron-up" : "chevron-down"}
            size={18}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        {expandedSections.tracking && (
          <ThemedView variant="border" style={styles.sectionContent}>
            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Indicadores de Progreso
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {plan.sugerenciasSeguimientoAjustes.indicadoresProgreso}
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Revisiones y Modificaciones
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {
                  plan.sugerenciasSeguimientoAjustes
                    .frecuenciaRevisionesModificaciones
                }
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText type="defaultSemiBold" style={styles.subsectionTitle}>
                Estrategias de Motivación
              </ThemedText>
              <ThemedText type="small" style={styles.subsectionText}>
                {
                  plan.sugerenciasSeguimientoAjustes
                    .estrategiasMotivacionAdherencia
                }
              </ThemedText>
            </View>

            <View style={styles.finalMessageContainer}>
              <ThemedText type="default" style={styles.finalMessage}>
                {plan.sugerenciasSeguimientoAjustes.mensajeFinalMotivador}
              </ThemedText>
            </View>
          </ThemedView>
        )}
      </ThemedView>

      {onEditParams && (
        <ThemedView variant="border" style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("params")}
          >
            <LinearGradient
              colors={[AiraColors.mutedForeground, AiraColors.muted]}
              style={styles.sectionIcon}
            >
              <Ionicons name="settings" size={20} color="white" />
            </LinearGradient>
            <View style={styles.sectionTitleContainer}>
              <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
                Parámetros Utilizados
              </ThemedText>
              <ThemedText type="small" style={styles.sectionSubtitle}>
                Información usada para generar tu plan
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEditParams}>
              <Ionicons name="create" size={14} color={AiraColors.primary} />
              <ThemedText type="small" style={styles.editButtonText}>
                Editar
              </ThemedText>
            </TouchableOpacity>
            <Ionicons
              name={expandedSections.params ? "chevron-up" : "chevron-down"}
              size={18}
              color={AiraColors.mutedForeground}
            />
          </TouchableOpacity>

          {expandedSections.params && (
            <View style={styles.sectionContent}>
              <View style={styles.paramsGrid}>
                <View style={styles.paramItem}>
                  <ThemedText type="small" style={styles.paramLabel}>
                    Objetivo
                  </ThemedText>
                  <ThemedText type="small" style={styles.paramValue}>
                    {inputParams.objetivo}
                  </ThemedText>
                </View>
                <View style={styles.paramItem}>
                  <ThemedText type="small" style={styles.paramLabel}>
                    Plazo
                  </ThemedText>
                  <ThemedText type="small" style={styles.paramValue}>
                    {inputParams.plazo || "Flexible"}
                  </ThemedText>
                </View>
                <View style={styles.paramItem}>
                  <ThemedText type="small" style={styles.paramLabel}>
                    Edad
                  </ThemedText>
                  <ThemedText type="small" style={styles.paramValue}>
                    {inputParams.age} años
                  </ThemedText>
                </View>
                <View style={styles.paramItem}>
                  <ThemedText type="small" style={styles.paramLabel}>
                    Experiencia
                  </ThemedText>
                  <ThemedText type="small" style={styles.paramValue}>
                    {inputParams.nivel_entrenamiento || "No especificado"}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </ThemedView>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  headerGradient: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  controlsSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
  },
  regenerateButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: AiraColors.primary,

    borderRadius: AiraVariants.cardRadius,
  },
  regenerateButtonText: {
    color: AiraColors.primary,
  },
  saveButton: {
    flex: 1,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  saveGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  saveButtonText: {
    color: "white",
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
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: 2,
  },
  sectionSubtitle: {
    color: AiraColors.mutedForeground,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  editButtonText: {
    color: AiraColors.primary,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  messageContainer: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: AiraColors.primary,
  },
  messageText: {
    lineHeight: 20,
  },
  macrosContainer: {
    gap: 12,
  },
  macrosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  macroCard: {
    flex: 1,
    minWidth: "45%",
    padding: 12,
    borderRadius: 8,
  },
  macroLabel: {
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  macroValue: {},
  subsectionContainer: {
    gap: 8,
  },
  subsectionTitle: {},
  subsectionText: {
    lineHeight: 18,
  },
  mealContainer: {
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  mealTitle: {
    color: AiraColors.primary,
  },
  mealOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealOptionText: {
    flex: 1,
  },
  sessionContainer: {
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  sessionTitle: {},
  sessionDescription: {
    color: AiraColors.mutedForeground,
    lineHeight: 18,
  },
  exercisesContainer: {
    gap: 8,
  },
  exerciseCard: {
    padding: 12,
    borderRadius: 8,

    gap: 4,
  },
  exerciseName: {},
  exerciseDetails: {
    color: AiraColors.mutedForeground,
  },
  exerciseAlternative: {
    color: AiraColors.primary,
  },
  finalMessageContainer: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.2),
  },
  finalMessage: {
    lineHeight: 20,
    textAlign: "center",
  },
  paramsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  paramItem: {
    flex: 1,
    minWidth: "45%",

    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  paramLabel: {
    color: AiraColors.mutedForeground,
  },
  paramValue: {},
  bottomSpacing: {
    height: 32,
  },
});
