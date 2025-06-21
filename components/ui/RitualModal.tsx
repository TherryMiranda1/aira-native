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
import { BlurView } from "expo-blur";

import { ThemedText } from "../ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { Ritual } from "@/services/api/ritual.service";

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
}: RitualModalProps) => {
  const [ritualStarted, setRitualStarted] = useState(false);
  const [ritualCompleted, setRitualCompleted] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
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

  // Reset ritual state when modal closes or ritual changes
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

  const getEnergyLabel = (energy: string) => {
    switch (energy) {
      case "bajo":
        return "Energía Baja";
      case "medio":
        return "Energía Media";
      case "alto":
        return "Energía Alta";
      default:
        return energy;
    }
  };

  const getMomentLabel = (moment: string) => {
    switch (moment) {
      case "manana":
        return "Mañana";
      case "mediodia":
        return "Mediodía";
      case "tarde":
        return "Tarde";
      case "noche":
        return "Noche";
      case "cualquier-momento":
        return "Cualquier momento";
      default:
        return moment;
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
    setCompletedSteps([]);
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
    }
  };

  const previousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const completeStep = () => {
    if (!completedSteps.includes(currentStepIndex)) {
      setCompletedSteps([...completedSteps, currentStepIndex]);
    }

    if (currentStepIndex === ritual.pasos.length - 1) {
      completeRitual();
    } else {
      nextStep();
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
      <BlurView intensity={20} style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={AiraColors.foreground} />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>
              Ritual de Bienestar
            </ThemedText>
            <View style={styles.headerSpacer} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Navigation Controls */}
            <View style={styles.navigationContainer}>
              <View style={styles.navigationLeft}>
                <ThemedText style={styles.navigationText}>
                  {currentIndex + 1} de {totalCount}
                </ThemedText>
                <View style={styles.navigationButtons}>
                  <TouchableOpacity
                    style={[
                      styles.navigationButton,
                      totalCount <= 1 && styles.navigationButtonDisabled,
                    ]}
                    onPress={onPrevious}
                    disabled={totalCount <= 1}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.navigationButton,
                      totalCount <= 1 && styles.navigationButtonDisabled,
                    ]}
                    onPress={onNext}
                    disabled={totalCount <= 1}
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={AiraColors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity style={styles.randomButton} onPress={onRandom}>
                <Ionicons name="shuffle" size={16} color={AiraColors.primary} />
                <ThemedText style={styles.randomButtonText}>
                  Sorpréndeme
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Ritual Card */}
            <View style={styles.ritualCard}>
              <LinearGradient
                colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.05)"]}
                style={styles.ritualCardGradient}
              />

              {/* Ritual Icon */}
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.ritualIcon}
              >
                <Ionicons name="sparkles" size={32} color="white" />
              </LinearGradient>

              {/* Ritual Title & Description */}
              <ThemedText style={styles.ritualTitle}>
                {ritual.titulo}
              </ThemedText>
              <ThemedText style={styles.ritualDescription}>
                {ritual.descripcion}
              </ThemedText>

              {/* Metadata */}
              <View style={styles.metadataContainer}>
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
                    <ThemedText style={styles.energyBadgeText}>
                      {getEnergyLabel(ritual.nivel_energia)}
                    </ThemedText>
                  </LinearGradient>
                )}

                {ritual.duracion_total && (
                  <View style={styles.durationBadge}>
                    <Ionicons
                      name="time"
                      size={14}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.durationBadgeText}>
                      {ritual.duracion_total}
                    </ThemedText>
                  </View>
                )}

                {ritual.momento_recomendado && (
                  <View style={styles.momentBadge}>
                    <Ionicons
                      name="sunny"
                      size={14}
                      color={AiraColors.accent}
                    />
                    <ThemedText style={styles.momentBadgeText}>
                      {getMomentLabel(ritual.momento_recomendado)}
                    </ThemedText>
                  </View>
                )}

                {ritual.popularidad > 0 && (
                  <View style={styles.popularityBadge}>
                    <Ionicons
                      name="heart"
                      size={14}
                      color={AiraColors.accent}
                    />
                    <ThemedText style={styles.popularityBadgeText}>
                      {ritual.popularidad}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Steps Progress */}
              {ritualStarted && (
                <View style={styles.progressContainer}>
                  <ThemedText style={styles.progressTitle}>
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
              )}

              {/* Timer */}
              {ritualStarted && (
                <View style={styles.timerContainer}>
                  <LinearGradient
                    colors={
                      ritualCompleted
                        ? ["#10B981", "#059669"]
                        : (categoryColors as [ColorValue, ColorValue])
                    }
                    style={styles.timerCircle}
                  >
                    <ThemedText style={styles.timerText}>
                      {formatTime(timer)}
                    </ThemedText>
                  </LinearGradient>
                  {ritualCompleted && (
                    <ThemedText style={styles.completedText}>
                      ¡Ritual Completado! 🌟
                    </ThemedText>
                  )}
                </View>
              )}

              {/* Current Step Display */}
              {ritualStarted && currentStep && (
                <View style={styles.currentStepContainer}>
                  <LinearGradient
                    colors={categoryColors as [ColorValue, ColorValue]}
                    style={styles.stepIcon}
                  >
                    <Ionicons name="leaf" size={20} color="white" />
                  </LinearGradient>
                  <View style={styles.stepContent}>
                    <ThemedText style={styles.stepTitle}>
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
                        <ThemedText style={styles.stepDurationText}>
                          {currentStep.duracion}
                        </ThemedText>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {!ritualStarted ? (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.startButton]}
                    onPress={startRitual}
                  >
                    <Ionicons name="play" size={18} color="white" />
                    <ThemedText style={styles.startButtonText}>
                      Comenzar Ritual
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.ritualActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.pauseButton]}
                      onPress={pauseRitual}
                    >
                      <Ionicons
                        name={isTimerRunning ? "pause" : "play"}
                        size={16}
                        color={AiraColors.primary}
                      />
                      <ThemedText style={styles.pauseButtonText}>
                        {isTimerRunning ? "Pausar" : "Reanudar"}
                      </ThemedText>
                    </TouchableOpacity>

                    {!ritualCompleted && (
                      <>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.stepButton]}
                          onPress={completeStep}
                        >
                          <Ionicons name="checkmark" size={16} color="white" />
                          <ThemedText style={styles.stepButtonText}>
                            {currentStepIndex === ritual.pasos.length - 1
                              ? "Finalizar"
                              : "Siguiente Paso"}
                          </ThemedText>
                        </TouchableOpacity>

                        <View style={styles.stepNavigation}>
                          <TouchableOpacity
                            style={[
                              styles.stepNavButton,
                              currentStepIndex === 0 &&
                                styles.stepNavButtonDisabled,
                            ]}
                            onPress={previousStep}
                            disabled={currentStepIndex === 0}
                          >
                            <Ionicons
                              name="chevron-back"
                              size={16}
                              color={AiraColors.mutedForeground}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            style={[
                              styles.stepNavButton,
                              currentStepIndex === ritual.pasos.length - 1 &&
                                styles.stepNavButtonDisabled,
                            ]}
                            onPress={nextStep}
                            disabled={
                              currentStepIndex === ritual.pasos.length - 1
                            }
                          >
                            <Ionicons
                              name="chevron-forward"
                              size={16}
                              color={AiraColors.mutedForeground}
                            />
                          </TouchableOpacity>
                        </View>
                      </>
                    )}

                    <TouchableOpacity
                      style={[styles.actionButton, styles.resetButton]}
                      onPress={resetRitual}
                    >
                      <Ionicons
                        name="refresh"
                        size={16}
                        color={AiraColors.mutedForeground}
                      />
                      <ThemedText style={styles.resetButtonText}>
                        Reiniciar
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            {/* Benefits */}
            {ritual.beneficios && ritual.beneficios.length > 0 && (
              <View style={styles.benefitsContainer}>
                <ThemedText style={styles.benefitsTitle}>
                  Beneficios de este ritual
                </ThemedText>
                <View style={styles.benefitsList}>
                  {ritual.beneficios.map((beneficio, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={AiraColors.primary}
                      />
                      <ThemedText style={styles.benefitText}>
                        {beneficio.beneficio}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* All Steps Preview */}
            {!ritualStarted && (
              <View style={styles.stepsPreviewContainer}>
                <ThemedText style={styles.stepsPreviewTitle}>
                  Pasos del ritual ({ritual.pasos.length})
                </ThemedText>
                <View style={styles.stepsPreviewList}>
                  {ritual.pasos.map((paso, index) => (
                    <View key={index} style={styles.stepPreviewItem}>
                      <View style={styles.stepPreviewNumber}>
                        <ThemedText style={styles.stepPreviewNumberText}>
                          {index + 1}
                        </ThemedText>
                      </View>
                      <View style={styles.stepPreviewContent}>
                        <ThemedText style={styles.stepPreviewTitle}>
                          {paso.titulo}
                        </ThemedText>
                        <ThemedText style={styles.stepPreviewDescription}>
                          {paso.descripcion}
                        </ThemedText>
                        {paso.duracion && (
                          <View style={styles.stepPreviewDuration}>
                            <Ionicons
                              name="time"
                              size={12}
                              color={AiraColors.mutedForeground}
                            />
                            <ThemedText style={styles.stepPreviewDurationText}>
                              {paso.duracion}
                            </ThemedText>
                          </View>
                        )}
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Inspirational Footer */}
            <View style={styles.footer}>
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.footerIcon}
              >
                <Ionicons name="sparkles" size={20} color="white" />
              </LinearGradient>
              <ThemedText style={styles.footerTitle}>
                Rituales Sagrados de Bienestar
              </ThemedText>
              <ThemedText style={styles.footerDescription}>
                Cada ritual está diseñado para crear momentos especiales de
                conexión contigo misma, nutrir tu alma y transformar tu día con
                amor y cuidado.
              </ThemedText>
            </View>
          </ScrollView>
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  navigationLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  navigationText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  navigationButtons: {
    flexDirection: "row",
    gap: 4,
  },
  navigationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  navigationButtonDisabled: {
    opacity: 0.3,
  },
  randomButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    gap: 6,
  },
  randomButtonText: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  ritualCard: {
    backgroundColor: AiraColors.card,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: AiraVariants.cardRadius,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    position: "relative",
    overflow: "hidden",
  },
  ritualCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  ritualIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  ritualTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 12,
  },
  ritualDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  metadataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginBottom: 24,
  },
  energyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  energyBadgeText: {
    fontSize: 13,
    color: "white",
    fontWeight: "600",
  },
  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  durationBadgeText: {
    fontSize: 13,
    color: AiraColors.mutedForeground,
  },
  momentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  momentBadgeText: {
    fontSize: 13,
    color: AiraColors.accent,
    fontWeight: "500",
  },
  popularityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  popularityBadgeText: {
    fontSize: 13,
    color: AiraColors.accent,
    fontWeight: "500",
  },
  progressContainer: {
    width: "100%",
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  timerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  timerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
  },
  completedText: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.primary,
    textAlign: "center",
  },
  currentStepContainer: {
    flexDirection: "row",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    width: "100%",
    gap: 12,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
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
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  actionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  ritualActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
    minWidth: 100,
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: AiraColors.primary,
  },
  startButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  pauseButton: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  pauseButtonText: {
    fontSize: 14,
    color: AiraColors.primary,
    fontWeight: "500",
  },
  stepButton: {
    backgroundColor: AiraColors.primary,
  },
  stepButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
  },
  stepNavigation: {
    flexDirection: "row",
    gap: 4,
  },
  stepNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  stepNavButtonDisabled: {
    opacity: 0.3,
  },
  resetButton: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
  },
  resetButtonText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    fontWeight: "500",
  },
  benefitsContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 16,
  },
  benefitsList: {
    gap: 12,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  stepsPreviewContainer: {
    marginHorizontal: 16,
    marginBottom: 32,
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 20,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  stepsPreviewTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 16,
  },
  stepsPreviewList: {
    gap: 16,
  },
  stepPreviewItem: {
    flexDirection: "row",
    gap: 12,
  },
  stepPreviewNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
  },
  stepPreviewNumberText: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.primary,
  },
  stepPreviewContent: {
    flex: 1,
  },
  stepPreviewTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 4,
  },
  stepPreviewDescription: {
    fontSize: 13,
    color: AiraColors.mutedForeground,
    lineHeight: 18,
    marginBottom: 8,
  },
  stepPreviewDuration: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  stepPreviewDurationText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  footerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  footerDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 300,
  },
});
