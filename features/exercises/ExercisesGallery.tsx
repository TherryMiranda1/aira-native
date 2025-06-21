import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import PagerView from "react-native-pager-view";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

import {
  exerciseService,
  Exercise as ExerciseType,
} from "@/services/api/exercise.service";
import { EmptyState } from "../../components/States/EmptyState";
import { LoadingState } from "../../components/States/LoadingState";
import { ErrorState } from "../../components/States/ErrorState";
import { ExerciseItem } from "./ExerciseItem";
import { CategoriesList, Category } from "../../components/Categories";

interface ExercisesState {
  data: ExerciseType[];
  loading: boolean;
  error: string | null;
}

const initialExercisesState: ExercisesState = {
  data: [],
  loading: false,
  error: null,
};

interface ExercisesGalleryProps {
  selectedCategory?: string;
  setSelectedCategory: (category: string) => void;
}

const ExercisesGallery: React.FC<ExercisesGalleryProps> = ({
  selectedCategory = "biceps",
  setSelectedCategory,
}) => {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);

  // Estado para cada categoría de ejercicios
  const [exercisesState, setExercisesState] = useState<
    Record<string, ExercisesState>
  >({
    biceps: initialExercisesState,
    espalda: initialExercisesState,
    hombros: initialExercisesState,
    pecho: initialExercisesState,
    piernas: initialExercisesState,
    triceps: initialExercisesState,
  });

  // Categorías de ejercicios memoizadas para evitar recreaciones en cada render
  const categories = useMemo<Category[]>(
    () => [
      { id: "biceps", label: "Biceps", icon: "fitness-outline" },
      { id: "espalda", label: "Espalda", icon: "body-outline" },
      { id: "hombros", label: "Hombros", icon: "barbell-outline" },
      { id: "pecho", label: "Pecho", icon: "expand-outline" },
      { id: "piernas", label: "Piernas", icon: "walk-outline" },
      { id: "triceps", label: "Triceps", icon: "fitness-outline" },
    ],
    []
  );

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [categories, selectedCategory]
  );

  // Función para cargar ejercicios por categoría
  const fetchExercisesByCategory = useCallback(
    async (category: string) => {
      // Verificar si ya tenemos datos cargados para evitar cargas innecesarias
      const currentState = exercisesState[category];

      if (currentState.data.length > 0 || currentState.loading) {
        return;
      }

      try {
        setExercisesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: true,
            error: null,
          },
        }));
        const where = { categoria: category };

        const { exercises } = await exerciseService.getExercises({
          limit: 20,
          where,
        });

        setExercisesState((prev) => ({
          ...prev,
          [category]: {
            data: exercises,
            loading: false,
            error: null,
          },
        }));
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setExercisesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: false,
            error: `Error al cargar los ejercicios de ${category}`,
          },
        }));
      }
    },
    [exercisesState]
  );

  // Cargar ejercicios de la categoría inicial
  useEffect(() => {
    const categoryToLoad = selectedCategory;
    fetchExercisesByCategory(categoryToLoad);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && pagerRef.current) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory
      );
      if (categoryIndex !== -1) {
        pagerRef.current?.setPage(categoryIndex);
        // Cargar los ejercicios de la categoría seleccionada si no están cargados
        fetchExercisesByCategory(selectedCategory);
      }
    }
  }, [selectedCategory]);

  // Utilizamos el hook personalizado para manejar el scroll de categorías
  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  // Función para cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Obtener el índice de la categoría seleccionada
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
      // Cargar los ejercicios de la categoría seleccionada si no están cargados
      fetchExercisesByCategory(categoryId);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      // Cargar los ejercicios de la nueva categoría si no están cargados
      fetchExercisesByCategory(categories[newIndex].id);
    }
  };

  // Manejar la navegación al detalle del ejercicio
  const handleExercisePress = useCallback(
    (exerciseId: string) => {
      // @ts-ignore - Ignoramos el error de tipado en la navegación
      router.push(`/dashboard/exercise/${exerciseId}`);
    },
    [router]
  );

  // Renderizar cada item de la lista
  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseType }) => {
      return <ExerciseItem exercise={item} onPress={handleExercisePress} />;
    },
    [handleExercisePress]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback(
    (item: ExerciseType) => item.id_ejercicio,
    []
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Selector de categorías */}
      <CategoriesList
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        categoryScrollHook={categoryScrollHook}
      />

      {/* Contenido según la categoría seleccionada */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={currentIndex}
        onPageSelected={handlePageChange}
      >
        {/* Página 1: Biceps */}
        <View key="biceps" style={styles.pageContainer}>
          {exercisesState.biceps.loading ? (
            <LoadingState />
          ) : exercisesState.biceps.error ? (
            <ErrorState
              title="Error al cargar los ejercicios"
              onRetry={() => fetchExercisesByCategory("biceps")}
            />
          ) : (
            <FlatList
              data={exercisesState.biceps.data}
              renderItem={renderExerciseItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.exercisesContent}
              style={styles.exercisesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 2: Espalda */}
        <View key="espalda" style={styles.pageContainer}>
          {exercisesState.espalda.loading ? (
            <LoadingState />
          ) : exercisesState.espalda.error ? (
            <ErrorState
              title="Error al cargar los ejercicios"
              onRetry={() => fetchExercisesByCategory("espalda")}
            />
          ) : (
            <FlatList
              data={exercisesState.espalda.data}
              renderItem={renderExerciseItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.exercisesContent}
              style={styles.exercisesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 3: Hombros */}
        <View key="hombros" style={styles.pageContainer}>
          {exercisesState.hombros.loading ? (
            <LoadingState />
          ) : exercisesState.hombros.error ? (
            <ErrorState
              title="Error al cargar los ejercicios"
              onRetry={() => fetchExercisesByCategory("hombros")}
            />
          ) : (
            <FlatList
              data={exercisesState.hombros.data}
              renderItem={renderExerciseItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.exercisesContent}
              style={styles.exercisesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 4: Pecho */}
        <View key="pecho" style={styles.pageContainer}>
          {exercisesState.pecho.loading ? (
            <LoadingState />
          ) : exercisesState.pecho.error ? (
            <ErrorState
              title="Error al cargar los ejercicios"
              onRetry={() => fetchExercisesByCategory("pecho")}
            />
          ) : (
            <FlatList
              data={exercisesState.pecho.data}
              renderItem={renderExerciseItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.exercisesContent}
              style={styles.exercisesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 5: Piernas */}
        <View key="piernas" style={styles.pageContainer}>
          {exercisesState.piernas.loading ? (
            <LoadingState />
          ) : exercisesState.piernas.error ? (
            <ErrorState
              title="Error al cargar los ejercicios"
              onRetry={() => fetchExercisesByCategory("piernas")}
            />
          ) : (
            <FlatList
              data={exercisesState.piernas.data}
              renderItem={renderExerciseItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.exercisesContent}
              style={styles.exercisesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 6: Triceps */}
        <View key="triceps" style={styles.pageContainer}>
          {exercisesState.triceps.loading ? (
            <LoadingState />
          ) : exercisesState.triceps.error ? (
            <ErrorState
              title="Error al cargar los ejercicios"
              onRetry={() => fetchExercisesByCategory("triceps")}
            />
          ) : (
            <FlatList
              data={exercisesState.triceps.data}
              renderItem={renderExerciseItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.exercisesContent}
              style={styles.exercisesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>
      </PagerView>
    </View>
  );
};

const styles = StyleSheet.create({
  // PagerView styles
  pagerView: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  pageContainer: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Categories styles
  categoriesContainer: {
    paddingTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  categoriesContent: {
    paddingHorizontal: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginRight: 12,
    borderBottomWidth: 2,
    borderColor: "transparent",
  },
  categoryButtonActive: {
    borderColor: AiraColors.foreground,
  },
  categoryIcon: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    color: AiraColors.foreground,
  },

  // Exercise list styles
  exercisesContainer: {
    flex: 1,
  },
  exercisesContent: {
    padding: 8,
  },

  // Empty state styles
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginTop: 8,
    textAlign: "center",
  },
});

export default ExercisesGallery;
