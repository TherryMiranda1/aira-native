import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors } from "@/constants/Colors";
import { ritualService, Ritual } from "@/services/api/ritual.service";
import { RitualModal } from "@/features/rituals/RitualModal";
import { RitualItem } from "@/features/rituals/RitualItem";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingState } from "@/components/States/LoadingState";
import { ErrorState } from "@/components/States/ErrorState";
import { ScheduleEventModal } from "@/components/ScheduleEventModal";

const categoryLabels: Record<string, string> = {
  autocuidado: "Autocuidado",
  meditacion: "Meditación",
  relajacion: "Relajación",
  energia: "Energía",
  conexion: "Conexión",
  gratitud: "Gratitud",
  respiracion: "Respiración",
  movimiento: "Movimiento",
  manana: "Mañana",
  mediodia: "Mediodía",
  tarde: "Tarde",
  noche: "Noche",
  "cualquier-momento": "Cualquier momento",
};

const categoryColors: Record<string, string[]> = {
  autocuidado: ["#EC4899", "#DB2777"],
  meditacion: ["#8B5CF6", "#A855F7"],
  relajacion: ["#06B6D4", "#0891B2"],
  energia: ["#EF4444", "#DC2626"],
  conexion: ["#10B981", "#059669"],
  gratitud: ["#F59E0B", "#D97706"],
  respiracion: ["#3B82F6", "#2563EB"],
  movimiento: ["#84CC16", "#65A30D"],
  manana: ["#F59E0B", "#D97706"],
  mediodia: ["#EF4444", "#DC2626"],
  tarde: ["#EC4899", "#DB2777"],
  noche: ["#8B5CF6", "#A855F7"],
  "cualquier-momento": ["#10B981", "#059669"],
};

export default function RitualCategoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [modalRitualIndex, setModalRitualIndex] = useState(0);
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    ritualId: "",
    ritualTitle: "",
  });

  const categoryId = id as string;
  const categoryLabel = categoryLabels[categoryId] || categoryId?.replace(/-/g, " ") || "Rituales";
  const categoryColorPair = categoryColors[categoryId] || ["#8B5CF6", "#A855F7"];

  const fetchRituals = useCallback(async () => {
    if (!categoryId) return;

    try {
      setLoading(true);
      setError(null);
      
      let response;
      // Determinar si es categoría o momento basado en las claves disponibles
      const isCategory = ['autocuidado', 'meditacion', 'relajacion', 'energia', 'conexion', 'gratitud', 'respiracion', 'movimiento'].includes(categoryId);
      const isMoment = ['manana', 'mediodia', 'tarde', 'noche', 'cualquier-momento'].includes(categoryId);

      if (isCategory) {
        response = await ritualService.getRitualsByCategory(categoryId);
      } else if (isMoment) {
        response = await ritualService.getRitualsByMoment(categoryId);
      } else {
        // Fallback a búsqueda general
        const result = await ritualService.getRituals({
          categoria: categoryId,
          activo: true,
          limit: 100,
        });
        response = result.docs;
      }

      // Manejar diferentes tipos de respuesta
      const ritualsArray = Array.isArray(response) ? response : response.docs || [];
      setRituals(ritualsArray);
    } catch (err) {
      console.error(`Error fetching rituals for ${categoryId}:`, err);
      setError(`Error al cargar los rituales de ${categoryLabel}`);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryLabel]);

  const handleRitualPress = (ritual: Ritual) => {
    const ritualIndex = rituals.findIndex((r) => r.id === ritual.id);
    setSelectedRitual(ritual);
    setModalRitualIndex(ritualIndex);
    setModalVisible(true);
  };

  const handleModalNext = () => {
    if (rituals.length > 0) {
      const newIndex = (modalRitualIndex + 1) % rituals.length;
      setModalRitualIndex(newIndex);
      setSelectedRitual(rituals[newIndex]);
    }
  };

  const handleModalPrevious = () => {
    if (rituals.length > 0) {
      const newIndex = (modalRitualIndex - 1 + rituals.length) % rituals.length;
      setModalRitualIndex(newIndex);
      setSelectedRitual(rituals[newIndex]);
    }
  };

  const handleModalRandom = () => {
    if (rituals.length > 0) {
      const randomIndex = Math.floor(Math.random() * rituals.length);
      setModalRitualIndex(randomIndex);
      setSelectedRitual(rituals[randomIndex]);
    }
  };

  const handleCompleteRitual = async (ritualId: string) => {
    try {
      await ritualService.incrementPopularity(ritualId);
      Alert.alert(
        "¡Ritual completado! 🌟",
        "¡Hermoso trabajo! Has creado un momento sagrado para tu bienestar."
      );
    } catch (error) {
      console.error("Error completing ritual:", error);
      Alert.alert("Error", "No se pudo registrar la finalización del ritual");
    }
  };

  const handleScheduleRitual = (ritualId: string, ritualTitle: string) => {
    setScheduleModal({
      visible: true,
      ritualId,
      ritualTitle,
    });
  };

  const handleCloseScheduleModal = () => {
    setScheduleModal({
      visible: false,
      ritualId: "",
      ritualTitle: "",
    });
  };

  const renderRitualItem = useCallback(
    ({ item }: { item: Ritual }) => {
      return (
        <RitualItem
          ritual={item}
          categoryColors={categoryColorPair}
          categoryLabel={categoryLabel}
          onPress={handleRitualPress}
          onSchedule={handleScheduleRitual}
        />
      );
    },
    [categoryColorPair, categoryLabel, handleRitualPress, handleScheduleRitual]
  );

  const keyExtractor = useCallback(
    (item: Ritual) => item.id || Math.random().toString(),
    []
  );

  useEffect(() => {
    fetchRituals();
  }, [fetchRituals]);

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
          title="Error al cargar los rituales"
          onRetry={fetchRituals}
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
          data={rituals}
          renderItem={renderRitualItem}
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
              title="No hay rituales disponibles"
              description={`No se encontraron rituales para ${categoryLabel}.`}
            />
          }
        />

        {selectedRitual && (
          <RitualModal
            visible={modalVisible}
            ritual={selectedRitual}
            categoryColors={categoryColorPair}
            categoryLabel={categoryLabel}
            currentIndex={modalRitualIndex}
            totalCount={rituals.length}
            onClose={() => setModalVisible(false)}
            onNext={handleModalNext}
            onPrevious={handleModalPrevious}
            onRandom={handleModalRandom}
            onComplete={handleCompleteRitual}
            onSchedule={handleScheduleRitual}
          />
        )}

        <ScheduleEventModal
          visible={scheduleModal.visible}
          onClose={handleCloseScheduleModal}
          type="ritual"
          itemId={scheduleModal.ritualId}
          itemTitle={scheduleModal.ritualTitle}
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