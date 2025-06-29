import React, { memo } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

// Categorías de recetas - Sincronizadas con RecipesGallery
const categories = [
  {
    id: "desayuno",
    name: "Desayunos",
    icon: "sunny-outline",
    color: "#f59e0b",
    image: require("@/assets/images/recipes/desayuno.jpg"),
  },
  {
    id: "almuerzo",
    name: "Almuerzos",
    icon: "restaurant-outline",
    color: "#60a5fa",
    image: require("@/assets/images/recipes/almuerzo.jpg"),
  },
  {
    id: "cena",
    name: "Cenas",
    icon: "moon-outline",
    color: "#a78bfa",
    image: require("@/assets/images/recipes/cena.jpg"),
  },
  {
    id: "merienda",
    name: "Meriendas",
    icon: "cafe-outline",
    color: "#34d399",
    image: require("@/assets/images/recipes/merienda.jpg"),
  },
  {
    id: "postre",
    name: "Postres",
    icon: "ice-cream-outline",
    color: "#f87171",
    image: require("@/assets/images/recipes/postre.jpg"),
  },
];

// Definición de recetas populares
const popularRecipes = [
  {
    id: "1",
    title: "Ensalada mediterránea",
    time: "20 min",
    calories: "320 kcal",
    image: require("@/assets/images/recipes/almuerzo.jpg"),
  },
  {
    id: "2",
    title: "Batido de proteínas",
    time: "5 min",
    calories: "180 kcal",
    image: require("@/assets/images/recipes/desayuno.jpg"),
  },
  {
    id: "3",
    title: "Pollo al horno con verduras",
    time: "45 min",
    calories: "450 kcal",
    image: require("@/assets/images/recipes/cena.jpg"),
  },
];

const CategoryCard = memo(
  ({
    category,
    isSelected,
    onPress,
  }: {
    category: (typeof categories)[0];
    isSelected: boolean;
    onPress: (id: string) => void;
  }) => {
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { borderColor: isSelected ? category.color : "transparent" },
        ]}
        onPress={() => onPress(category.id)}
        activeOpacity={0.7}
      >
        <Image source={category.image} style={styles.categoryImage} />
        <View style={[styles.categoryOverlay]}>
          <View style={styles.categoryIconWrapper}>
            <Ionicons name={category.icon as any} size={28} color="white" />
          </View>

          <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  }
);

// Añadir displayName para resolver error de lint
CategoryCard.displayName = "CategoryCard";

const RecipeCard = memo(
  ({
    recipe,
    onPress,
  }: {
    recipe: (typeof popularRecipes)[0];
    onPress: (id: string) => void;
  }) => {
    return (
      <TouchableOpacity
        style={styles.recipeCard}
        onPress={() => onPress(recipe.id)}
        activeOpacity={0.7}
      >
        <Image source={recipe.image} style={styles.recipeImage} />
        <View style={styles.recipeInfo}>
          <ThemedText style={styles.recipeTitle}>{recipe.title}</ThemedText>
          <View style={styles.recipeMetaInfo}>
            <View style={styles.recipeMetaItem}>
              <Ionicons
                name="time-outline"
                size={14}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.recipeMetaText}>
                {recipe.time}
              </ThemedText>
            </View>
            <View style={styles.recipeMetaItem}>
              <Ionicons
                name="flame-outline"
                size={14}
                color={AiraColors.mutedForeground}
              />
              <ThemedText style={styles.recipeMetaText}>
                {recipe.calories}
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
);

// Añadir displayName para resolver error de lint
RecipeCard.displayName = "RecipeCard";

interface RecipesDashboardProps {
  onViewAllRecipes: () => void;
  onSelectCategory: (categoryId: string) => void;
}

const RecipesDashboard: React.FC<RecipesDashboardProps> = ({
  onViewAllRecipes,
  onSelectCategory,
}) => {
  // Función para navegar a la receta seleccionada
  const handleRecipePress = (recipeId: string) => {
    // Implementar navegación al detalle de la receta
    console.log(`Navegar a receta: ${recipeId}`);
  };

  // Función para navegar al programa destacado
  const handleFeaturedPress = () => {
    // Implementar navegación al programa destacado
    console.log("Navegar al programa destacado");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Sección de categorías */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>
          Categorías de Recetas
        </ThemedText>
        <TouchableOpacity onPress={onViewAllRecipes}>
          <ThemedText style={styles.seeAllText}>Ver todo</ThemedText>
        </TouchableOpacity>
      </View>
      <View style={styles.categoriesGridContainer}>
        <FlatList
          horizontal={false}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.categoriesContainer}
          data={categories}
          keyExtractor={(item: (typeof categories)[0]) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: { item: (typeof categories)[0] }) => (
            <CategoryCard
              category={item}
              isSelected={false}
              onPress={onSelectCategory}
            />
          )}
        />
      </View>

      {/* Sección de recetas populares */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Recetas Populares</ThemedText>
        <TouchableOpacity onPress={onViewAllRecipes}>
          <ThemedText style={styles.seeAllText}>Ver todo</ThemedText>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.recipesContainer}
      >
        {popularRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onPress={handleRecipePress}
          />
        ))}
      </ScrollView>

      {/* Sección de programa destacado */}
      <View style={styles.sectionHeader}>
        <ThemedText style={styles.sectionTitle}>Destacado</ThemedText>
      </View>
      <TouchableOpacity
        style={styles.featuredContainer}
        onPress={handleFeaturedPress}
        activeOpacity={0.7}
      >
        <Image
          source={require("@/assets/images/recipes/cena.jpg")}
          style={styles.featuredImage}
        />
        <View style={styles.featuredOverlay}>
          <View style={styles.featuredContent}>
            <ThemedText style={styles.featuredTitle}>
              Plan de alimentación saludable
            </ThemedText>
            <ThemedText style={styles.featuredSubtitle}>
              7 días de recetas equilibradas
            </ThemedText>
            <View style={styles.featuredButton}>
              <ThemedText style={styles.featuredButtonText}>
                Ver detalles
              </ThemedText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.card,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
     
    color: AiraColors.foreground,
  },
  seeAllText: {
    fontSize: 14,
    color: AiraColors.primary,
  },
  categoriesContainer: {
    gap: 8,
    padding: 8,
  },
  categoriesGridContainer: {
    marginBottom: 16,
  },
  categoryCard: {
    flex: 0.5,
    aspectRatio: 1,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 16,
    justifyContent: "flex-end",
  },
  categoryName: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  categoryIconWrapper: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  recipesContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  recipeCard: {
    width: 200,
    height: 250,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: AiraColors.card,
  },
  recipeImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  recipeInfo: {
    padding: 12,
  },
  recipeTitle: {
    fontSize: 16,
     
    marginBottom: 8,
  },
  recipeMetaInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  featuredContainer: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  featuredContent: {
    padding: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  featuredButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  featuredButtonText: {
    color: "white",
    fontSize: 12,
     
  },
});

export default RecipesDashboard;
