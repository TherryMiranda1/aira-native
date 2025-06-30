import React from "react";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { SuggestRecipeOutput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentText } from "./ContentCard";

interface RecipeCardProps {
  recipe: SuggestRecipeOutput;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <ContentCard
      title={`🍳 ${recipe.recipeName || "Receta Sugerida"}`}
      description={recipe.reason}
    >
      {recipe.ingredients && (
        <ContentSection title="Ingredientes:">
          <ContentText>{recipe.ingredients}</ContentText>
        </ContentSection>
      )}
      
      {recipe.instructions && (
        <ContentSection title="Preparación:">
          <ContentText>{recipe.instructions}</ContentText>
        </ContentSection>
      )}
      
      {recipe.estimatedTime && (
        <ThemedText style={{
          fontSize: 12,
          color: AiraColors.mutedForeground,
          fontStyle: "italic",
          marginTop: 4,
        }}>
          ⏱️ Tiempo estimado: {recipe.estimatedTime}
        </ThemedText>
      )}
    </ContentCard>
  );
} 