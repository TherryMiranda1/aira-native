import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { DailyMealPlanOutput, DailyMealPlanInput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentText, ContentList } from "./ContentCard";
import { SaveButton } from "../SaveButton";
import { useDailyMealPlans } from "@/hooks/services/useDailyMealPlans";

interface MealPlanCardProps {
  mealPlan: DailyMealPlanOutput;
  inputParams?: DailyMealPlanInput;
}

const mealIcons: Record<string, string> = {
  "Desayuno": "🌅",
  "Almuerzo": "☀️",
  "Cena": "🌙",
  "Snack": "🍎",
  "Merienda": "🥨",
  "default": "🍽️"
};

export function MealPlanCard({ mealPlan, inputParams }: MealPlanCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { createPlan } = useDailyMealPlans();

  const handleSave = async () => {
    if (!inputParams) {
      Alert.alert("Error", "No se pueden guardar los parámetros del plan");
      return;
    }

    setIsSaving(true);
    try {
      await createPlan({
        planTitle: mealPlan.planTitle,
        planData: mealPlan,
        inputParameters: inputParams,
        tags: ["plan-diario", "comidas", "chat"],
      });

      Alert.alert(
        "Plan de Comidas Guardado",
        "Tu plan de comidas se ha guardado exitosamente en tu biblioteca",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error guardando plan de comidas:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar el plan de comidas. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  const saveButton = inputParams ? (
    <SaveButton
      onSave={handleSave}
      isSaving={isSaving}
      label="Guardar plan en mi biblioteca"
    />
  ) : null;

  const totalMeals = mealPlan.meals?.length || 0;

  return (
    <ContentCard
      title={mealPlan.planTitle || "Plan de Comidas"}
      subtitle="Plan nutricional personalizado"
      description={mealPlan.introduction}
      icon="🥗"
      variant="success"
      footer={saveButton}
    >
      {/* Resumen del plan */}
      {totalMeals > 0 && (
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <ThemedText type="small" style={styles.summaryLabel}>
              📊 Resumen del plan
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
              {totalMeals} comida{totalMeals > 1 ? "s" : ""} planificada{totalMeals > 1 ? "s" : ""}
            </ThemedText>
          </View>
        </View>
      )}

      {mealPlan.meals?.map((meal, index) => {
        const mealIcon = mealIcons[meal.mealType] || mealIcons.default;
        
        return (
          <ContentSection 
            key={index} 
            title={meal.mealType || `Comida ${index + 1}`}
            icon={mealIcon}
          >
            {meal.options && meal.options.length > 0 ? (
              <>
                <ContentList 
                  items={meal.options.slice(0, 3)}
                  type="bullet"
                />
                {meal.options.length > 3 && (
                  <ContentText variant="highlight">
                    + {meal.options.length - 3} opciones más
                  </ContentText>
                )}
              </>
            ) : (
              <ContentText>No hay opciones definidas para esta comida</ContentText>
            )}
          </ContentSection>
        );
      })}
      
      {mealPlan.generalTips && (
        <ContentSection title="Consejos nutricionales" icon="💡">
          <ContentText variant="highlight">
            {mealPlan.generalTips}
          </ContentText>
        </ContentSection>
      )}

      {(!mealPlan.meals || mealPlan.meals.length === 0) && (
        <ContentSection title="Información" icon="ℹ️">
          <ContentText variant="highlight">
            Este plan no tiene comidas definidas aún.
          </ContentText>
        </ContentSection>
      )}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: AiraColors.card,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AiraColors.border,
    alignItems: "center",
  },
  summaryLabel: {
    color: AiraColors.mutedForeground,
    marginBottom: 4,
  },
  summaryValue: {
    color: AiraColors.primary,
  },
}); 