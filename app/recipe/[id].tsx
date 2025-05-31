import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { ModalScreen } from "@/components/navigation/ModalScreen";

// Importamos los datos de recetas
import desayunos from "@/mocks/recipes/desayunos.json";
import almuerzos from "@/mocks/recipes/almuerzos.json";
import cenas from "@/mocks/recipes/cenas.json";
import meriendas from "@/mocks/recipes/meriendas.json";
import postres from "@/mocks/recipes/postres.json";
import { AiraVariants } from "@/constants/Themes";

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

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Buscar la receta por ID cuando el componente se monte
    const foundRecipe = allRecipes.find((r) => r.id === id);
    setRecipe(foundRecipe || null);
    setLoading(false);
  }, [id]);

  // Dividir los pasos de preparación
  const preparationSteps =
    recipe?.preparacion
      .split(/\d+\./)
      .filter((step) => step.trim().length > 0) || [];

  if (loading) {
    return (
      <PageView style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={AiraColors.primary} />
          <ThemedText style={styles.loadingTitle}>
            Cargando receta...
          </ThemedText>
        </View>
      </PageView>
    );
  }

  if (!recipe) {
    return (
      <ModalScreen title="Receta no encontrada">
        <View style={styles.loadingCard}>
          <ThemedText style={styles.loadingEmoji}>😔</ThemedText>
          <ThemedText style={styles.loadingTitle}>
            Receta no encontrada
          </ThemedText>
          <ThemedText style={styles.loadingSubtitle}>
            Lo siento, no pudimos encontrar la receta que buscas.
          </ThemedText>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ThemedText style={styles.backButtonText}>
              Volver a Recetas
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ModalScreen>
    );
  }

  return (
    <ModalScreen title={recipe.titulo}>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Recipe Header */}
        <View style={styles.recipeHeader}>
          <View style={styles.headerTop}>
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
              <Ionicons
                name="heart-outline"
                size={24}
                color={AiraColors.mutedForeground}
              />
            </TouchableOpacity>
          </View>

          <ThemedText style={styles.recipeTitle}>{recipe.titulo}</ThemedText>
          <ThemedText style={styles.recipeIngredient}>
            🥘 Ingrediente principal: {recipe.ingrediente_principal}
          </ThemedText>

          <View style={styles.recipeStats}>
            <View
              style={[
                styles.statItem,
                {
                  backgroundColor:
                    AiraColorsWithAlpha.primaryWithOpacity(0.1),
                },
              ]}
            >
              <Ionicons
                name="time-outline"
                size={24}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.statLabel}>Tiempo</ThemedText>
              <ThemedText style={styles.statValue}>
                {recipe.tiempo_preparacion}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statItem,
                {
                  backgroundColor:
                    AiraColorsWithAlpha.primaryWithOpacity(0.1),
                },
              ]}
            >
              <Ionicons
                name="restaurant-outline"
                size={24}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.statLabel}>Calorías</ThemedText>
              <ThemedText style={styles.statValue}>
                {recipe.calorias}
              </ThemedText>
            </View>
            <View
              style={[
                styles.statItem,
                {
                  backgroundColor:
                    AiraColorsWithAlpha.primaryWithOpacity(0.1),
                },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.statLabel}>Porciones</ThemedText>
              <ThemedText style={styles.statValue}>1 persona</ThemedText>
            </View>
            <View
              style={[
                styles.statItem,
                {
                  backgroundColor:
                    AiraColorsWithAlpha.primaryWithOpacity(0.1),
                },
              ]}
            >
              <Ionicons
                name="thermometer-outline"
                size={24}
                color={AiraColors.primary}
              />
              <ThemedText style={styles.statLabel}>Dificultad</ThemedText>
              <ThemedText style={styles.statValue}>
                {recipe.dificultad}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>🛒 Ingredientes</ThemedText>
          <View style={styles.ingredientsList}>
            {recipe.ingredientes.map((ingrediente, index) => (
              <View key={index} style={styles.ingredientItem}>
                <ThemedText style={styles.ingredientName}>
                  {ingrediente.item}
                </ThemedText>
                <ThemedText style={styles.ingredientAmount}>
                  {ingrediente.cantidad}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Preparation */}
        <View style={styles.sectionCard}>
          <ThemedText style={styles.sectionTitle}>👩‍🍳 Preparación</ThemedText>
          <View style={styles.preparationList}>
            {preparationSteps.map((step, index) => (
              <View key={index} style={styles.preparationStep}>
                <View style={styles.stepNumber}>
                  <ThemedText style={styles.stepNumberText}>
                    {index + 1}
                  </ThemedText>
                </View>
                <ThemedText style={styles.stepText}>{step.trim()}</ThemedText>
              </View>
            ))}
          </View>
        </View>

        {/* Encouragement Message */}
        <View style={styles.encouragementCard}>
          <ThemedText style={styles.encouragementEmoji}>✨</ThemedText>
          <ThemedText style={styles.encouragementTitle}>
            ¡Vas a crear algo delicioso!
          </ThemedText>
          <ThemedText style={styles.encouragementText}>
            Recuerda que cocinar es un acto de amor hacia ti misma. No te
            preocupes si no sale perfecto la primera vez, cada intento es un
            paso más hacia cuidarte mejor. ¡Disfruta el proceso! 💕
          </ThemedText>
        </View>
      </ScrollView>
    </ModalScreen>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: AiraColors.background,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  loadingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 24,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  loadingTitle: {
    fontSize: 20,
    color: AiraColors.foreground,
    marginBottom: 8,
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: AiraColors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: AiraVariants.tagRadius,
  },
  backButtonText: {
    color: AiraColors.primaryForeground,
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  scrollViewContent: {
    padding: 16,
  },
  backButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backButtonLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  recipeHeader: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: AiraVariants.tagRadius,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  difficultyText: {
    fontSize: 12,
    color: AiraColors.foreground,
  },
  recipeTitle: {
    fontSize: 20,
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  recipeIngredient: {
    fontSize: 14,
    color: AiraColors.primary,
    marginBottom: 16,
  },
  recipeStats: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statItem: {
    width: "48%",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  statLabel: {
    fontSize: 12,
    color: AiraColors.mutedForeground,
    marginTop: 4,
  },
  statValue: {
    fontSize: 14,
    color: AiraColors.foreground,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: AiraColors.card,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginBottom: 16,
  },
  ingredientsList: {
    marginBottom: 24,
  },
  ingredientItem: {
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: AiraColorsWithAlpha.borderWithOpacity(0.2),
  },
  ingredientName: {
    fontSize: 14,
    color: AiraColors.foreground,
  },
  ingredientAmount: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
  },
  preparationList: {
    marginBottom: 16,
  },
  preparationStep: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: AiraColors.primaryForeground,
    fontSize: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    color: AiraColors.mutedForeground,
    lineHeight: 20,
  },
  encouragementCard: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  encouragementEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  encouragementTitle: {
    fontSize: 18,
    color: AiraColors.foreground,
    marginBottom: 8,
  },
  encouragementText: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
});
