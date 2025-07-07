import React from "react";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { SuggestRecipeOutput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentList } from "./ContentCard";

interface RecipeCardProps {
  recipe: SuggestRecipeOutput;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const ingredientsList =
    recipe.ingredients
      ?.split("\n")
      .map((item) => item.trim())
      .filter((item) => item && item.length > 0) || [];

  const instructionsList =
    recipe.instructions
      ?.split("\n")
      .map((item) => item.trim())
      .filter((item) => item && item.length > 0) || [];

  return (
    <ContentCard
      title={recipe.recipeName || "Receta Sugerida"}
      subtitle="Receta personalizada"
      description={recipe.reason}
      icon="🍳"
      variant="success"
    >
      {ingredientsList.length > 0 && (
        <ContentSection title="Ingredientes" icon="🥘">
          <ContentList items={ingredientsList} type="bullet" />
        </ContentSection>
      )}

      {instructionsList.length > 0 && (
        <ContentSection title="Preparación" icon="👩‍🍳">
          <ContentList items={instructionsList} type="numbered" />
        </ContentSection>
      )}

      {recipe.estimatedTime && (
        <View style={styles.timeContainer}>
          <View style={styles.timeCard}>
            <ThemedText type="small" style={styles.timeLabel}>
              ⏱️ Tiempo estimado
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.timeValue}>
              {recipe.estimatedTime}
            </ThemedText>
          </View>
        </View>
      )}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  timeContainer: {
    marginTop: 8,
  },
  timeCard: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  timeLabel: {
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  timeValue: {
    color: AiraColors.primary,
  },
});
