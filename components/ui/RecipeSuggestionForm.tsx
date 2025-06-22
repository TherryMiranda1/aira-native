import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { SuggestRecipeInput } from "@/types/Assistant";

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
      Alert.alert(
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
        mainIngredients: [...(prev.mainIngredients || []), ingredientInput.trim()],
      }));
      setIngredientInput("");
    }
  };

  const removeIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      mainIngredients: prev.mainIngredients?.filter((_, i) => i !== index) || [],
    }));
  };

  const addRestriction = () => {
    if (restrictionInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [...(prev.dietaryRestrictions || []), restrictionInput.trim()],
      }));
      setRestrictionInput("");
    }
  };

  const removeRestriction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions?.filter((_, i) => i !== index) || [],
    }));
  };

  const quickOptions = [
    {
      label: "Desayuno Saludable",
      value: "Necesito una receta de desayuno nutritivo y energizante",
      mealType: "Desayuno",
      cookingTime: "15 minutos",
    },
    {
      label: "Almuerzo Rápido",
      value: "Quiero una receta de almuerzo rápida y equilibrada",
      mealType: "Almuerzo",
      cookingTime: "30 minutos",
    },
    {
      label: "Cena Ligera",
      value: "Busco una receta de cena ligera y saludable",
      mealType: "Cena",
      cookingTime: "45 minutos",
    },
    {
      label: "Snack Nutritivo",
      value: "Necesito ideas para un snack saludable y delicioso",
      mealType: "Snack",
      cookingTime: "10 minutos",
    },
  ];

  const handleQuickOption = (option: typeof quickOptions[0]) => {
    setFormData((prev) => ({
      ...prev,
      userInput: option.value,
      mealType: option.mealType,
      cookingTime: option.cookingTime,
    }));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            ¿Qué tipo de receta necesitas? *
          </ThemedText>
          <TextInput
            style={[styles.textArea, errors.userInput && styles.inputError]}
            value={formData.userInput}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, userInput: text }))
            }
            placeholder="Ej: Necesito una receta vegetariana para la cena que sea rápida y nutritiva..."
            placeholderTextColor={AiraColors.mutedForeground}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.userInput && (
            <ThemedText style={styles.errorText}>{errors.userInput}</ThemedText>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Opciones rápidas</ThemedText>
          <View style={styles.quickOptionsGrid}>
            {quickOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickOption}
                onPress={() => handleQuickOption(option)}
              >
                <ThemedText style={styles.quickOptionText}>
                  {option.label}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Tipo de comida (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.mealType}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, mealType: text }))
            }
            placeholder="Ej: Desayuno, Almuerzo, Cena, Snack..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Ingredientes principales (opcional)
          </ThemedText>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputFlexible]}
              value={ingredientInput}
              onChangeText={setIngredientInput}
              placeholder="Ej: Pollo, arroz, brócoli..."
              placeholderTextColor={AiraColors.mutedForeground}
              onSubmitEditing={addIngredient}
            />
            <TouchableOpacity style={styles.addButton} onPress={addIngredient}>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
          {formData.mainIngredients && formData.mainIngredients.length > 0 && (
            <View style={styles.tagsContainer}>
              {formData.mainIngredients.map((ingredient, index) => (
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{ingredient}</ThemedText>
                  <TouchableOpacity onPress={() => removeIngredient(index)}>
                    <Ionicons name="close" size={16} color="#F97316" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Restricciones dietéticas (opcional)
          </ThemedText>
          <View style={styles.inputWithButton}>
            <TextInput
              style={[styles.input, styles.inputFlexible]}
              value={restrictionInput}
              onChangeText={setRestrictionInput}
              placeholder="Ej: Sin gluten, vegetariana, sin lactosa..."
              placeholderTextColor={AiraColors.mutedForeground}
              onSubmitEditing={addRestriction}
            />
            <TouchableOpacity style={styles.addButton} onPress={addRestriction}>
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
          {formData.dietaryRestrictions && formData.dietaryRestrictions.length > 0 && (
            <View style={styles.tagsContainer}>
              {formData.dietaryRestrictions.map((restriction, index) => (
                <View key={index} style={styles.tag}>
                  <ThemedText style={styles.tagText}>{restriction}</ThemedText>
                  <TouchableOpacity onPress={() => removeRestriction(index)}>
                    <Ionicons name="close" size={16} color="#F97316" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Tipo de cocina (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.cuisineType}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, cuisineType: text }))
            }
            placeholder="Ej: Italiana, Mexicana, Asiática, Mediterránea..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>
            Tiempo de cocción (opcional)
          </ThemedText>
          <TextInput
            style={styles.input}
            value={formData.cookingTime}
            onChangeText={(text) =>
              setFormData((prev) => ({ ...prev, cookingTime: text }))
            }
            placeholder="Ej: 15 minutos, 30 minutos, 1 hora..."
            placeholderTextColor={AiraColors.mutedForeground}
          />
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
              <ThemedText style={styles.submitText}>
                Generando receta...
              </ThemedText>
            ) : (
              <>
                <Ionicons name="restaurant" size={20} color="white" />
                <ThemedText style={styles.submitText}>
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
    backgroundColor: AiraColors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AiraColors.foreground,
    marginBottom: 12,
  },
  input: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 50,
  },
  inputFlexible: {
    flex: 1,
  },
  textArea: {
    backgroundColor: AiraColors.card,
    borderWidth: 1,
    borderColor: AiraColors.border,
    borderRadius: AiraVariants.cardRadius,
    padding: 16,
    fontSize: 16,
    color: AiraColors.foreground,
    minHeight: 100,
  },
  inputError: {
    borderColor: AiraColors.destructive,
  },
  errorText: {
    fontSize: 12,
    color: AiraColors.destructive,
    marginTop: 4,
  },
  quickOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  quickOption: {
    backgroundColor: AiraColorsWithAlpha.accentWithOpacity(0.1),
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.accentWithOpacity(0.2),
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickOptionText: {
    fontSize: 14,
    color: "#F97316",
    fontWeight: "500",
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
    fontSize: 12,
    color: "#F97316",
    fontWeight: "500",
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
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
}); 