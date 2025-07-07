import React, { useState } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { SuggestRecipeInput } from "@/types/Assistant";
import { useAlertHelpers } from "@/components/ui/AlertSystem";

interface RecipeSuggestionFormProps {
  onSubmit: (formData: SuggestRecipeInput) => void;
  isLoading: boolean;
  initialData?: SuggestRecipeInput;
}

export function RecipeSuggestionForm({
  onSubmit,
  isLoading,
  initialData,
}: RecipeSuggestionFormProps) {
  const { showError } = useAlertHelpers();
  const [formData, setFormData] = useState<SuggestRecipeInput>({
    userInput: initialData?.userInput || "",
    mealType: initialData?.mealType || "",
    mainIngredients: initialData?.mainIngredients || [],
    dietaryRestrictions: initialData?.dietaryRestrictions || [],
    cuisineType: initialData?.cuisineType || "",
    cookingTime: initialData?.cookingTime || "",
    userDietaryPreferences: initialData?.userDietaryPreferences || "",
    userAllergies: initialData?.userAllergies || "",
    userDislikedFoods: initialData?.userDislikedFoods || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ingredientInput, setIngredientInput] = useState("");
  const [restrictionInput, setRestrictionInput] = useState("");
  const [selectedQuickOption, setSelectedQuickOption] = useState<string>("");

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.userInput.trim()) {
      newErrors.userInput = "Describe qué tipo de receta necesitas";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      showError(
        "Formulario incompleto",
        "Por favor completa los campos requeridos"
      );
      return;
    }

    onSubmit(formData);
  };

  const addIngredient = () => {
    if (ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        mainIngredients: [
          ...(prev.mainIngredients || []),
          ingredientInput.trim(),
        ],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mainIngredients:
        prev.mainIngredients?.filter((_, i) => i !== index) || [],
    }));
  };

  const addRestriction = () => {
    if (restrictionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [
          ...(prev.dietaryRestrictions || []),
          restrictionInput.trim(),
        ],
      }));
      setRestrictionInput("");
    }
  };

  const removeRestriction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions:
        prev.dietaryRestrictions?.filter((_, i) => i !== index) || [],
    }));
  };

  const quickOptions = [
    {
      id: "breakfast",
      label: "Desayuno Saludable",
      description: "Nutritivo y energizante",
      value: "Necesito una receta de desayuno nutritivo y energizante",
      mealType: "Desayuno",
      cookingTime: "15 minutos",
      icon: "sunny" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "lunch",
      label: "Almuerzo Rápido",
      description: "Rápido y equilibrado",
      value: "Quiero una receta de almuerzo rápida y equilibrada",
      mealType: "Almuerzo",
      cookingTime: "30 minutos",
      icon: "restaurant" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "dinner",
      label: "Cena Ligera",
      description: "Ligera y saludable",
      value: "Busco una receta de cena ligera y saludable",
      mealType: "Cena",
      cookingTime: "45 minutos",
      icon: "moon" as keyof typeof Ionicons.glyphMap,
    },
    {
      id: "snack",
      label: "Snack Nutritivo",
      description: "Saludable y delicioso",
      value: "Necesito ideas para un snack saludable y delicioso",
      mealType: "Snack",
      cookingTime: "10 minutos",
      icon: "nutrition" as keyof typeof Ionicons.glyphMap,
    },
  ];

  const handleQuickOption = (option: (typeof quickOptions)[0]) => {
    setSelectedQuickOption(option.id);
    setFormData((prev) => ({
      ...prev,
      userInput: option.value,
      mealType: option.mealType,
      cookingTime: option.cookingTime,
    }));
    if (errors.userInput) {
      setErrors((prev) => ({ ...prev, userInput: "" }));
    }
  };

  const handleUserInputChange = (text: string) => {
    setFormData((prev) => ({ ...prev, userInput: text }));
    setSelectedQuickOption("");
    if (errors.userInput && text.trim()) {
      setErrors((prev) => ({ ...prev, userInput: "" }));
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Opciones rápidas
          </ThemedText>
          <View style={styles.quickOptionsGrid}>
            {quickOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.quickOption,
                  selectedQuickOption === option.id &&
                    styles.quickOptionSelected,
                ]}
                onPress={() => handleQuickOption(option)}
              >
                <View style={styles.quickOptionHeader}>
                  <Ionicons
                    name={option.icon}
                    size={18}
                    color={
                      selectedQuickOption === option.id ? "white" : "#F97316"
                    }
                  />
                  {selectedQuickOption === option.id && (
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                  )}
                </View>
                <ThemedText
                  type="small"
                  style={[
                    styles.quickOptionText,
                    selectedQuickOption === option.id &&
                      styles.quickOptionTextSelected,
                  ]}
                >
                  {option.label}
                </ThemedText>
                <ThemedText
                  type="small"
                  style={[
                    styles.quickOptionDescription,
                    selectedQuickOption === option.id &&
                      styles.quickOptionDescriptionSelected,
                  ]}
                >
                  {option.description}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            ¿Qué tipo de receta necesitas? *
          </ThemedText>
          <ThemedInput
            variant="textarea"
            style={[errors.userInput && styles.inputError]}
            value={formData.userInput}
            onChangeText={handleUserInputChange}
            placeholder="Ej: Necesito una receta vegetariana para la cena que sea rápida y nutritiva..."
            multiline
            numberOfLines={4}
            hasError={!!errors.userInput}
          />
          {errors.userInput && (
            <ThemedText type="small" style={styles.errorText}>
              {errors.userInput}
            </ThemedText>
          )}
        </View>

        <View style={styles.optionalSection}>
          <ThemedText type="defaultSemiBold" style={styles.optionalTitle}>
            Información adicional (opcional)
          </ThemedText>

          <View style={styles.section}>
            <ThemedText type="small" style={styles.fieldLabel}>
              Tipo de comida
            </ThemedText>
            <ThemedInput
              value={formData.mealType}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, mealType: text }))
              }
              placeholder="Ej: Desayuno, Almuerzo, Cena, Snack..."
            />
          </View>

          <View style={styles.section}>
            <ThemedText type="small" style={styles.fieldLabel}>
              Ingredientes principales
            </ThemedText>
            <View style={styles.inputWithButton}>
              <ThemedInput
                style={styles.inputFlexible}
                value={ingredientInput}
                onChangeText={setIngredientInput}
                placeholder="Ej: Pollo, arroz, brócoli..."
                onSubmitEditing={addIngredient}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addIngredient}
              >
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {formData.mainIngredients &&
              formData.mainIngredients.length > 0 && (
                <View style={styles.tagsContainer}>
                  {formData.mainIngredients
                    .slice(0, 6)
                    .map((ingredient, index) => (
                      <View key={index} style={styles.tag}>
                        <ThemedText type="small" style={styles.tagText}>
                          {ingredient}
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => removeIngredient(index)}
                        >
                          <Ionicons name="close" size={14} color="#F97316" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  {formData.mainIngredients.length > 6 && (
                    <ThemedText type="small" style={styles.moreItemsText}>
                      +{formData.mainIngredients.length - 6} más
                    </ThemedText>
                  )}
                </View>
              )}
          </View>

          <View style={styles.section}>
            <ThemedText type="small" style={styles.fieldLabel}>
              Restricciones dietéticas
            </ThemedText>
            <View style={styles.inputWithButton}>
              <ThemedInput
                style={styles.inputFlexible}
                value={restrictionInput}
                onChangeText={setRestrictionInput}
                placeholder="Ej: Sin gluten, vegetariana, sin lactosa..."
                onSubmitEditing={addRestriction}
              />
              <TouchableOpacity
                style={styles.addButton}
                onPress={addRestriction}
              >
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </View>
            {formData.dietaryRestrictions &&
              formData.dietaryRestrictions.length > 0 && (
                <View style={styles.tagsContainer}>
                  {formData.dietaryRestrictions
                    .slice(0, 4)
                    .map((restriction, index) => (
                      <View key={index} style={styles.tag}>
                        <ThemedText type="small" style={styles.tagText}>
                          {restriction}
                        </ThemedText>
                        <TouchableOpacity
                          onPress={() => removeRestriction(index)}
                        >
                          <Ionicons name="close" size={14} color="#F97316" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  {formData.dietaryRestrictions.length > 4 && (
                    <ThemedText type="small" style={styles.moreItemsText}>
                      +{formData.dietaryRestrictions.length - 4} más
                    </ThemedText>
                  )}
                </View>
              )}
          </View>

          <View style={styles.fieldsRow}>
            <View style={styles.fieldHalf}>
              <ThemedText type="small" style={styles.fieldLabel}>
                Tipo de cocina
              </ThemedText>
              <ThemedInput
                value={formData.cuisineType}
                onChangeText={(text: string) =>
                  setFormData((prev) => ({ ...prev, cuisineType: text }))
                }
                placeholder="Ej: Italiana, Asiática..."
              />
            </View>

            <View style={styles.fieldHalf}>
              <ThemedText type="small" style={styles.fieldLabel}>
                Tiempo de cocción
              </ThemedText>
              <ThemedInput
                value={formData.cookingTime}
                onChangeText={(text: string) =>
                  setFormData((prev) => ({ ...prev, cookingTime: text }))
                }
                placeholder="Ej: 30 minutos..."
              />
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <LinearGradient
            colors={["#F97316", "#EA580C"]}
            style={styles.submitGradient}
          >
            {isLoading ? (
              <ThemedText type="defaultSemiBold" style={styles.submitText}>
                Generando receta...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="restaurant" size={20} color="white" />
                <ThemedText type="defaultSemiBold" style={styles.submitText}>
                  Generar Receta
                </ThemedText>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  fieldLabel: {
    marginBottom: 8,
  },
  input: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,

    minHeight: 50,
  },
  inputFlexible: {
    flex: 1,
  },
  textArea: {
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,

    minHeight: 100,
  },
  inputError: {
    borderColor: AiraColors.destructive,
  },
  errorText: {
    color: AiraColors.destructive,
    marginTop: 4,
  },
  quickOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickOption: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.05),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.2),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  quickOptionSelected: {
    backgroundColor: "#F97316",
    borderColor: "#EA580C",
  },
  quickOptionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  quickOptionText: {
    color: "#F97316",
    textAlign: "center",
  },
  quickOptionTextSelected: {
    color: "white",
  },
  quickOptionDescription: {
    color: AiraColors.mutedForeground,
    textAlign: "center",
  },
  quickOptionDescriptionSelected: {
    color: "rgba(255, 255, 255, 0.8)",
  },
  optionalSection: {
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.05),
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    marginBottom: 20,
  },
  optionalTitle: {

    marginBottom: 16,
    textAlign: "center",
  },
  inputWithButton: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-end",
  },
  addButton: {
    backgroundColor: "#F97316",
    borderRadius: AiraVariants.cardRadius,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  tag: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.2),
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tagText: {
    color: "#F97316",
  },
  moreItemsText: {
    color: AiraColors.mutedForeground,
    alignSelf: "center",
    paddingHorizontal: 8,
  },
  fieldsRow: {
    flexDirection: "row",
    gap: 12,
  },
  fieldHalf: {
    flex: 1,
  },
  submitButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginTop: 16,
  },
  submitGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitText: {
    color: "white",
  },
});
