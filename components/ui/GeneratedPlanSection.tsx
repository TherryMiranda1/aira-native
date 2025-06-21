import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import {
  PersonalizedPlanOutput,
  PersonalizedPlanInput,
} from "@/services/api/generatedPlan.service";

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
      Alert.alert(
        "¡Éxito!",
        "Tu plan personalizado se ha guardado correctamente",
        [{ text: "Continuar", style: "default" }]
      );
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar el plan. Inténtalo de nuevo.", [
        { text: "OK", style: "default" },
      ]);
    }
  };

  const handleRegenerate = () => {
    Alert.alert(
      "Regenerar Plan",
      "¿Estás segura de que quieres generar un nuevo plan? Se perderá el plan actual.",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Regenerar", style: "destructive", onPress: onRegenerate },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={[AiraColors.primary, AiraColors.accent]}
          style={styles.headerGradient}
        >
          <Ionicons name="sparkles" size={32} color="white" />
          <ThemedText style={styles.headerTitle}>
            Tu Plan Personalizado
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Diseñado especialmente para ti por Aira
          </ThemedText>
        </LinearGradient>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.saveButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.actionButtonGradient}
          >
            <Ionicons
              name={isSaving ? "hourglass" : "bookmark"}
              size={20}
              color="white"
            />
            <ThemedText style={styles.actionButtonText}>
              {isSaving ? "Guardando..." : "Guardar Plan"}
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.regenerateButton]}
          onPress={handleRegenerate}
          disabled={isRegenerating}
        >
          <View style={styles.outlineButton}>
            <Ionicons
              name={isRegenerating ? "hourglass" : "refresh"}
              size={20}
              color={AiraColors.primary}
            />
            <ThemedText style={styles.outlineButtonText}>
              {isRegenerating ? "Regenerando..." : "Regenerar"}
            </ThemedText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Plan Nutricional */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("nutrition")}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.sectionIcon}
          >
            <Ionicons name="restaurant" size={24} color="white" />
          </LinearGradient>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.sectionTitle}>
              Plan Nutricional
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Tu guía alimentaria personalizada
            </ThemedText>
          </View>
          <Ionicons
            name={expandedSections.nutrition ? "chevron-up" : "chevron-down"}
            size={20}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        {expandedSections.nutrition && (
          <View style={styles.sectionContent}>
            {/* Mensaje introductorio */}
            <View style={styles.messageContainer}>
              <ThemedText style={styles.messageText}>
                {plan.planNutricional.mensajeIntroductorio}
              </ThemedText>
            </View>

            {/* Macros */}
            <View style={styles.macrosContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Distribución de Macronutrientes
              </ThemedText>
              <View style={styles.macrosGrid}>
                <View style={styles.macroCard}>
                  <ThemedText style={styles.macroLabel}>Calorías</ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.caloriasTotales}
                  </ThemedText>
                </View>
                <View style={styles.macroCard}>
                  <ThemedText style={styles.macroLabel}>Proteínas</ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.proteinas}
                  </ThemedText>
                </View>
                <View style={styles.macroCard}>
                  <ThemedText style={styles.macroLabel}>
                    Carbohidratos
                  </ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.carbohidratos}
                  </ThemedText>
                </View>
                <View style={styles.macroCard}>
                  <ThemedText style={styles.macroLabel}>Grasas</ThemedText>
                  <ThemedText style={styles.macroValue}>
                    {plan.planNutricional.desgloseMacros.grasas}
                  </ThemedText>
                </View>
              </View>
            </View>

            {/* Distribución de comidas */}
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Distribución de Comidas
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {plan.planNutricional.distribucionComidas}
              </ThemedText>
            </View>

            {/* Ejemplos de recetas */}
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Ideas de Comidas
              </ThemedText>
              {plan.planNutricional.ejemplosRecetasPlatos.map((meal, index) => (
                <View key={index} style={styles.mealContainer}>
                  <ThemedText style={styles.mealTitle}>
                    {meal.tipoComida}
                  </ThemedText>
                  {meal.opciones.map((option, optIndex) => (
                    <View key={optIndex} style={styles.mealOption}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={AiraColors.primary}
                      />
                      <ThemedText style={styles.mealOptionText}>
                        {option}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            {/* Consejos de preparación */}
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Consejos de Preparación
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {plan.planNutricional.consejosPreparacionTiming}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* Programa de Entrenamiento */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("workout")}
        >
          <LinearGradient
            colors={["#3B82F6", "#1E40AF"]}
            style={styles.sectionIcon}
          >
            <Ionicons name="fitness" size={24} color="white" />
          </LinearGradient>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.sectionTitle}>
              Programa de Entrenamiento
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Tu rutina de ejercicios personalizada
            </ThemedText>
          </View>
          <Ionicons
            name={expandedSections.workout ? "chevron-up" : "chevron-down"}
            size={20}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        {expandedSections.workout && (
          <View style={styles.sectionContent}>
            {/* Tipo de ejercicio */}
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Tipo de Ejercicio
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {plan.programaEntrenamiento.tipoEjercicio}
              </ThemedText>
            </View>

            {/* Frecuencia */}
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Frecuencia Semanal
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {plan.programaEntrenamiento.frecuenciaVolumenSemanal}
              </ThemedText>
            </View>

            {/* Sesiones detalladas */}
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Sesiones de Entrenamiento
              </ThemedText>
              {plan.programaEntrenamiento.ejerciciosDetalladosPorSesion.map(
                (session, index) => (
                  <View key={index} style={styles.sessionContainer}>
                    <ThemedText style={styles.sessionTitle}>
                      {session.nombreSesion}
                    </ThemedText>
                    {session.descripcionSesion && (
                      <ThemedText style={styles.sessionDescription}>
                        {session.descripcionSesion}
                      </ThemedText>
                    )}
                    <View style={styles.exercisesContainer}>
                      {session.ejercicios.map((exercise, exIndex) => (
                        <View key={exIndex} style={styles.exerciseCard}>
                          <ThemedText style={styles.exerciseName}>
                            {exercise.nombreEjercicio}
                          </ThemedText>
                          <ThemedText style={styles.exerciseDetails}>
                            {exercise.seriesRepeticiones} • Descanso:{" "}
                            {exercise.descanso}
                          </ThemedText>
                          {exercise.alternativaOpcional && (
                            <ThemedText style={styles.exerciseAlternative}>
                              Alternativa: {exercise.alternativaOpcional}
                            </ThemedText>
                          )}
                        </View>
                      ))}
                    </View>
                  </View>
                )
              )}
            </View>

            {/* Opciones alternativas */}
            {plan.programaEntrenamiento.opcionesAlternativas && (
              <View style={styles.subsectionContainer}>
                <ThemedText style={styles.subsectionTitle}>
                  Opciones Alternativas
                </ThemedText>
                <ThemedText style={styles.subsectionText}>
                  {plan.programaEntrenamiento.opcionesAlternativas}
                </ThemedText>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Seguimiento y Ajustes */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection("tracking")}
        >
          <LinearGradient
            colors={["#F59E0B", "#D97706"]}
            style={styles.sectionIcon}
          >
            <Ionicons name="analytics" size={24} color="white" />
          </LinearGradient>
          <View style={styles.sectionTitleContainer}>
            <ThemedText style={styles.sectionTitle}>
              Seguimiento y Progreso
            </ThemedText>
            <ThemedText style={styles.sectionSubtitle}>
              Cómo medir tu evolución
            </ThemedText>
          </View>
          <Ionicons
            name={expandedSections.tracking ? "chevron-up" : "chevron-down"}
            size={20}
            color={AiraColors.mutedForeground}
          />
        </TouchableOpacity>

        {expandedSections.tracking && (
          <View style={styles.sectionContent}>
            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Indicadores de Progreso
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {plan.sugerenciasSeguimientoAjustes.indicadoresProgreso}
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Revisiones y Modificaciones
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {
                  plan.sugerenciasSeguimientoAjustes
                    .frecuenciaRevisionesModificaciones
                }
              </ThemedText>
            </View>

            <View style={styles.subsectionContainer}>
              <ThemedText style={styles.subsectionTitle}>
                Estrategias de Motivación
              </ThemedText>
              <ThemedText style={styles.subsectionText}>
                {
                  plan.sugerenciasSeguimientoAjustes
                    .estrategiasMotivacionAdherencia
                }
              </ThemedText>
            </View>

            <View style={styles.finalMessageContainer}>
              <ThemedText style={styles.finalMessage}>
                {plan.sugerenciasSeguimientoAjustes.mensajeFinalMotivador}
              </ThemedText>
            </View>
          </View>
        )}
      </View>

      {/* Parámetros utilizados */}
      {onEditParams && (
        <View style={styles.sectionContainer}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection("params")}
          >
            <LinearGradient
              colors={[AiraColors.mutedForeground, AiraColors.muted]}
              style={styles.sectionIcon}
            >
              <Ionicons name="settings" size={24} color="white" />
            </LinearGradient>
            <View style={styles.sectionTitleContainer}>
              <ThemedText style={styles.sectionTitle}>
                Parámetros Utilizados
              </ThemedText>
              <ThemedText style={styles.sectionSubtitle}>
                Información usada para generar tu plan
              </ThemedText>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={onEditParams}>
              <Ionicons name="create" size={16} color={AiraColors.primary} />
              <ThemedText style={styles.editButtonText}>Editar</ThemedText>
            </TouchableOpacity>
            <Ionicons
              name={expandedSections.params ? "chevron-up" : "chevron-down"}
              size={20}
              color={AiraColors.mutedForeground}
            />
          </TouchableOpacity>

          {expandedSections.params && (
            <View style={styles.sectionContent}>
              <View style={styles.paramsGrid}>
                <View style={styles.paramItem}>
                  <ThemedText style={styles.paramLabel}>Objetivo</ThemedText>
                  <ThemedText style={styles.paramValue}>
                    {inputParams.objetivo}
                  </ThemedText>
                </View>
                <View style={styles.paramItem}>
                  <ThemedText style={styles.paramLabel}>Plazo</ThemedText>
                  <ThemedText style={styles.paramValue}>
                    {inputParams.plazo || "Flexible"}
                  </ThemedText>
                </View>
                <View style={styles.paramItem}>
                  <ThemedText style={styles.paramLabel}>Edad</ThemedText>
                  <ThemedText style={styles.paramValue}>
                    {inputParams.age} años
                  </ThemedText>
                </View>
                <View style={styles.paramItem}>
                  <ThemedText style={styles.paramLabel}>Experiencia</ThemedText>
                  <ThemedText style={styles.paramValue}>
                    {inputParams.nivel_entrenamiento || "No especificado"}
                  </ThemedText>
                </View>
              </View>
            </View>
          )}
        </View>
      )}

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  header: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  headerGradient: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    borderRadius: AiraVariants.buttonRadius,
    overflow: "hidden",
  },
  saveButton: {},
  regenerateButton: {},
  actionButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  outlineButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: AiraColors.primary,
    backgroundColor: AiraColors.background,
    borderRadius: AiraVariants.buttonRadius,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  outlineButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 14,
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
    fontSize: 12,
    fontWeight: "500",
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
    fontSize: 16,
    color: AiraColors.foreground,
    lineHeight: 24,
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
    backgroundColor: AiraColors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  macroLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  subsectionContainer: {
    gap: 8,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  subsectionText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  mealContainer: {
    backgroundColor: AiraColors.background,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  mealTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  mealOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealOptionText: {
    fontSize: 14,
    color: AiraColors.foreground,
    flex: 1,
  },
  sessionContainer: {
    backgroundColor: AiraColors.background,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  sessionDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  exercisesContainer: {
    gap: 8,
  },
  exerciseCard: {
    backgroundColor: AiraColors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    gap: 4,
  },
  exerciseName: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  exerciseDetails: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  exerciseAlternative: {
    fontSize: 12,
    color: AiraColors.primary,
    fontStyle: "italic",
  },
  finalMessageContainer: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.2),
  },
  finalMessage: {
    fontSize: 16,
    color: AiraColors.foreground,
    lineHeight: 24,
    textAlign: "center",
    fontWeight: "500",
  },
  paramsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  paramItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: AiraColors.background,
    padding: 12,
    borderRadius: 8,
    gap: 4,
  },
  paramLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: AiraColors.mutedForeground,
  },
  paramValue: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  bottomSpacing: {
    height: 40,
  },
});
