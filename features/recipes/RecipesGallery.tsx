import React, {
  useState,
  useRef,
  useCallback,
  memo,
  useEffect,
  useMemo,
} from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { useCategoryScroll } from "@/hooks/useCategoryScroll";
import { Ionicons } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "@/components/ThemedText";

// Importamos los datos de recetas
import desayunos from "@/mocks/recipes/desayunos.json";
import almuerzos from "@/mocks/recipes/almuerzos.json";
import cenas from "@/mocks/recipes/cenas.json";
import meriendas from "@/mocks/recipes/meriendas.json";
import postres from "@/mocks/recipes/postres.json";

interface Ingrediente {
  item: string;
  cantidad: string;
}

interface Recipe {
  id?: string;
  titulo: string;
  ingrediente_principal: string;
  preparacion: string;
  ingredientes: Ingrediente[];
  calorias: string;
  tiempo_preparacion: string;
  dificultad: string;
  categoria?: string;
}

interface Category {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// Función para procesar las recetas y añadir id y categoría
const processRecipes = (recipes: any[], categoria: string): Recipe[] => {
  return recipes.map((recipe, index) => ({
    ...recipe,
    id: `${categoria}-${index + 1}`,
    categoria,
  }));
};

// Procesamos las recetas por categoría
const desayunosData = processRecipes(desayunos, "desayunos");
const almuerzosData = processRecipes(almuerzos, "almuerzos");
const cenasData = processRecipes(cenas, "cenas");
const meriendasData = processRecipes(meriendas, "meriendas");
const postresData = processRecipes(postres, "postres");

// Función para obtener el color según la dificultad
const getDifficultyColor = (dificultad: string) => {
  switch (dificultad.toLowerCase()) {
    case "muy fácil":
      return "#4ade80"; // verde
    case "fácil":
      return "#60a5fa"; // azul
    case "medio":
      return "#facc15"; // amarillo
    case "difícil":
      return "#f87171"; // rojo
    default:
      return AiraColors.mutedForeground; // gris
  }
};

/**
 * Componente memoizado para renderizar cada tarjeta de receta
 * Optimizado para evitar re-renderizados innecesarios
 */
const RecipeItem = memo(
  ({ recipe, onPress }: { recipe: Recipe; onPress: (id: string) => void }) => {
    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => onPress(recipe.id || "")}
      >
        <View style={styles.cardHeader}>
          <View
            style={[
              styles.difficultyBadge,
              {
                backgroundColor: getDifficultyColor(recipe.dificultad) + "20",
                borderColor: getDifficultyColor(recipe.dificultad),
              },
            ]}
          >
            <ThemedText
              type="small"
              style={[{ color: getDifficultyColor(recipe.dificultad) }]}
            >
              {recipe.dificultad}
            </ThemedText>
          </View>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ThemedText style={styles.recipeTitle}>{recipe.titulo}</ThemedText>

        <ThemedText type="small">🥘 {recipe.ingrediente_principal}</ThemedText>

        <View style={styles.recipeDetails}>
          <View style={styles.recipeDetail}>
            <Ionicons name="time-outline" size={16} color="#6b7280" />
            <ThemedText type="small">{recipe.tiempo_preparacion}</ThemedText>
          </View>
          <View style={styles.recipeDetail}>
            <Ionicons name="restaurant-outline" size={16} color="#6b7280" />
            <ThemedText type="small">{recipe.calorias}</ThemedText>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

// Añadir displayName para resolver error de lint
RecipeItem.displayName = "RecipeItem";

/**
 * Componente para mostrar cuando no hay resultados de búsqueda
 */
const EmptyResultsView = memo(() => (
  <View style={styles.emptyContainer}>
    <Ionicons
      name="search-outline"
      size={64}
      color={AiraColors.mutedForeground}
    />
    <ThemedText style={styles.emptyText}>No se encontraron recetas</ThemedText>
    <ThemedText style={styles.emptySubtext}>
      Intenta con otros filtros o términos de búsqueda
    </ThemedText>
  </View>
));

// Añadir displayName para resolver error de lint
EmptyResultsView.displayName = "EmptyResultsView";

interface RecipesGalleryProps {
  initialCategory?: string;
}

const RecipesGallery = ({ initialCategory }: RecipesGalleryProps) => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    initialCategory || "desayunos"
  );
  const pagerRef = useRef<PagerView>(null);

  // Categorías de recetas
  const categories: Category[] = useMemo(
    () => [
      { id: "desayunos", label: "Desayunos", icon: "sunny-outline" },
      { id: "almuerzos", label: "Almuerzos", icon: "restaurant-outline" },
      { id: "cenas", label: "Cenas", icon: "moon-outline" },
      { id: "meriendas", label: "Meriendas", icon: "cafe-outline" },
      { id: "postres", label: "Postres", icon: "ice-cream-outline" },
    ],
    []
  );

  const currentIndex = useMemo(
    () => categories.findIndex((cat) => cat.id === selectedCategory),
    [selectedCategory, categories]
  );

  // Utilizamos el hook personalizado para manejar el scroll de categorías
  const categoryScrollHook = useCategoryScroll(categories, currentIndex, {
    itemVisiblePercentThreshold: 70,
  });

  useEffect(() => {
    if (initialCategory && pagerRef.current) {
      const categoryIndex = categories.findIndex(
        (cat) => cat.id === initialCategory
      );
      if (categoryIndex !== -1) {
        // Pequeño timeout para asegurar que el PagerView esté listo
        setTimeout(() => {
          pagerRef.current?.setPage(categoryIndex);
        }, 100);
      }
    }
  }, [initialCategory, categories]);

  // Función para cambiar de categoría
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // Obtener el índice de la categoría seleccionada
    const categoryIndex = categories.findIndex((cat) => cat.id === categoryId);
    if (categoryIndex !== -1) {
      pagerRef.current?.setPage(categoryIndex);
    }
  };

  // Función para manejar el cambio de página en el PagerView
  const handlePageChange = (e: { nativeEvent: { position: number } }) => {
    const newIndex = e.nativeEvent.position;
    if (categories[newIndex]) {
      setSelectedCategory(categories[newIndex].id);
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
    ({ item }: { item: Recipe }) => {
      return <RecipeItem recipe={item} onPress={handleRecipePress} />;
    },
    [handleRecipePress]
  );

  // Key extractor para la FlatList
  const keyExtractor = useCallback(
    (item: Recipe) => item.id || Math.random().toString(),
    []
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Selector de categorías */}
      <View style={styles.categoriesContainer}>
        <FlatList
          ref={categoryScrollHook.categoriesListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.categoryButton,
                selectedCategory === item.id && styles.categoryButtonActive,
              ]}
              onPress={() => handleCategoryChange(item.id)}
            >
              <Ionicons
                name={item.icon}
                size={18}
                color={AiraColors.foreground}
                style={styles.categoryIcon}
              />
              <ThemedText style={[styles.categoryText]}>
                {item.label}
              </ThemedText>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesContent}
          onScrollToIndexFailed={categoryScrollHook.handleScrollToIndexFailed}
          getItemLayout={(data, index) => ({
            length: 120, // Aproximado del ancho del botón de categoría + margen
            offset: 120 * index,
            index,
          })}
        />
      </View>

      {/* Contenido según la categoría seleccionada */}
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={handlePageChange}
      >
        {/* Página 1: Desayunos */}
        <View key="desayunos" style={styles.pageContainer}>
          <FlatList
            data={desayunosData}
            renderItem={renderRecipeItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.recipesContent}
            style={styles.recipesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 2: Almuerzos */}
        <View key="almuerzos" style={styles.pageContainer}>
          <FlatList
            data={almuerzosData}
            renderItem={renderRecipeItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.recipesContent}
            style={styles.recipesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 3: Cenas */}
        <View key="cenas" style={styles.pageContainer}>
          <FlatList
            data={cenasData}
            renderItem={renderRecipeItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.recipesContent}
            style={styles.recipesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 4: Meriendas */}
        <View key="meriendas" style={styles.pageContainer}>
          <FlatList
            data={meriendasData}
            renderItem={renderRecipeItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.recipesContent}
            style={styles.recipesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
        </View>

        {/* Página 5: Postres */}
        <View key="postres" style={styles.pageContainer}>
          <FlatList
            data={postresData}
            renderItem={renderRecipeItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.recipesContent}
            style={styles.recipesContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}
            ListEmptyComponent={<EmptyResultsView />}
          />
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
  categoryTextActive: {
    color: AiraColors.background,
    fontWeight: "500",
  },
  // Recipe list styles
  recipesContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  recipesContent: {
    padding: 8,
  },
  recipeCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
  },

  recipeTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },

  recipeDetails: {
    marginBottom: 4,
  },
  recipeDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  recipeDetailText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  recipeDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
    marginBottom: 16,
  },
  viewButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: AiraVariants.tagRadius,
    alignItems: "center",
  },
  viewButtonText: {
    color: AiraColors.background,
    fontSize: 14,
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

export default RecipesGallery;
