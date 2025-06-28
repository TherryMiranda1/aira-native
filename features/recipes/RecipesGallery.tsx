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
  recipeService,
  Recipe as RecipeType,
} from "@/services/api/recipe.service";
import { EmptyState } from "../../components/States/EmptyState";
import { LoadingState } from "../../components/States/LoadingState";
import { ErrorState } from "../../components/States/ErrorState";
import { RecipeItem } from "./RecipeItem";
import { CategoriesList, Category } from "../../components/Categories";

interface RecipesState {
  data: RecipeType[];
  loading: boolean;
  error: string | null;
}

const initialRecipesState: RecipesState = {
  data: [],
  loading: false,
  error: null,
};

interface RecipesGalleryProps {
  selectedCategory?: string;
  setSelectedCategory: (category: string) => void;
}

const RecipesGallery = ({
  selectedCategory = "desayuno",
  setSelectedCategory,
}: RecipesGalleryProps) => {
  const router = useRouter();
  const pagerRef = useRef<PagerView>(null);

  const [recipesState, setRecipesState] = useState<
    Record<string, RecipesState>
  >({
    desayuno: initialRecipesState,
    almuerzo: initialRecipesState,
    cena: initialRecipesState,
    merienda: initialRecipesState,
    postre: initialRecipesState,
  });

  const categories: Category[] = useMemo(
    () => [
      { id: "desayuno", label: "Desayunos", icon: "sunny-outline" },
      { id: "almuerzo", label: "Almuerzos", icon: "restaurant-outline" },
      { id: "cena", label: "Cenas", icon: "moon-outline" },
      { id: "merienda", label: "Meriendas", icon: "cafe-outline" },
      { id: "postre", label: "Postres", icon: "ice-cream-outline" },
    ],
    []
  );

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [selectedCategory, categories]
  );

  // Función para cargar recetas por categoría
  const fetchRecipesByCategory = useCallback(
    async (category: string) => {
      const currentState = recipesState[category];

      if (currentState.data.length > 0 || currentState.loading) {
        return;
      }

      try {
        setRecipesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: true,
            error: null,
          },
        }));
        const where = { tipo_plato: { equals: category } };

        const { recipes } = await recipeService.getRecipes({
          limit: 20,
          where,
        });

        setRecipesState((prev) => ({
          ...prev,
          [category]: {
            data: recipes,
            loading: false,
            error: null,
          },
        }));
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setRecipesState((prev) => ({
          ...prev,
          [category]: {
            data: [],
            loading: false,
            error: `Error al cargar las recetas de ${category}`,
          },
        }));
      }
    },
    [recipesState]
  );

  useEffect(() => {
    fetchRecipesByCategory(selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && pagerRef.current) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === selectedCategory
      );
      if (categoryIndex !== -1) {
        pagerRef.current?.setPage(categoryIndex);
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
      fetchRecipesByCategory(categoryId);
    }
  };

  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      fetchRecipesByCategory(categories[newIndex].id);
    }
  };

  const handleRecipePress = useCallback(
    (recipeId: string) => {
      router.push(`/dashboard/recipe/${recipeId}`);
    },
    [router]
  );

  const renderRecipeItem = useCallback(
    ({ item }: { item: RecipeType }) => {
      return <RecipeItem recipe={item} onPress={handleRecipePress} />;
    },
    [handleRecipePress]
  );

  const keyExtractor = useCallback(
    (item: RecipeType) => item.id || Math.random().toString(),
    []
  );

  const renderCategoryPage = useCallback(
    (categoryId: string) => {
      const state = recipesState[categoryId];

      if (state.loading) {
        return <LoadingState />;
      }

      if (state.error) {
        return (
          <ErrorState
            title="Error al cargar las recetas"
            onRetry={() => fetchRecipesByCategory(categoryId)}
          />
        );
      }

      return (
        <FlatList
          data={state.data}
          renderItem={renderRecipeItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.recipesContent}
          style={styles.recipesContainer}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={10}
          removeClippedSubviews={true}
          ListEmptyComponent={
            <EmptyState
              title="No hay recetas"
              description={`No se encontraron recetas para ${categoryId}`}
            />
          }
        />
      );
    },
    [recipesState, renderRecipeItem, keyExtractor, fetchRecipesByCategory]
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
  recipesContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  recipesContent: {
    padding: 16,
    gap: 12,
  },
});

export default RecipesGallery;
