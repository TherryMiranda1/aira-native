import { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Recipe as RecipeType } from "@/services/api/recipe.service";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { getRecipeDifficultyColor } from "@/utils/colors";
import { ThemedView } from "@/components/ThemedView";

export const RecipeItem = memo(
  ({
    recipe,
    onPress,
    onSchedule,
  }: {
    recipe: RecipeType;
    onPress: (id: string) => void;
    onSchedule?: (recipeId: string, recipeTitle: string) => void;
  }) => {
    return (
      <TouchableOpacity onPress={() => onPress(recipe.id || "")}>
        <ThemedView style={styles.recipeCard}>
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
            <View style={styles.actionsContainer}>
              {onSchedule && (
                <TouchableOpacity
                  style={styles.scheduleButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    onSchedule(recipe.id || "", recipe.titulo);
                  }}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={16}
                    color={AiraColors.primary}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity>
                <Ionicons name="heart-outline" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>

          <ThemedText style={styles.recipeTitle}>{recipe.titulo}</ThemedText>

          <ThemedText type="small">
            🥘 {recipe.ingrediente_principal}
          </ThemedText>

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
        </ThemedView>
      </TouchableOpacity>
    );
  }
);

RecipeItem.displayName = "RecipeItem";

const styles = StyleSheet.create({
  recipeCard: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    overflow: "hidden",
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
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scheduleButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
  },
  recipeTitle: {
    fontSize: 18,
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
