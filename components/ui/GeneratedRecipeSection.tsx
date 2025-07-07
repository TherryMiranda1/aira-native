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
      .filter((ingredient) => ingredient.trim())
      .slice(0, 8);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="list" size={18} color="#F97316" />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Ingredientes
          </ThemedText>
        </View>
        <View style={styles.ingredientsContainer}>
          {ingredientsList.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <Ionicons name="checkmark-circle" size={14} color="#F97316" />
              <ThemedText type="small" style={styles.ingredientText}>
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
      .filter((instruction) => instruction.trim())
      .slice(0, 6);

    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="library" size={18} color="#F97316" />
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Preparación
          </ThemedText>
        </View>
        <View style={styles.instructionsContainer}>
          {instructionsList.map((instruction, index) => (
            <View key={index} style={styles.instructionItem}>
              <View style={styles.stepNumber}>
                <ThemedText type="small" style={styles.stepNumberText}>
                  {index + 1}
                </ThemedText>
              </View>
              <ThemedText type="small" style={styles.instructionText}>
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
            <Ionicons name="restaurant" size={28} color="white" />
            <ThemedText type="title" style={styles.headerTitle}>
              {recipe.recipeName || "Tu Receta Personalizada"}
            </ThemedText>
            <ThemedText type="default" style={styles.headerSubtitle}>
              Generado especialmente para ti
            </ThemedText>
          </View>
        </LinearGradient>

        {recipe.reason && (
          <View style={styles.reasonCard}>
            <View style={styles.reasonHeader}>
              <Ionicons name="heart" size={18} color="#F97316" />
              <ThemedText type="defaultSemiBold" style={styles.reasonTitle}>
                ¿Por qué esta receta?
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.reasonText}>
              {recipe.reason}
            </ThemedText>
          </View>
        )}

        {recipe.estimatedTime && (
          <View style={styles.timeCard}>
            <Ionicons name="time" size={18} color="#F97316" />
            <ThemedText type="small" style={styles.timeLabel}>
              Tiempo estimado
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.timeValue}>
              {recipe.estimatedTime}
            </ThemedText>
          </View>
        )}

        {renderIngredients()}
        {renderInstructions()}

        {recipe.clarificationQuestion && (
          <View style={styles.clarificationCard}>
            <View style={styles.clarificationHeader}>
              <Ionicons name="help-circle" size={18} color="#F59E0B" />
              <ThemedText
                type="defaultSemiBold"
                style={styles.clarificationTitle}
              >
                Aira necesita más información
              </ThemedText>
            </View>
            <ThemedText type="small" style={styles.clarificationText}>
              {recipe.clarificationQuestion}
            </ThemedText>
          </View>
        )}

        <View style={styles.parametersCard}>
          <View style={styles.parametersHeader}>
            <Ionicons
              name="settings"
              size={18}
              color={AiraColors.mutedForeground}
            />
            <ThemedText type="defaultSemiBold" style={styles.parametersTitle}>
              Parámetros utilizados
            </ThemedText>
          </View>
          <View style={styles.parametersContent}>
            <View style={styles.parameterItem}>
              <ThemedText type="small" style={styles.parameterLabel}>
                Solicitud:
              </ThemedText>
              <ThemedText type="small" style={styles.parameterValue}>
                {inputParams.userInput}
              </ThemedText>
            </View>
            {inputParams.mealType && (
              <View style={styles.parameterItem}>
                <ThemedText type="small" style={styles.parameterLabel}>
                  Tipo de comida:
                </ThemedText>
                <ThemedText type="small" style={styles.parameterValue}>
                  {inputParams.mealType}
                </ThemedText>
              </View>
            )}
            {inputParams.cuisineType && (
              <View style={styles.parameterItem}>
                <ThemedText type="small" style={styles.parameterLabel}>
                  Tipo de cocina:
                </ThemedText>
                <ThemedText type="small" style={styles.parameterValue}>
                  {inputParams.cuisineType}
                </ThemedText>
              </View>
            )}
            {inputParams.cookingTime && (
              <View style={styles.parameterItem}>
                <ThemedText type="small" style={styles.parameterLabel}>
                  Tiempo de cocción:
                </ThemedText>
                <ThemedText type="small" style={styles.parameterValue}>
                  {inputParams.cookingTime}
                </ThemedText>
              </View>
            )}
            {inputParams.mainIngredients &&
              inputParams.mainIngredients.length > 0 && (
                <View style={styles.parameterItem}>
                  <ThemedText type="small" style={styles.parameterLabel}>
                    Ingredientes principales:
                  </ThemedText>
                  <ThemedText type="small" style={styles.parameterValue}>
                    {inputParams.mainIngredients.slice(0, 3).join(", ")}
                    {inputParams.mainIngredients.length > 3 && "..."}
                  </ThemedText>
                </View>
              )}
            {inputParams.dietaryRestrictions &&
              inputParams.dietaryRestrictions.length > 0 && (
                <View style={styles.parameterItem}>
                  <ThemedText type="small" style={styles.parameterLabel}>
                    Restricciones dietéticas:
                  </ThemedText>
                  <ThemedText type="small" style={styles.parameterValue}>
                    {inputParams.dietaryRestrictions.slice(0, 2).join(", ")}
                    {inputParams.dietaryRestrictions.length > 2 && "..."}
                  </ThemedText>
                </View>
              )}
          </View>
        </View>

        <View style={styles.controlsSection}>
          <View style={styles.controlsRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={onEditParams}
              disabled={isSaving || isRegenerating}
            >
              <Ionicons name="create" size={18} color={AiraColors.primary} />
              <ThemedText type="small" style={styles.editButtonText}>
                Editar
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.regenerateButton}
              onPress={onRegenerate}
              disabled={isSaving || isRegenerating}
            >
              {isRegenerating ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="refresh" size={18} color="white" />
              )}
              <ThemedText type="small" style={styles.regenerateButtonText}>
                {isRegenerating ? "Regenerando..." : "Regenerar"}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={onSave}
            disabled={isSaving || isRegenerating}
          >
            <LinearGradient
              colors={["#F97316", "#EA580C"]}
              style={styles.saveGradient}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="bookmark" size={20} color="white" />
              )}
              <ThemedText type="defaultSemiBold" style={styles.saveButtonText}>
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
  },
  content: {
    paddingBottom: 32,
  },
  headerGradient: {
    padding: 20,
    alignItems: "center",
    gap: 8,
  },
  headerContent: {
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  reasonCard: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.05),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    margin: 16,
    marginBottom: 16,
  },
  reasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  reasonTitle: {
    color: AiraColors.foreground,
  },
  reasonText: {
    color: AiraColors.foreground,
    lineHeight: 18,
  },
  timeCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  timeLabel: {
    color: AiraColors.mutedForeground,
    flex: 1,
  },
  timeValue: {
    color: "#F97316",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: AiraColors.foreground,
  },
  ingredientsContainer: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    gap: 10,
  },
  ingredientItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  ingredientText: {
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 18,
  },
  instructionsContainer: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    gap: 12,
  },
  instructionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  stepNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F97316",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  stepNumberText: {
    color: "white",
  },
  instructionText: {
    color: AiraColors.foreground,
    flex: 1,
    lineHeight: 18,
  },
  clarificationCard: {
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.05),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  clarificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  clarificationTitle: {
    color: "#F59E0B",
  },
  clarificationText: {
    color: AiraColors.foreground,
    lineHeight: 18,
  },
  parametersCard: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  parametersHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  parametersTitle: {
    color: AiraColors.foreground,
  },
  parametersContent: {
    gap: 10,
  },
  parameterItem: {
    gap: 4,
  },
  parameterLabel: {
    color: AiraColors.mutedForeground,
  },
  parameterValue: {
    color: AiraColors.foreground,
    lineHeight: 16,
  },
  controlsSection: {
    gap: 12,
    paddingHorizontal: 16,
  },
  controlsRow: {
    flexDirection: "row",
    gap: 12,
  },
  editButton: {
    flex: 1,
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editButtonText: {
    color: AiraColors.primary,
  },
  regenerateButton: {
    flex: 1,
    backgroundColor: AiraColors.mutedForeground,
    borderRadius: AiraVariants.cardRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  regenerateButtonText: {
    color: "white",
  },
  saveButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  saveGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveButtonText: {
    color: "white",
  },
});
