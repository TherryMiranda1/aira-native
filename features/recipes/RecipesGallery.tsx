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

// Importamos el servicio de recetas
import {
  recipeService,
  Recipe as RecipeType,
} from "@/services/api/recipeService";
import { EmptyState } from "../../components/States/EmptyState";
import { LoadingState } from "../../components/States/LoadingState";
import { ErrorState } from "../../components/States/ErrorState";
import { RecipeItem } from "./RecipeItem";
import { CategoriesList, Category } from "../../components/Categories";

// Usamos el tipo Recipe del servicio

interface RecipesState {
  data: RecipeType[];
  loading: boolean;
  error: string | null;
}

// Estado inicial para las recetas de cada categoría
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

  // Estado para cada categoría de recetas
  const [recipesState, setRecipesState] = useState<
    Record<string, RecipesState>
  >({
    desayuno: initialRecipesState,
    almuerzo: initialRecipesState,
    cena: initialRecipesState,
    merienda: initialRecipesState,
    postre: initialRecipesState,
  });

  // Categorías de recetas
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
      // Verificar si ya tenemos datos cargados para evitar cargas innecesarias
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
        const where = { tipo_plato: category };

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

  // Cargar recetas de la categoría inicial
  useEffect(() => {
    const categoryToLoad = selectedCategory;
    fetchRecipesByCategory(categoryToLoad);
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
      // Cargar las recetas de la categoría seleccionada si no están cargadas
      fetchRecipesByCategory(categoryId);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
      // Cargar las recetas de la nueva categoría si no están cargadas
      fetchRecipesByCategory(categories[newIndex].id);
    }
  };

  // Manejar la navegación a la receta
  const handleRecipePress = useCallback(
    (recipeId: string) => {
      // @ts-ignore - Ignoramos el error de tipado en la navegación
      router.push(`/recipe/${recipeId}`);
    },
    [router]
  );

  // Renderizar cada item de la lista
  const renderRecipeItem = useCallback(
    ({ item }: { item: RecipeType }) => {
      return <RecipeItem recipe={item} onPress={handleRecipePress} />;
    },
    [handleRecipePress]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback(
    (item: RecipeType) => item.id || Math.random().toString(),
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
        {/* Página 1: Desayunos */}
        <View key="desayuno" style={styles.pageContainer}>
          {recipesState.desayuno.loading ? (
            <LoadingState />
          ) : recipesState.desayuno.error ? (
            <ErrorState
              title="Error al cargar las recetas"
              onRetry={() => fetchRecipesByCategory("desayuno")}
            />
          ) : (
            <FlatList
              data={recipesState.desayuno.data}
              renderItem={renderRecipeItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.recipesContent}
              style={styles.recipesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 2: Almuerzos */}
        <View key="almuerzo" style={styles.pageContainer}>
          {recipesState.almuerzo.loading ? (
            <LoadingState />
          ) : recipesState.almuerzo.error ? (
            <ErrorState
              title="Error al cargar las recetas"
              onRetry={() => fetchRecipesByCategory("almuerzo")}
            />
          ) : (
            <FlatList
              data={recipesState.almuerzo.data}
              renderItem={renderRecipeItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.recipesContent}
              style={styles.recipesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 3: Cenas */}
        <View key="cena" style={styles.pageContainer}>
          {recipesState.cena.loading ? (
            <LoadingState />
          ) : recipesState.cena.error ? (
            <ErrorState
              title="Error al cargar las recetas"
              onRetry={() => fetchRecipesByCategory("cena")}
            />
          ) : (
            <FlatList
              data={recipesState.cena.data}
              renderItem={renderRecipeItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.recipesContent}
              style={styles.recipesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 4: Meriendas */}
        <View key="merienda" style={styles.pageContainer}>
          {recipesState.merienda.loading ? (
            <LoadingState />
          ) : recipesState.merienda.error ? (
            <ErrorState
              title="Error al cargar las recetas"
              onRetry={() => fetchRecipesByCategory("merienda")}
            />
          ) : (
            <FlatList
              data={recipesState.merienda.data}
              renderItem={renderRecipeItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.recipesContent}
              style={styles.recipesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={<EmptyState />}
            />
          )}
        </View>

        {/* Página 5: Postres */}
        <View key="postre" style={styles.pageContainer}>
          {recipesState.postre.loading ? (
            <LoadingState />
          ) : recipesState.postre.error ? (
            <ErrorState
              title="Error al cargar las recetas"
              onRetry={() => fetchRecipesByCategory("postre")}
            />
          ) : (
            <FlatList
              data={recipesState.postre.data}
              renderItem={renderRecipeItem}
              keyExtractor={keyExtractor}
              contentContainerStyle={styles.recipesContent}
              style={styles.recipesContainer}
              showsVerticalScrollIndicator={false}
              initialNumToRender={5}
              maxToRenderPerBatch={5}
              windowSize={10}
              removeClippedSubviews={true}
              ListEmptyComponent={
                <EmptyState
                  title="No se encontraron recetas"
                  description="Intenta con otros filtros o términos de búsqueda"
                />
              }
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
  },
  pageContainer: {
    flex: 1,
  },
  recipesContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  recipesContent: {
    padding: 8,
  },
});

export default RecipesGallery;
