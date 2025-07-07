import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ColorValue,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "../../components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Ritual } from "@/services/api/ritual.service";
import { ThemedView } from "../ThemedView";

interface RitualModalProps {
  visible: boolean;
  ritual: Ritual;
  categoryColors: string[];
  categoryLabel: string;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRandom: () => void;
  onComplete: (ritualId: string) => void;
  onSchedule?: (ritualId: string, ritualTitle: string) => void;
}

export const RitualModal = ({
  visible,
  ritual,
  categoryColors,
  categoryLabel,
  currentIndex,
  totalCount,
  onClose,
  onNext,
  onPrevious,
  onRandom,
  onComplete,
  onSchedule,
}: RitualModalProps) => {
  const [ritualStarted, setRitualStarted] = useState(false);
  const [ritualCompleted, setRitualCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  useEffect(() => {
    if (!visible || !ritual) {
      resetRitual();
    }
  }, [visible, ritual?.id]);

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case "bajo":
        return ["#10B981", "#059669"];
      case "medio":
        return ["#F59E0B", "#D97706"];
      case "alto":
        return ["#EF4444", "#DC2626"];
      default:
        return ["#6B7280", "#4B5563"];
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetRitual = () => {
    setRitualStarted(false);
    setRitualCompleted(false);
    setCurrentStepIndex(0);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const startRitual = () => {
    setRitualStarted(true);
    setIsTimerRunning(true);
  };

  const pauseRitual = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const nextStep = () => {
    if (currentStepIndex < ritual.pasos.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      completeRitual();
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeRitual = () => {
    setRitualCompleted(true);
    setIsTimerRunning(false);
    onComplete(ritual.id);
  };

  const currentStep = ritual.pasos[currentStepIndex];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <ThemedView style={styles.container}>
        {/* Header minimalista */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color={AiraColors.foreground} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <ThemedText type="defaultSemiBold">Ritual</ThemedText>
            <ThemedText type="small" style={styles.headerSubtitle}>
              {currentIndex + 1} de {totalCount}
            </ThemedText>
          </View>

          <TouchableOpacity style={styles.randomButton} onPress={onRandom}>
            <Ionicons name="shuffle" size={20} color={AiraColors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Ritual Card Principal */}
          <ThemedView variant="secondary" style={styles.ritualCard}>
            {/* Icono y título */}
            <LinearGradient
              colors={categoryColors as [ColorValue, ColorValue]}
              style={styles.ritualIcon}
            >
              <Ionicons name="sparkles" size={28} color="white" />
            </LinearGradient>

            <ThemedText type="title" style={styles.ritualTitle}>
              {ritual.titulo}
            </ThemedText>

            <ThemedText style={styles.ritualDescription}>
              {ritual.descripcion}
            </ThemedText>

            {/* Metadata simplificada */}
            <View style={styles.metadataContainer}>
              {ritual.duracion_total && (
                <View style={styles.metadataBadge}>
                  <Ionicons
                    name="time"
                    size={14}
                    color={AiraColors.mutedForeground}
                  />
                  <ThemedText type="small" style={styles.metadataText}>
                    {ritual.duracion_total}
                  </ThemedText>
                </View>
              )}

              {ritual.nivel_energia && (
                <LinearGradient
                  colors={
                    getEnergyColor(ritual.nivel_energia) as [
                      ColorValue,
                      ColorValue
                    ]
                  }
                  style={styles.energyBadge}
                >
                  <ThemedText type="small" style={styles.energyText}>
                    {ritual.nivel_energia === "bajo"
                      ? "Suave"
                      : ritual.nivel_energia === "medio"
                      ? "Moderado"
                      : "Intenso"}
                  </ThemedText>
                </LinearGradient>
              )}
            </View>

            {/* Timer cuando está iniciado */}
            {ritualStarted && (
              <View style={styles.timerSection}>
                <LinearGradient
                  colors={
                    ritualCompleted
                      ? ["#10B981", "#059669"]
                      : (categoryColors as [ColorValue, ColorValue])
                  }
                  style={styles.timerCircle}
                >
                  <ThemedText type="title" style={styles.timerText}>
                    {formatTime(timer)}
                  </ThemedText>
                </LinearGradient>

                {ritualCompleted && (
                  <ThemedText
                    type="defaultSemiBold"
                    style={styles.completedText}
                  >
                    ¡Ritual Completado! ✨
                  </ThemedText>
                )}
              </View>
            )}

            {/* Paso actual cuando está iniciado */}
            {ritualStarted && !ritualCompleted && currentStep && (
              <View style={styles.currentStepCard}>
                <View style={styles.stepHeader}>
                  <ThemedText type="defaultSemiBold">
                    Paso {currentStepIndex + 1} de {ritual.pasos.length}
                  </ThemedText>

                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={categoryColors as [ColorValue, ColorValue]}
                      style={[
                        styles.progressFill,
                        {
                          width: `${
                            ((currentStepIndex + 1) / ritual.pasos.length) * 100
                          }%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                <ThemedText type="defaultSemiBold" style={styles.stepTitle}>
                  {currentStep.titulo}
                </ThemedText>

                <ThemedText style={styles.stepDescription}>
                  {currentStep.descripcion}
                </ThemedText>

                {currentStep.duracion && (
                  <View style={styles.stepDuration}>
                    <Ionicons
                      name="time"
                      size={12}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText type="small" style={styles.stepDurationText}>
                      {currentStep.duracion}
                    </ThemedText>
                  </View>
                )}
              </View>
            )}

            {/* Botones de acción simplificados */}
            <View style={styles.actionsContainer}>
              {!ritualStarted ? (
                <View style={styles.primaryActions}>
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={startRitual}
                  >
                    <Ionicons name="play" size={20} color="white" />
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.startButtonText}
                    >
                      Comenzar
                    </ThemedText>
                  </TouchableOpacity>
                  {onSchedule && (
                    <TouchableOpacity
                      style={styles.scheduleButton}
                      onPress={() => onSchedule(ritual.id, ritual.titulo)}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={20}
                        color={AiraColors.primary}
                      />
                      <ThemedText
                        type="defaultSemiBold"
                        style={styles.scheduleButtonText}
                      >
                        Programar
                      </ThemedText>
                    </TouchableOpacity>
                  )}
                </View>
              ) : (
                <View style={styles.ritualActions}>
                  {!ritualCompleted && (
                    <>
                      <TouchableOpacity
                        style={styles.pauseButton}
                        onPress={pauseRitual}
                      >
                        <Ionicons
                          name={isTimerRunning ? "pause" : "play"}
                          size={18}
                          color={AiraColors.primary}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.nextButton}
                        onPress={nextStep}
                      >
                        <ThemedText
                          type="defaultSemiBold"
                          style={styles.nextButtonText}
                        >
                          {currentStepIndex === ritual.pasos.length - 1
                            ? "Finalizar"
                            : "Siguiente"}
                        </ThemedText>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="white"
                        />
                      </TouchableOpacity>

                      {currentStepIndex > 0 && (
                        <TouchableOpacity
                          style={styles.backButton}
                          onPress={previousStep}
                        >
                          <Ionicons
                            name="arrow-back"
                            size={16}
                            color={AiraColors.mutedForeground}
                          />
                        </TouchableOpacity>
                      )}
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={resetRitual}
                  >
                    <Ionicons
                      name="refresh"
                      size={16}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText type="small" style={styles.resetButtonText}>
                      Reiniciar
                    </ThemedText>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ThemedView>

          {/* Vista previa de pasos (solo cuando no está iniciado) */}
          {!ritualStarted && (
            <ThemedView variant="secondary" style={styles.stepsPreview}>
              <ThemedText type="defaultSemiBold" style={styles.stepsTitle}>
                Pasos del ritual ({ritual.pasos.length})
              </ThemedText>

              <View style={styles.stepsList}>
                {ritual.pasos.map((paso, index) => (
                  <View key={index} style={styles.stepPreviewItem}>
                    <View style={styles.stepNumber}>
                      <ThemedText type="small" style={styles.stepNumberText}>
                        {index + 1}
                      </ThemedText>
                    </View>

                    <View style={styles.stepPreviewContent}>
                      <ThemedText type="defaultSemiBold">
                        {paso.titulo}
                      </ThemedText>
                      <ThemedText
                        type="small"
                        style={styles.stepPreviewDescription}
                      >
                        {paso.descripcion}
                      </ThemedText>
                      {paso.duracion && (
                        <ThemedText
                          type="small"
                          style={styles.stepPreviewDuration}
                        >
                          {paso.duracion}
                        </ThemedText>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </ThemedView>
          )}

          {/* Beneficios simplificados */}
          {ritual.beneficios && ritual.beneficios.length > 0 && (
            <View style={styles.benefitsContainer}>
              <ThemedText type="defaultSemiBold" style={styles.benefitsTitle}>
                Beneficios
              </ThemedText>

              {ritual.beneficios.slice(0, 3).map((beneficio, index) => (
                <View key={index} style={styles.benefitItem}>
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={AiraColors.primary}
                  />
                  <ThemedText type="small" style={styles.benefitText}>
                    {beneficio.beneficio}
                  </ThemedText>
                </View>
              ))}
            </View>
          )}

          {/* Navegación entre rituales */}
          {totalCount > 1 && (
            <View style={styles.navigationContainer}>
              <TouchableOpacity style={styles.navButton} onPress={onPrevious}>
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={AiraColors.foreground}
                />
                <ThemedText type="small">Anterior</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity style={styles.navButton} onPress={onNext}>
                <ThemedText type="small">Siguiente</ThemedText>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={AiraColors.foreground}
                />
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerSubtitle: {
    color: AiraColors.mutedForeground,
    marginTop: 2,
  },
  randomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  ritualCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  ritualIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  ritualTitle: {
    textAlign: "center",
    marginBottom: 8,
  },
  ritualDescription: {
    textAlign: "center",
    color: AiraColors.mutedForeground,
    marginBottom: 20,
    lineHeight: 22,
  },
  metadataContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  metadataBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  metadataText: {
    color: AiraColors.mutedForeground,
  },
  energyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  energyText: {
    color: "white",
  },
  timerSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  timerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  timerText: {
    color: "white",
  },
  completedText: {
    color: AiraColors.primary,
    textAlign: "center",
  },
  currentStepCard: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    width: "100%",
  },
  stepHeader: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 2,
    marginTop: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  stepTitle: {
    marginBottom: 8,
  },
  stepDescription: {
    color: AiraColors.mutedForeground,
    lineHeight: 20,
    marginBottom: 8,
  },
  stepDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepDurationText: {
    color: AiraColors.mutedForeground,
  },
  actionsContainer: {
    width: "100%",
  },
  startButton: {
    flex: 1,
    backgroundColor: AiraColors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  startButtonText: {
    color: "white",
  },
  ritualActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },
  pauseButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  nextButton: {
    backgroundColor: AiraColors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  nextButtonText: {
    color: "white",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  resetButtonText: {
    color: AiraColors.mutedForeground,
  },
  stepsPreview: {
    borderRadius: 16,
    padding: 20,

    marginBottom: 20,
  },
  stepsTitle: {
    marginBottom: 16,
  },
  stepsList: {
    gap: 12,
  },
  stepPreviewItem: {
    flexDirection: "row",
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumberText: {
    color: AiraColors.primary,
  },
  stepPreviewContent: {
    flex: 1,
  },
  stepPreviewDescription: {
    color: AiraColors.mutedForeground,
    lineHeight: 18,
    marginTop: 2,
  },
  stepPreviewDuration: {
    color: AiraColors.mutedForeground,
    marginTop: 4,
  },
  benefitsContainer: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  benefitsTitle: {
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  benefitText: {
    flex: 1,

    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  scheduleButton: {
    flex: 1,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: AiraColors.primary,
  },
  scheduleButtonText: {
    color: AiraColors.primary,
  },
});
