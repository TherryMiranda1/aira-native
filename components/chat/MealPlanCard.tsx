import React, { useState } from "react";
import { Alert } from "react-native";
import { DailyMealPlanOutput, DailyMealPlanInput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentText } from "./ContentCard";
import { SaveButton } from "./SaveButton";
import { useDailyMealPlans } from "@/hooks/services/useDailyMealPlans";

interface MealPlanCardProps {
  mealPlan: DailyMealPlanOutput;
  inputParams?: DailyMealPlanInput;
}

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

  return (
    <ContentCard
      title={`🥗 ${mealPlan.planTitle}`}
      description={mealPlan.introduction}
      footer={saveButton}
    >
      {mealPlan.meals?.map((meal, index) => (
        <ContentSection key={index} title={meal.mealType}>
          {meal.options
            ?.slice(0, 2)
            .map((option, optIndex) => (
              <ContentText key={optIndex}>
                • {option}
              </ContentText>
            ))}
        </ContentSection>
      ))}
      
      {mealPlan.generalTips && (
        <ContentSection title="Consejos:">
          <ContentText>{mealPlan.generalTips}</ContentText>
        </ContentSection>
      )}
    </ContentCard>
  );
} 