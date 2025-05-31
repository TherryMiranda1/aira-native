import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { ThemedText } from "@/components/ThemedText";

import { SearchModal } from "@/components/recipes/SearchModal";
import { FilterModal } from "@/components/recipes/FilterModal";

// Importamos los datos de recetas
import desayunos from "@/mocks/recipes/desayunos.json";
import almuerzos from "@/mocks/recipes/almuerzos.json";
import cenas from "@/mocks/recipes/cenas.json";
import meriendas from "@/mocks/recipes/meriendas.json";
import postres from "@/mocks/recipes/postres.json";
import { Topbar } from "@/components/ui/Topbar";
import { PageView } from "@/components/ui/PageView";
import { ActionButton } from "@/components/Buttons/ActionButton";

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

// Función para procesar las recetas y añadir id y categoría
const processRecipes = (recipes: any[], categoria: string): Recipe[] => {
  return recipes.map((recipe, index) => ({
    ...recipe,
    id: `${categoria}-${index + 1}`,
    categoria,
  }));
};

// Combinamos todas las recetas en un solo array
const allRecipes: Recipe[] = [
  ...processRecipes(desayunos, "desayunos"),
  ...processRecipes(almuerzos, "almuerzos"),
  ...processRecipes(cenas, "cenas"),
  ...processRecipes(meriendas, "meriendas"),
  ...processRecipes(postres, "postres"),
];

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

export default function RecipesScreen() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Modal states
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Recent searches (could be stored in AsyncStorage in a real app)
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Scroll animation
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    // Cargar las recetas cuando el componente se monte
    setRecipes(allRecipes);
  }, []);

  // Handle search
  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      // Add to recent searches if not already there
      if (!recentSearches.includes(searchTerm)) {
        setRecentSearches([searchTerm, ...recentSearches.slice(0, 4)]);
      }
      setSearchModalVisible(false);
    }
  };

  // Handle selecting a recent search
  const handleSelectRecentSearch = (search: string) => {
    setSearchTerm(search);
    setSearchModalVisible(false);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterDifficulty("");
    setFilterCategory("");
  };

  // Apply filters and close modal
  const applyFilters = () => {
    setFilterModalVisible(false);
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch =
      recipe.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingrediente_principal
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      filterDifficulty === "" || recipe.dificultad === filterDifficulty;
    const matchesCategory =
      filterCategory === "" || recipe.categoria === filterCategory;
    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  return (
    <PageView>
      <Topbar
        title="Recetas Deliciosas 🍽️"
        actions={
          <>
            <ActionButton
              onPress={() => setSearchModalVisible(true)}
              icon="search"
            />
            <ActionButton
              onPress={() => setFilterModalVisible(true)}
              icon="filter"
            />
          </>
        }
      />

      <Animated.ScrollView
        style={styles.recipesContainer}
        contentContainerStyle={styles.recipesContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <View key={recipe.id} style={styles.recipeCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.difficultyBadge,
                    {
                      backgroundColor:
                        getDifficultyColor(recipe.dificultad) + "20",
                      borderColor: getDifficultyColor(recipe.dificultad),
                    },
                  ]}
                >
                  <ThemedText
                    style={[
                      styles.difficultyText,
                      { color: getDifficultyColor(recipe.dificultad) },
                    ]}
                  >
                    {recipe.dificultad}
                  </ThemedText>
                </View>
                <TouchableOpacity>
                  <Ionicons name="heart-outline" size={20} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              <ThemedText style={styles.recipeTitle}>
                {recipe.titulo}
              </ThemedText>

              <ThemedText style={styles.recipeIngredient}>
                🥘 {recipe.ingrediente_principal}
              </ThemedText>

              <ThemedText style={styles.recipeCategory}>
                📚{" "}
                {recipe.categoria &&
                  recipe.categoria.charAt(0).toUpperCase() +
                    recipe.categoria.slice(1)}
              </ThemedText>

              <View style={styles.recipeDetails}>
                <View style={styles.recipeDetail}>
                  <Ionicons name="time-outline" size={16} color="#6b7280" />
                  <ThemedText style={styles.recipeDetailText}>
                    {recipe.tiempo_preparacion}
                  </ThemedText>
                </View>
                <View style={styles.recipeDetail}>
                  <Ionicons
                    name="restaurant-outline"
                    size={16}
                    color="#6b7280"
                  />
                  <ThemedText style={styles.recipeDetailText}>
                    {recipe.calorias}
                  </ThemedText>
                </View>
              </View>

              <ThemedText style={styles.recipeDescription} numberOfLines={3}>
                {recipe.preparacion.substring(0, 120)}...
              </ThemedText>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  // @ts-ignore - Ignoramos el error de tipado en la navegación
                  router.push(`/recipe/${recipe.id}`);
                }}
              >
                <ThemedText type="defaultSemiBold" style={styles.viewButtonText}>
                  Ver Receta
                </ThemedText>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={64}
              color={AiraColors.mutedForeground}
            />
            <ThemedText style={styles.emptyText}>
              No se encontraron recetas
            </ThemedText>
            <ThemedText style={styles.emptySubtext}>
              Intenta con otros filtros o términos de búsqueda
            </ThemedText>
          </View>
        )}
      </Animated.ScrollView>

      {/* Search Modal */}
      <SearchModal
        visible={searchModalVisible}
        searchTerm={searchTerm}
        onChangeText={setSearchTerm}
        onClose={() => setSearchModalVisible(false)}
        onSearch={handleSearch}
        recentSearches={recentSearches}
        onSelectRecentSearch={handleSelectRecentSearch}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
        filterDifficulty={filterDifficulty}
        setFilterDifficulty={setFilterDifficulty}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />
    </PageView>
  );
}

const styles = StyleSheet.create({
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  // Active filters styles
  activeFiltersContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  activeFilterBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.tagRadius,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  activeFilterText: {
    fontSize: 14,
    color: AiraColors.foreground,
    marginRight: 6,
  },
  clearAllFiltersButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllFiltersText: {
    fontSize: 14,
    color: AiraColors.primary,
  },
  // Original styles

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
    marginBottom: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
    padding: 8,
  },
  recipeImage: {
    width: "100%",
    height: 180,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.2),
  },
  recipeContent: {
    padding: 8,
  },
  recipeTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  recipeDescription: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
    lineHeight: 20,
  },
  recipeMetaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  recipeMetaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeMetaText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  recipeTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  recipeTag: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    marginRight: 8,
    marginBottom: 8,
  },
  recipeTagText: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
  },
  // Empty state styles already exist in the original styles
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
  difficultyText: {
    fontSize: 12,
    color: AiraColors.foreground,
  },
  recipeIngredient: {
    fontSize: 14,
    color: AiraColors.primary,
    marginBottom: 4,
  },
  recipeCategory: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginBottom: 8,
  },
  recipeDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  recipeDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  recipeDetailText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginLeft: 4,
  },
  viewButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 10,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
  },
  viewButtonText: {
    color: AiraColors.background,
    fontSize: 14,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    marginTop: 8,
    textAlign: "center",
  },
});
