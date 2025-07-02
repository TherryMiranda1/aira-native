import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import PagerView from "react-native-pager-view";

import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { AiraColors } from "@/constants/Colors";
import { useRituals } from "@/hooks/services/useRituals";
import { ritualService, Ritual } from "@/services/api/ritual.service";
import { CategoriesList, Category } from "@/components/Categories";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import { RitualModal } from "@/components/modals/RitualModal";
import { RitualItem } from "@/features/rituals/RitualItem";
import { EmptyState } from "@/components/States/EmptyState";
import { LoadingState } from "@/components/States/LoadingState";
import { ErrorState } from "@/components/States/ErrorState";
import { ScheduleEventModal } from "@/components/modals/ScheduleEventModal";
import { useToastHelpers } from "@/components/ui/ToastSystem";

// Mapeo de categorías basado en el servicio de rituales
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

const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  autocuidado: "heart-outline",
  meditacion: "leaf-outline",
  relajacion: "water-outline",
  energia: "flash-outline",
  conexion: "people-outline",
  gratitud: "star-outline",
  respiracion: "airplane-outline",
  movimiento: "walk-outline",
  manana: "sunny-outline",
  mediodia: "sunny",
  tarde: "partly-sunny-outline",
  noche: "moon-outline",
  "cualquier-momento": "time-outline",
};

interface RitualsState {
  data: Ritual[];
  loading: boolean;
  error: string | null;
}

const initialRitualsState: RitualsState = {
  data: [],
  loading: false,
  error: null,
};

export default function RitualesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ categoria?: string }>();
  const pagerRef = useRef<PagerView>(null);
  const { showSuccessToast, showErrorToast } = useToastHelpers();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null);
  const [modalRitualIndex, setModalRitualIndex] = useState(0);
  const [scheduleModal, setScheduleModal] = useState({
    visible: false,
    ritualId: "",
    ritualTitle: "",
  });

  // Usar el hook de rituales para obtener categorías disponibles
  const {
    rituals: allRituals,
    loading: categoriesLoading,
    error: categoriesError,
    categories: availableCategories,
    moments: availableMoments,
  } = useRituals({
    filters: { activo: true, limit: 100 },
    autoFetch: true,
  });

  // Estado para cada categoría de rituales
  const [ritualsState, setRitualsState] = useState<
    Record<string, RitualsState>
  >({});

  const getCategoryLabel = (categoria?: string) => {
    if (!categoria) return "";
    return categoryLabels[categoria] || categoria.replace(/-/g, " ");
  };

  const getCategoryColors = (categoria?: string) => {
    if (!categoria) return ["#8B5CF6", "#A855F7"];
    return categoryColors[categoria] || ["#8B5CF6", "#A855F7"];
  };

  const getCategoryIcon = (
    categoria?: string
  ): keyof typeof Ionicons.glyphMap => {
    if (!categoria) return "sparkles-outline";
    return (
      (categoryIcons[categoria] as keyof typeof Ionicons.glyphMap) ||
      "sparkles-outline"
    );
  };

  // Combinar categorías y momentos disponibles
  const allAvailableCategories = useMemo(() => {
    const categoryKeys = availableCategories.map((cat) => cat.key);
    const momentKeys = availableMoments.map((moment) => moment.key);
    return [...categoryKeys, ...momentKeys];
  }, [availableCategories, availableMoments]);

  // Crear categorías con iconos y labels
  const categories: Category[] = useMemo(() => {
    return allAvailableCategories.map((categoryId) => ({
      id: categoryId,
      label: getCategoryLabel(categoryId) || "",
      icon: getCategoryIcon(categoryId),
    }));
  }, [allAvailableCategories]);

  // Determinar categoría inicial (desde parámetros o primera disponible)
  const initialCategory = useMemo(() => {
    if (params.categoria && allAvailableCategories.includes(params.categoria)) {
      return params.categoria;
    }
    return allAvailableCategories[0] || "";
  }, [params.categoria, allAvailableCategories]);

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

  // Función para cargar rituales por categoría
  const fetchRitualsByCategory = useCallback(
    async (category: string) => {
      const currentState = ritualsState[category];

      if (currentState?.data.length > 0 || currentState?.loading) {
        return;
      }

      try {
        setRitualsState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: true,
            error: null,
          },
        }));

        // Determinar si es categoría o momento
        const isCategory = availableCategories.some(
          (cat) => cat.key === category
        );
        const isMoment = availableMoments.some(
          (moment) => moment.key === category
        );

        let response;
        if (isCategory) {
          response = await ritualService.getRitualsByCategory(category);
        } else if (isMoment) {
          response = await ritualService.getRitualsByMoment(category);
        } else {
          // Fallback a búsqueda general
          response = await ritualService.getRituals({
            categoria: category,
            activo: true,
            limit: 100,
          });
        }

        setRitualsState((prev) => ({
          ...prev,
          [category]: {
            data: response.docs,
            loading: false,
            error: null,
          },
        }));
      } catch (error) {
        console.error(`Error fetching rituals for ${category}:`, error);
        setRitualsState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: false,
            error: `Error al cargar los rituales de ${getCategoryLabel(
              category
            )}`,
          },
        }));
      }
    },
    [ritualsState, availableCategories, availableMoments]
  );

  // Función para cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
      fetchRitualsByCategory(categoryId);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      fetchRitualsByCategory(categories[newIndex].id);
    }
  };

  // Funciones del modal
  const handleRitualPress = (ritual: Ritual) => {
    const categoryState = ritualsState[selectedCategory];
    if (categoryState) {
      const ritualIndex = categoryState.data.findIndex(
        (r) => r.id === ritual.id
      );
      setSelectedRitual(ritual);
      setModalRitualIndex(ritualIndex);
      setModalVisible(true);
    }
  };

  const handleModalNext = () => {
    const categoryState = ritualsState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const newIndex = (modalRitualIndex + 1) % categoryState.data.length;
      setModalRitualIndex(newIndex);
      setSelectedRitual(categoryState.data[newIndex]);
    }
  };

  const handleModalPrevious = () => {
    const categoryState = ritualsState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const newIndex =
        (modalRitualIndex - 1 + categoryState.data.length) %
        categoryState.data.length;
      setModalRitualIndex(newIndex);
      setSelectedRitual(categoryState.data[newIndex]);
    }
  };

  const handleModalRandom = () => {
    const categoryState = ritualsState[selectedCategory];
    if (categoryState && categoryState.data.length > 0) {
      const randomIndex = Math.floor(Math.random() * categoryState.data.length);
      setModalRitualIndex(randomIndex);
      setSelectedRitual(categoryState.data[randomIndex]);
    }
  };

  const handleCompleteRitual = async (ritualId: string) => {
    try {
      await ritualService.incrementPopularity(ritualId);
      showSuccessToast(
        "¡Ritual completado! 🌟",
        "¡Hermoso trabajo! Has creado un momento sagrado para tu bienestar."
      );
    } catch (error) {
      console.error("Error completing ritual:", error);
      showErrorToast(
        "Error",
        "No se pudo registrar la finalización del ritual"
      );
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

  // Renderizar cada item de la lista
  const renderRitualItem = useCallback(
    ({ item }: { item: Ritual }) => {
      return (
        <RitualItem
          ritual={item}
          categoryColors={getCategoryColors(selectedCategory)}
          categoryLabel={getCategoryLabel(selectedCategory) || ""}
          onPress={handleRitualPress}
          onSchedule={handleScheduleRitual}
        />
      );
    },
    [selectedCategory, handleRitualPress, handleScheduleRitual]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback(
    (item: Ritual) => item.id || Math.random().toString(),
    []
  );

  // Efectos
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      fetchRitualsByCategory(initialCategory);
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
          title="Rituales"
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
          title="Rituales"
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
        title="Rituales de Bienestar"
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
              ritualsState[category.id] || initialRitualsState;

            return (
              <View key={category.id} style={styles.pageContainer}>
                {categoryState.loading ? (
                  <LoadingState />
                ) : categoryState.error ? (
                  <ErrorState
                    title="Error al cargar los rituales"
                    onRetry={() => fetchRitualsByCategory(category.id)}
                  />
                ) : (
                  <FlatList
                    data={categoryState.data}
                    renderItem={renderRitualItem}
                    keyExtractor={keyExtractor}
                    contentContainerStyle={styles.ritualsContent}
                    style={styles.ritualsContainer}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    removeClippedSubviews={true}
                    ListEmptyComponent={
                      <EmptyState
                        title="No hay rituales disponibles"
                        description={`No se encontraron rituales para ${getCategoryLabel(
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

        {/* Ritual Modal */}
        {selectedRitual && (
          <RitualModal
            visible={modalVisible}
            ritual={selectedRitual}
            categoryColors={getCategoryColors(selectedCategory)}
            categoryLabel={getCategoryLabel(selectedCategory) || ""}
            currentIndex={modalRitualIndex}
            totalCount={ritualsState[selectedCategory]?.data.length || 0}
            onClose={() => setModalVisible(false)}
            onNext={handleModalNext}
            onPrevious={handleModalPrevious}
            onRandom={handleModalRandom}
            onComplete={handleCompleteRitual}
            onSchedule={handleScheduleRitual}
          />
        )}

        {/* Schedule Modal */}
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
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
  ritualsContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  ritualsContent: {
    padding: 16,
  },
});
