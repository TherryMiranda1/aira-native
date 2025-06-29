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

import { AiraColors } from "@/constants/Colors";

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
  onScheduleExercise?: (exerciseId: string, exerciseTitle: string) => void;
}

const ExercisesGallery: React.FC<ExercisesGalleryProps> = ({
  selectedCategory = "Biceps",
  setSelectedCategory,
  onScheduleExercise,
}) => {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);

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

  const fetchExercisesByCategory = useCallback(
    async (category: string) => {
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

        const where = { categoria: { equals: selectedCategory } };
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

  useEffect(() => {
    fetchExercisesByCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && pagerRef.current) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory
      );
      if (categoryIndex !== -1) {
        pagerRef.current?.setPage(categoryIndex);
        fetchExercisesByCategory(selectedCategory);
      }
    }
  }, [selectedCategory]);

  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
      fetchExercisesByCategory(categoryId);
    }
  };

  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      fetchExercisesByCategory(categories[newIndex].id);
    }
  };

  const handleExercisePress = useCallback(
    (exerciseId: string) => {
      router.push(`/dashboard/exercise/${exerciseId}`);
    },
    [router]
  );

  const renderExerciseItem = useCallback(
    ({ item }: { item: ExerciseType }) => {
      return (
        <ExerciseItem
          exercise={item}
          onPress={handleExercisePress}
          onSchedule={onScheduleExercise}
        />
      );
    },
    [handleExercisePress, onScheduleExercise]
  );

  const keyExtractor = useCallback((item: ExerciseType) => item.id, []);

  const renderCategoryPage = useCallback(
    (categoryId: string) => {
      const state = exercisesState[categoryId];

      if (state.loading) {
        return <LoadingState />;
      }

      if (state.error) {
        return (
          <ErrorState
            title="Error al cargar los ejercicios"
            onRetry={() => fetchExercisesByCategory(categoryId)}
          />
        );
      }

      return (
        <FlatList
          data={state.data}
          renderItem={renderExerciseItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.exercisesContent}
          style={styles.exercisesContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={10}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              title="No hay ejercicios"
              description={`No se encontraron ejercicios para ${categoryId}`}
            />
          }
        />
      );
    },
    [exercisesState, renderExerciseItem, keyExtractor, fetchExercisesByCategory]
  );

  return (
    <View style={styles.container}>
      <CategoriesList
        categories={categories}
        selectedCategory={selectedCategory}
        handleCategoryChange={handleCategoryChange}
        categoryScrollHook={categoryScrollHook}
      />

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={currentIndex}
        onPageSelected={handlePageChange}
      >
        {categories.map((category) => (
          <View key={category.id} style={styles.pageContainer}>
            {renderCategoryPage(category.id)}
          </View>
        ))}
      </PagerView>
    </View>
  );
};

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
  exercisesContainer: {
    flex: 1,
  },
  exercisesContent: {
    padding: 16,
    gap: 12,
  },
});

export default ExercisesGallery;
