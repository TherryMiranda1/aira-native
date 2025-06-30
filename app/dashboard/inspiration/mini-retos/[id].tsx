import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors } from "@/constants/Colors";
import { challengeService, Challenge } from "@/services/api/challenge.service";
import { ChallengeModal } from "@/features/challenges/ChallengeModal";
import { ChallengeItem } from "@/features/challenges/ChallengeItem";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingState } from "@/components/States/LoadingState";
import { ErrorState } from "@/components/States/ErrorState";
import { ScheduleEventModal } from "@/components/ScheduleEventModal";
import { useToastHelpers } from "@/components/ui/ToastSystem";

const categoryLabels: Record<string, string> = {
  "Autocuidado-&-Momentos-de-Belleza": "Autocuidado",
  "Relaciones-Sociales": "Relaciones",
  "Habitos-Positivos": "Hábitos",
  "Conexión-Social-&-Apoyo": "Relaciones",
  "Creatividad-&-Juego": "Creatividad",
  "Mindfulness-&-Bienestar-Emocional": "Mindfulness",
  "Movimiento-Diario-&-Fitness-Suave": "Ejercicio",
  "Nutrición-Consciente-&-Snacks-Saludables": "Alimentación",
  "Productividad-&-Enfoque": "Productividad",
  "Sueño-Reparador-&-Rutinas-Nocturnas": "Sueño",
  "Gestion-del-Estres-&-Relajacion": "Estres",
};

const categoryColors: Record<string, string[]> = {
  "Mindfulness-y-Relajacion": ["#8B5CF6", "#A855F7"],
  "Ejercicio-y-Movimiento": ["#10B981", "#059669"],
  "Alimentacion-Saludable": ["#F59E0B", "#D97706"],
  "Productividad-y-Organizacion": ["#3B82F6", "#2563EB"],
  "Autocuidado-y-Bienestar": ["#EC4899", "#DB2777"],
  "Relaciones-Sociales": ["#06B6D4", "#0891B2"],
  "Creatividad-y-Aprendizaje": ["#EF4444", "#DC2626"],
  "Habitos-Positivos": ["#84CC16", "#65A30D"],
};

export default function ChallengeCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showSuccessToast, showErrorToast } = useToastHelpers();
  
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [modalChallengeIndex, setModalChallengeIndex] = useState(0);
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    challengeId: "",
    challengeTitle: "",
  });

  const categoryId = id as string;
  const categoryLabel = categoryLabels[categoryId] || categoryId?.replace(/-/g, " ") || "Mini Retos";
  const categoryColorPair = categoryColors[categoryId] || ["#10B981", "#059669"];

  const fetchChallenges = useCallback(async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await challengeService.getChallengesByCategory(categoryId);
      setChallenges(response);
    } catch (err) {
      console.error(`Error fetching challenges for ${categoryId}:`, err);
      setError(`Error al cargar los mini retos de ${categoryLabel}`);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryLabel]);

  const handleChallengePress = (challenge: Challenge) => {
    const challengeIndex = challenges.findIndex((c) => c.id === challenge.id);
    setSelectedChallenge(challenge);
    setModalChallengeIndex(challengeIndex);
    setModalVisible(true);
  };

  const handleModalNext = () => {
    if (challenges.length > 0) {
      const newIndex = (modalChallengeIndex + 1) % challenges.length;
      setModalChallengeIndex(newIndex);
      setSelectedChallenge(challenges[newIndex]);
    }
  };

  const handleModalPrevious = () => {
    if (challenges.length > 0) {
      const newIndex = (modalChallengeIndex - 1 + challenges.length) % challenges.length;
      setModalChallengeIndex(newIndex);
      setSelectedChallenge(challenges[newIndex]);
    }
  };

  const handleModalRandom = () => {
    if (challenges.length > 0) {
      const randomIndex = Math.floor(Math.random() * challenges.length);
      setModalChallengeIndex(randomIndex);
      setSelectedChallenge(challenges[randomIndex]);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await challengeService.incrementPopularity(challengeId);
      showSuccessToast(
        "¡Reto completado! 🎉",
        "¡Increíble trabajo! Has dado un paso más hacia tu bienestar."
      );
    } catch (error) {
      console.error("Error completing challenge:", error);
      showErrorToast("Error", "No se pudo registrar la finalización del reto");
    }
  };

  const handleScheduleChallenge = (challengeId: string, challengeTitle: string) => {
    setScheduleModal({
      visible: true,
      challengeId,
      challengeTitle,
    });
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal({
      visible: false,
      challengeId: "",
      challengeTitle: "",
    });
  };

  const renderChallengeItem = useCallback(
    ({ item }: { item: Challenge }) => {
      return (
        <ChallengeItem
          challenge={item}
          categoryColors={categoryColorPair}
          categoryLabel={categoryLabel}
          onPress={handleChallengePress}
          onSchedule={handleScheduleChallenge}
        />
      );
    },
    [categoryColorPair, categoryLabel, handleChallengePress, handleScheduleChallenge]
  );

  const keyExtractor = useCallback(
    (item: Challenge) => item.id || Math.random().toString(),
    []
  );

  useEffect(() => {
    fetchChallenges();
  }, [fetchChallenges]);

  if (loading) {
    return (
      <PageView>
        <Topbar
          title={categoryLabel}
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <LoadingState />
      </PageView>
    );
  }

  if (error) {
    return (
      <PageView>
        <Topbar
          title={categoryLabel}
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <ErrorState
          title="Error al cargar los mini retos"
          onRetry={fetchChallenges}
        />
      </PageView>
    );
  }

  return (
    <PageView>
      <Topbar
        title={categoryLabel}
        actions={<ProfileButton />}
        showBackButton={true}
      />

      <View style={styles.container}>
        <FlatList
          data={challenges}
          renderItem={renderChallengeItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.content}
          style={styles.list}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              title="No hay mini retos disponibles"
              description={`No se encontraron mini retos para ${categoryLabel}.`}
            />
          }
        />

        {selectedChallenge && (
          <ChallengeModal
            visible={modalVisible}
            challenge={selectedChallenge}
            categoryColors={categoryColorPair}
            categoryLabel={categoryLabel}
            currentIndex={modalChallengeIndex}
            totalCount={challenges.length}
            onClose={() => setModalVisible(false)}
            onNext={handleModalNext}
            onPrevious={handleModalPrevious}
            onRandom={handleModalRandom}
            onComplete={handleCompleteChallenge}
            onSchedule={handleScheduleChallenge}
          />
        )}

        <ScheduleEventModal
          visible={scheduleModal.visible}
          onClose={handleCloseScheduleModal}
          type="challenge"
          itemId={scheduleModal.challengeId}
          itemTitle={scheduleModal.challengeTitle}
        />
      </View>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  list: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  content: {
    padding: 16,
  },
}); 