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
import { Challenge } from "@/services/api/challenge.service";

interface ChallengeModalProps {
  visible: boolean;
  challenge: Challenge;
  categoryColors: string[];
  categoryLabel: string;
  currentIndex: number;
  totalCount: number;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onRandom: () => void;
  onComplete: (challengeId: string) => void;
}

export const ChallengeModal = ({
  visible,
  challenge,
  categoryColors,
  categoryLabel,
  currentIndex,
  totalCount,
  onClose,
  onNext,
  onPrevious,
  onRandom,
  onComplete,
}: ChallengeModalProps) => {
  const [challengeStarted, setChallengeStarted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);
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

  // Reset challenge state when modal closes or challenge changes
  useEffect(() => {
    if (!visible || !challenge) {
      resetChallenge();
    }
  }, [visible, challenge?.id]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return ["#10B981", "#059669"];
      case "intermedio":
        return ["#F59E0B", "#D97706"];
      case "avanzado":
        return ["#EF4444", "#DC2626"];
      default:
        return ["#6B7280", "#4B5563"];
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "facil":
        return "Fácil";
      case "intermedio":
        return "Intermedio";
      case "avanzado":
        return "Avanzado";
      default:
        return difficulty;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const resetChallenge = () => {
    setChallengeStarted(false);
    setChallengeCompleted(false);
    setTimer(0);
    setIsTimerRunning(false);
  };

  const startChallenge = () => {
    setChallengeStarted(true);
    setIsTimerRunning(true);
  };

  const pauseChallenge = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const completeChallenge = () => {
    setChallengeCompleted(true);
    setIsTimerRunning(false);
    onComplete(challenge.id);
  };

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
            <ThemedText style={styles.headerTitle}>Mini Reto</ThemedText>
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

            {/* Challenge Card */}
            <View style={styles.challengeCard}>
              <LinearGradient
                colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.05)"]}
                style={styles.challengeCardGradient}
              />

              {/* Challenge Icon */}
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.challengeIcon}
              >
                <Ionicons name="trophy" size={32} color="white" />
              </LinearGradient>

              {/* Challenge Title & Description */}
              <ThemedText style={styles.challengeTitle}>
                {challenge.title}
              </ThemedText>
              <ThemedText style={styles.challengeDescription}>
                {challenge.description}
              </ThemedText>

              {/* Metadata */}
              <View style={styles.metadataContainer}>
                <LinearGradient
                  colors={
                    getDifficultyColor(challenge.dificultad) as [
                      ColorValue,
                      ColorValue
                    ]
                  }
                  style={styles.difficultyBadge}
                >
                  <ThemedText style={styles.difficultyBadgeText}>
                    {getDifficultyLabel(challenge.dificultad)}
                  </ThemedText>
                </LinearGradient>

                {challenge.duration && (
                  <View style={styles.durationBadge}>
                    <Ionicons
                      name="time"
                      size={14}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText style={styles.durationBadgeText}>
                      {challenge.duration}
                    </ThemedText>
                  </View>
                )}

                {challenge.popularidad > 0 && (
                  <View style={styles.popularityBadge}>
                    <Ionicons
                      name="heart"
                      size={14}
                      color={AiraColors.accent}
                    />
                    <ThemedText style={styles.popularityBadgeText}>
                      {challenge.popularidad}
                    </ThemedText>
                  </View>
                )}
              </View>

              {/* Additional Instructions */}
              {challenge.instrucciones_adicionales && (
                <View style={styles.instructionsContainer}>
                  <Ionicons name="bulb" size={16} color={AiraColors.primary} />
                  <ThemedText style={styles.instructionsText}>
                    {challenge.instrucciones_adicionales}
                  </ThemedText>
                </View>
              )}

              {/* Timer */}
              {challengeStarted && (
                <View style={styles.timerContainer}>
                  <LinearGradient
                    colors={
                      challengeCompleted
                        ? ["#10B981", "#059669"]
                        : (categoryColors as [ColorValue, ColorValue])
                    }
                    style={styles.timerCircle}
                  >
                    <ThemedText style={styles.timerText}>
                      {formatTime(timer)}
                    </ThemedText>
                  </LinearGradient>
                  {challengeCompleted && (
                    <ThemedText style={styles.completedText}>
                      ¡Reto Completado! 🎉
                    </ThemedText>
                  )}
                </View>
              )}

              {/* Actions */}
              <View style={styles.actionsContainer}>
                {!challengeStarted ? (
                  <TouchableOpacity
                    style={[styles.actionButton, styles.startButton]}
                    onPress={startChallenge}
                  >
                    <Ionicons name="play" size={18} color="white" />
                    <ThemedText style={styles.startButtonText}>
                      Comenzar Reto
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.challengeActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.pauseButton]}
                      onPress={pauseChallenge}
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

                    {!challengeCompleted && (
                      <TouchableOpacity
                        style={[styles.actionButton, styles.completeButton]}
                        onPress={completeChallenge}
                      >
                        <Ionicons name="checkmark" size={16} color="white" />
                        <ThemedText style={styles.completeButtonText}>
                          Completar
                        </ThemedText>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={[styles.actionButton, styles.resetButton]}
                      onPress={resetChallenge}
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
            {challenge.beneficios && challenge.beneficios.length > 0 && (
              <View style={styles.benefitsContainer}>
                <ThemedText style={styles.benefitsTitle}>
                  Beneficios de este reto
                </ThemedText>
                <View style={styles.benefitsList}>
                  {challenge.beneficios.map((beneficio, index) => (
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

            {/* Inspirational Footer */}
            <View style={styles.footer}>
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.footerIcon}
              >
                <Ionicons name="trophy" size={20} color="white" />
              </LinearGradient>
              <ThemedText style={styles.footerTitle}>
                Construye Hábitos Amables
              </ThemedText>
              <ThemedText style={styles.footerDescription}>
                Cada mini reto está diseñado para ser alcanzable y placentero.
                Se trata de progreso constante y amable contigo misma.
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
  challengeCard: {
    backgroundColor: AiraColors.card,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: AiraVariants.cardRadius,
    padding: 32,
    alignItems: "center",
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    position: "relative",
    overflow: "hidden",
  },
  challengeCardGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  challengeIcon: {
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
  challengeTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 12,
  },
  challengeDescription: {
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
  difficultyBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  difficultyBadgeText: {
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
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  instructionsText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.primary,
    lineHeight: 20,
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
  actionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  challengeActions: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
    justifyContent: "center",
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
  completeButton: {
    backgroundColor: AiraColors.primary,
  },
  completeButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "500",
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
