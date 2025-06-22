import React from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { SuggestRecipeInput, SuggestRecipeOutput } from "@/types/Assistant";

interface GeneratedRecipeSectionProps {
  recipe: SuggestRecipeOutput;
  inputParams: SuggestRecipeInput;
  onSave: () => void;
  onRegenerate: () => void;
  onEditParams: () => void;
  isSaving: boolean;
  isRegenerating: boolean;
}

export function GeneratedRecipeSection({
  recipe,
  inputParams,
  onSave,
  onRegenerate,
  onEditParams,
  isSaving,
  isRegenerating,
}: GeneratedRecipeSectionProps) {
  const formatText = (text: string): string => {
    return text.replace(/\\n/g, "\n");
  };

  const renderIngredients = () => {
    if (!recipe.ingredients) return null;

    const ingredientsList = formatText(recipe.ingredients)
      .split("\n")
      .filter((ingredient) => ingredient.trim());

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={20} color="#F97316" />
          <ThemedText style={styles.sectionTitle}>Ingredientes</ThemedText>
        </View>
        <View style={styles.ingredientsContainer}>
          {ingredientsList.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="checkmark-circle" size={16} color="#F97316" />
              <ThemedText style={styles.ingredientText}>
                {ingredient.trim()}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderInstructions = () => {
    if (!recipe.instructions) return null;

    const instructionsList = formatText(recipe.instructions)
      .split("\n")
      .filter((instruction) => instruction.trim());

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="library" size={20} color="#3B82F6" />
          <ThemedText style={styles.sectionTitle}>Preparación</ThemedText>
        </View>
        <View style={styles.instructionsContainer}>
          {instructionsList.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <ThemedText style={styles.stepNumberText}>
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText style={styles.instructionText}>
                {instruction.replace(/^\d+\.\s*/, "").trim()}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <LinearGradient
          colors={["#F97316", "#EA580C"]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Ionicons name="restaurant" size={32} color="white" />
            <ThemedText style={styles.headerTitle}>
              {recipe.recipeName || "Tu Receta Personalizada"}
            </ThemedText>
            <ThemedText style={styles.headerSubtitle}>
              Generado por Aira especialmente para ti
            </ThemedText>
          </View>
        </LinearGradient>

        {recipe.reason && (
          <View style={styles.reasonCard}>
            <View style={styles.reasonHeader}>
              <Ionicons name="heart" size={20} color="#F97316" />
              <ThemedText style={styles.reasonTitle}>
                ¿Por qué esta receta?
              </ThemedText>
            </View>
            <ThemedText style={styles.reasonText}>{recipe.reason}</ThemedText>
          </View>
        )}

        {recipe.estimatedTime && (
          <View style={styles.timeCard}>
            <Ionicons name="time" size={20} color="#3B82F6" />
            <ThemedText style={styles.timeLabel}>Tiempo estimado</ThemedText>
            <ThemedText style={styles.timeValue}>{recipe.estimatedTime}</ThemedText>
          </View>
        )}

        {renderIngredients()}
        {renderInstructions()}

        {recipe.clarificationQuestion && (
          <View style={styles.clarificationCard}>
            <View style={styles.clarificationHeader}>
              <Ionicons name="help-circle" size={20} color="#F59E0B" />
              <ThemedText style={styles.clarificationTitle}>
                Aira necesita más información
              </ThemedText>
            </View>
            <ThemedText style={styles.clarificationText}>
              {recipe.clarificationQuestion}
            </ThemedText>
          </View>
        )}

        <View style={styles.parametersCard}>
          <View style={styles.parametersHeader}>
            <Ionicons name="settings" size={20} color="#8B5CF6" />
            <ThemedText style={styles.parametersTitle}>
              Parámetros utilizados
            </ThemedText>
          </View>
          <View style={styles.parametersContent}>
            <View style={styles.parameterItem}>
              <ThemedText style={styles.parameterLabel}>Solicitud:</ThemedText>
              <ThemedText style={styles.parameterValue}>
                {inputParams.userInput}
              </ThemedText>
            </View>
            {inputParams.mealType && (
              <View style={styles.parameterItem}>
                <ThemedText style={styles.parameterLabel}>
                  Tipo de comida:
                </ThemedText>
                <ThemedText style={styles.parameterValue}>
                  {inputParams.mealType}
                </ThemedText>
              </View>
            )}
            {inputParams.cuisineType && (
              <View style={styles.parameterItem}>
                <ThemedText style={styles.parameterLabel}>
                  Tipo de cocina:
                </ThemedText>
                <ThemedText style={styles.parameterValue}>
                  {inputParams.cuisineType}
                </ThemedText>
              </View>
            )}
            {inputParams.cookingTime && (
              <View style={styles.parameterItem}>
                <ThemedText style={styles.parameterLabel}>
                  Tiempo de cocción:
                </ThemedText>
                <ThemedText style={styles.parameterValue}>
                  {inputParams.cookingTime}
                </ThemedText>
              </View>
            )}
            {inputParams.mainIngredients && inputParams.mainIngredients.length > 0 && (
              <View style={styles.parameterItem}>
                <ThemedText style={styles.parameterLabel}>
                  Ingredientes principales:
                </ThemedText>
                <ThemedText style={styles.parameterValue}>
                  {inputParams.mainIngredients.join(", ")}
                </ThemedText>
              </View>
            )}
            {inputParams.dietaryRestrictions && inputParams.dietaryRestrictions.length > 0 && (
              <View style={styles.parameterItem}>
                <ThemedText style={styles.parameterLabel}>
                  Restricciones dietéticas:
                </ThemedText>
                <ThemedText style={styles.parameterValue}>
                  {inputParams.dietaryRestrictions.join(", ")}
                </ThemedText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onEditParams}
            disabled={isSaving || isRegenerating}
          >
            <Ionicons name="create" size={20} color="#3B82F6" />
            <ThemedText style={styles.secondaryButtonText}>
              Editar parámetros
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onRegenerate}
            disabled={isSaving || isRegenerating}
          >
            {isRegenerating ? (
              <ActivityIndicator size="small" color="#3B82F6" />
            ) : (
              <Ionicons name="refresh" size={20} color="#3B82F6" />
            )}
            <ThemedText style={styles.secondaryButtonText}>
              {isRegenerating ? "Regenerando..." : "Regenerar"}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onSave}
            disabled={isSaving || isRegenerating}
          >
            <LinearGradient
              colors={["#F97316", "#EA580C"]}
              style={styles.primaryButtonGradient}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="bookmark" size={20} color="white" />
              )}
              <ThemedText style={styles.primaryButtonText}>
                {isSaving ? "Guardando..." : "Guardar receta"}
              </ThemedText>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  content: {
    paddingBottom: 40,
  },
  headerGradient: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  headerContent: {
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  reasonCard: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.05),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    margin: 20,
    marginBottom: 16,
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  reasonText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  timeLabel: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    flex: 1,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3B82F6",
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  ingredientsContainer: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    gap: 12,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    gap: 16,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: "600",
    color: "white",
  },
  instructionText: {
    fontSize: 14,
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 20,
  },
  clarificationCard: {
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.05),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  clarificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  clarificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F59E0B",
  },
  clarificationText: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 20,
  },
  parametersCard: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
  },
  parametersHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  parametersTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  parametersContent: {
    gap: 12,
  },
  parameterItem: {
    gap: 4,
  },
  parameterLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: AiraColors.mutedForeground,
  },
  parameterValue: {
    fontSize: 14,
    color: AiraColors.foreground,
    lineHeight: 18,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    flexWrap: "wrap",
  },
  secondaryButton: {
    flex: 1,
    minWidth: 120,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: AiraColors.card,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  primaryButton: {
    flex: 1,
    minWidth: 140,
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  primaryButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
}); 