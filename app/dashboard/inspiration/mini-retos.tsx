import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { View, StyleSheet, FlatList, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import PagerView from "react-native-pager-view";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors } from "@/constants/Colors";
import { useChallenges } from "@/hooks/services/useChallenges";
import { challengeService, Challenge } from "@/services/api/challenge.service";
import { CategoriesList, Category } from "@/components/Categories";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import { ChallengeModal } from "@/features/challenges/ChallengeModal";
import { ChallengeItem } from "@/features/challenges/ChallengeItem";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingState } from "@/components/States/LoadingState";
import { ErrorState } from "@/components/States/ErrorState";
import { ScheduleEventModal } from "@/components/ScheduleEventModal";

// Mapeo de categorías de la versión web
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

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  "Mindfulness-y-Relajacion": "leaf-outline",
  "Ejercicio-y-Movimiento": "fitness-outline",
  "Alimentacion-Saludable": "nutrition-outline",
  "Productividad-y-Organizacion": "checkmark-circle-outline",
  "Autocuidado-y-Bienestar": "heart-outline",
  "Relaciones-Sociales": "people-outline",
  "Creatividad-y-Aprendizaje": "bulb-outline",
  "Habitos-Positivos": "star-outline",
};

interface ChallengesState {
  data: Challenge[];
  loading: boolean;
  error: string | null;
}

const initialChallengesState: ChallengesState = {
  data: [],
  loading: false,
  error: null,
};

export default function MiniRetosScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoria?: string }>();
  const pagerRef = useRef<PagerView>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(
    null
  );
  const [modalChallengeIndex, setModalChallengeIndex] = useState(0);
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    challengeId: "",
    challengeTitle: "",
  });

  // Usar el hook de challenges para obtener categorías disponibles
  const {
    challenges: allChallenges,
    loading: categoriesLoading,
    error: categoriesError,
    categories: availableCategories,
  } = useChallenges({
    filters: { activo: true, limit: 100 },
    autoFetch: true,
  });

  // Estado para cada categoría de challenges
  const [challengesState, setChallengesState] = useState<
    Record<string, ChallengesState>
  >({});

  const getCategoryLabel = (categoria?: string) => {
    if (!categoria) return "";

    return categoryLabels[categoria] || categoria.replace(/-/g, " ");
  };

  const getCategoryColors = (categoria?: string) => {
    if (!categoria) return ["#10B981", "#059669"];
    return categoryColors[categoria] || ["#10B981", "#059669"];
  };

  const getCategoryIcon = (
    categoria?: string
  ): keyof typeof Ionicons.glyphMap => {
    if (!categoria) return "trophy-outline";
    return (
      (categoryIcons[categoria] as keyof typeof Ionicons.glyphMap) ||
      "trophy-outline"
    );
  };

  // Crear categorías con iconos y labels
  const categories: Category[] = useMemo(() => {
    return availableCategories.map((categoryId) => ({
      id: categoryId,
      label: getCategoryLabel(categoryId) || "",
      icon: getCategoryIcon(categoryId),
    }));
  }, [availableCategories]);

  // Determinar categoría inicial (desde parámetros o primera disponible)
  const initialCategory = useMemo(() => {
    if (params.categoria && availableCategories.includes(params.categoria)) {
      return params.categoria;
    }
    return availableCategories[0] || "";
  }, [params.categoria, availableCategories]);

  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [selectedCategory, categories]
  );

  // Hook para scroll de categorías
  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  // Función para cargar challenges por categoría
  const fetchChallengesByCategory = useCallback(
    async (category: string) => {
      const currentState = challengesState[category];

      if (currentState?.data.length > 0 || currentState?.loading) {
        return;
      }

      try {
        setChallengesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: true,
            error: null,
          },
        }));

        const response = await challengeService.getChallengesByCategory(
          category
        );

        setChallengesState((prev) => ({
          ...prev,
          [category]: {
            data: response,
            loading: false,
            error: null,
          },
        }));
      } catch (error) {
        console.error(`Error fetching challenges for ${category}:`, error);
        setChallengesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: false,
            error: `Error al cargar los mini retos de ${getCategoryLabel(
              category
            )}`,
          },
        }));
      }
    },
    [challengesState]
  );

  // Función para cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
      fetchChallengesByCategory(categoryId);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      fetchChallengesByCategory(categories[newIndex].id);
    }
  };

  // Funciones del modal
  const handleChallengePress = (challenge: Challenge) => {
    const categoryState = challengesState[selectedCategory];
    if (categoryState) {
      const challengeIndex = categoryState.data.findIndex(
        (c) => c.id === challenge.id
      );
      setSelectedChallenge(challenge);
      setModalChallengeIndex(challengeIndex);
      setModalVisible(true);
    }
  };

  const handleModalNext = () => {
    const categoryState = challengesState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const newIndex = (modalChallengeIndex + 1) % categoryState.data.length;
      setModalChallengeIndex(newIndex);
      setSelectedChallenge(categoryState.data[newIndex]);
    }
  };

  const handleModalPrevious = () => {
    const categoryState = challengesState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const newIndex =
        (modalChallengeIndex - 1 + categoryState.data.length) %
        categoryState.data.length;
      setModalChallengeIndex(newIndex);
      setSelectedChallenge(categoryState.data[newIndex]);
    }
  };

  const handleModalRandom = () => {
    const categoryState = challengesState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryState.data.length);
      setModalChallengeIndex(randomIndex);
      setSelectedChallenge(categoryState.data[randomIndex]);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await challengeService.incrementPopularity(challengeId);
      Alert.alert(
        "¡Reto completado! 🎉",
        "¡Increíble trabajo! Has dado un paso más hacia tu bienestar."
      );
    } catch (error) {
      console.error("Error completing challenge:", error);
      Alert.alert("Error", "No se pudo registrar la finalización del reto");
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

  // Renderizar cada item de la lista
  const renderChallengeItem = useCallback(
    ({ item }: { item: Challenge }) => {
      return (
        <ChallengeItem
          challenge={item}
          categoryColors={getCategoryColors(selectedCategory)}
          categoryLabel={getCategoryLabel(selectedCategory) || ""}
          onPress={handleChallengePress}
          onSchedule={handleScheduleChallenge}
        />
      );
    },
    [selectedCategory, handleChallengePress, handleScheduleChallenge]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback(
    (item: Challenge) => item.id || Math.random().toString(),
    []
  );

  // Efectos
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      fetchChallengesByCategory(initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    if (selectedCategory && pagerRef.current) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory
      );
      if (categoryIndex !== -1) {
        pagerRef.current?.setPage(categoryIndex);
      }
    }
  }, [selectedCategory, categories]);

  // Loading State inicial
  if (categoriesLoading) {
    return (
      <PageView>
        <Topbar
          title="Mini Retos"
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <LoadingState />
      </PageView>
    );
  }

  // Error State inicial
  if (categoriesError) {
    return (
      <PageView>
        <Topbar
          title="Mini Retos"
          actions={<ProfileButton />}
          showBackButton={true}
        />
        <ErrorState
          title="Error al cargar categorías"
          onRetry={() => router.back()}
        />
      </PageView>
    );
  }

  return (
    <PageView>
      <Topbar
        title="Mini Retos de Bienestar"
        actions={<ProfileButton />}
        showBackButton={true}
      />

      <View style={styles.container}>
        {/* Categories Navigation */}
        {categories.length > 0 && (
          <CategoriesList
            categories={categories}
            selectedCategory={selectedCategory}
            handleCategoryChange={handleCategoryChange}
            categoryScrollHook={categoryScrollHook}
          />
        )}

        {/* PagerView Content */}
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={currentIndex}
          onPageSelected={handlePageChange}
        >
          {categories.map((category) => {
            const categoryState =
              challengesState[category.id] || initialChallengesState;

            return (
              <View key={category.id} style={styles.pageContainer}>
                {categoryState.loading ? (
                  <LoadingState />
                ) : categoryState.error ? (
                  <ErrorState
                    title="Error al cargar los mini retos"
                    onRetry={() => fetchChallengesByCategory(category.id)}
                  />
                ) : (
                  <FlatList
                    data={categoryState.data}
                    renderItem={renderChallengeItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.challengesContent}
                    style={styles.challengesContainer}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    ListEmptyComponent={
                      <EmptyState
                        title="No hay mini retos disponibles"
                        description={`No se encontraron mini retos para ${getCategoryLabel(
                          category.id
                        )}.`}
                      />
                    }
                  />
                )}
              </View>
            );
          })}
        </PagerView>

        {/* Challenge Modal */}
        {selectedChallenge && (
          <ChallengeModal
            visible={modalVisible}
            challenge={selectedChallenge}
            categoryColors={getCategoryColors(selectedCategory)}
            categoryLabel={getCategoryLabel(selectedCategory) || ""}
            currentIndex={modalChallengeIndex}
            totalCount={challengesState[selectedCategory]?.data.length || 0}
            onClose={() => setModalVisible(false)}
            onNext={handleModalNext}
            onPrevious={handleModalPrevious}
            onRandom={handleModalRandom}
            onComplete={handleCompleteChallenge}
            onSchedule={handleScheduleChallenge}
          />
        )}

        {/* Modal de programación */}
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
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  challengesContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  challengesContent: {
    padding: 16,
  },
});
