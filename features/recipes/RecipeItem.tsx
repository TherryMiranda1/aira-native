import { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Recipe as RecipeType } from "@/services/api/recipe.service";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { getRecipeDifficultyColor } from "@/utils/colors";

export const RecipeItem = memo(
  ({
    recipe,
    onPress,
  }: {
    recipe: RecipeType;
    onPress: (id: string) => void;
  }) => {
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
                backgroundColor:
                  getRecipeDifficultyColor(recipe.dificultad) + "20",
                borderColor: getRecipeDifficultyColor(recipe.dificultad),
              },
            ]}
          >
            <ThemedText
              type="small"
              style={[{ color: getRecipeDifficultyColor(recipe.dificultad) }]}
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

const styles = StyleSheet.create({
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
});
