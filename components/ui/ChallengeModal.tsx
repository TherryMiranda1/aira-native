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
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color={AiraColors.foreground} />
            </TouchableOpacity>
            <ThemedText type="defaultSemiBold" style={styles.headerTitle}>
              Mini Reto
            </ThemedText>
            <TouchableOpacity style={styles.randomButton} onPress={onRandom}>
              <Ionicons name="shuffle" size={16} color={AiraColors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.challengeCard}>
              <LinearGradient
                colors={categoryColors as [ColorValue, ColorValue]}
                style={styles.challengeIcon}
              >
                <Ionicons name="trophy" size={28} color="white" />
              </LinearGradient>

              <ThemedText type="title" style={styles.challengeTitle}>
                {challenge.title}
              </ThemedText>
              <ThemedText type="default" style={styles.challengeDescription}>
                {challenge.description}
              </ThemedText>

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
                  <ThemedText type="small" style={styles.difficultyBadgeText}>
                    {getDifficultyLabel(challenge.dificultad)}
                  </ThemedText>
                </LinearGradient>

                {challenge.duration && (
                  <View style={styles.metadataBadge}>
                    <Ionicons
                      name="time"
                      size={14}
                      color={AiraColors.mutedForeground}
                    />
                    <ThemedText type="small" style={styles.metadataText}>
                      {challenge.duration}
                    </ThemedText>
                  </View>
                )}
              </View>

              {challenge.instrucciones_adicionales && (
                <View style={styles.instructionsContainer}>
                  <Ionicons name="bulb" size={16} color={AiraColors.primary} />
                  <ThemedText type="small" style={styles.instructionsText}>
                    {challenge.instrucciones_adicionales}
                  </ThemedText>
                </View>
              )}

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
                    <ThemedText type="subtitle" style={styles.timerText}>
                      {formatTime(timer)}
                    </ThemedText>
                  </LinearGradient>
                  {challengeCompleted && (
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.completedText}
                    >
                      ¡Reto Completado! 🎉
                    </ThemedText>
                  )}
                </View>
              )}

              <View style={styles.actionsContainer}>
                {!challengeStarted ? (
                  <TouchableOpacity
                    style={styles.startButton}
                    onPress={startChallenge}
                  >
                    <Ionicons name="play" size={18} color="white" />
                    <ThemedText
                      type="defaultSemiBold"
                      style={styles.startButtonText}
                    >
                      Comenzar
                    </ThemedText>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.challengeActions}>
                    <TouchableOpacity
                      style={styles.pauseButton}
                      onPress={pauseChallenge}
                    >
                      <Ionicons
                        name={isTimerRunning ? "pause" : "play"}
                        size={16}
                        color={AiraColors.primary}
                      />
                      <ThemedText type="small" style={styles.pauseButtonText}>
                        {isTimerRunning ? "Pausar" : "Reanudar"}
                      </ThemedText>
                    </TouchableOpacity>

                    {!challengeCompleted && (
                      <TouchableOpacity
                        style={styles.completeButton}
                        onPress={completeChallenge}
                      >
                        <Ionicons name="checkmark" size={16} color="white" />
                        <ThemedText
                          type="small"
                          style={styles.completeButtonText}
                        >
                          Completar
                        </ThemedText>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity
                      style={styles.resetButton}
                      onPress={resetChallenge}
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
            </View>

            {challenge.beneficios && challenge.beneficios.length > 0 && (
              <View style={styles.benefitsContainer}>
                <ThemedText type="defaultSemiBold" style={styles.benefitsTitle}>
                  Beneficios
                </ThemedText>
                <View style={styles.benefitsList}>
                  {challenge.beneficios.slice(0, 3).map((beneficio, index) => (
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
              </View>
            )}

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

                <ThemedText type="small" style={styles.navigationText}>
                  {currentIndex + 1} de {totalCount}
                </ThemedText>

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
        </View>
      </View>
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
    color: AiraColors.foreground,
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
    padding: 16,
    paddingBottom: 32,
  },
  challengeCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
    shadowColor: AiraColors.foreground,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  challengeIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  challengeTitle: {
    textAlign: "center",
    marginBottom: 8,
    color: AiraColors.foreground,
  },
  challengeDescription: {
    textAlign: "center",
    marginBottom: 16,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  metadataContainer: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyBadgeText: {
    color: "white",
  },
  metadataBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  metadataText: {
    color: AiraColors.mutedForeground,
  },
  instructionsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  instructionsText: {
    flex: 1,
    color: AiraColors.primary,
    lineHeight: 18,
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  timerCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  timerText: {
    color: "white",
  },
  completedText: {
    color: AiraColors.primary,
    textAlign: "center",
  },
  actionsContainer: {
    width: "100%",
    alignItems: "center",
  },
  challengeActions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  startButtonText: {
    color: "white",
  },
  pauseButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  pauseButtonText: {
    color: AiraColors.primary,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  completeButtonText: {
    color: "white",
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  resetButtonText: {
    color: AiraColors.mutedForeground,
  },
  benefitsContainer: {
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  benefitsTitle: {
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  benefitText: {
    flex: 1,
    color: AiraColors.foreground,
    lineHeight: 18,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    minWidth: 80,
    justifyContent: "center",
  },
  navigationText: {
    color: AiraColors.mutedForeground,
  },
});
