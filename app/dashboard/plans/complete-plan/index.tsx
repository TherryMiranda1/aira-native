import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { PlanConfigForm } from "@/components/ui/PlanConfigForm";
import { GeneratedPlanSection } from "@/components/ui/GeneratedPlanSection";
import { ExistingPlansSection } from "@/components/ui/ExistingPlansSection";
import { PlanHeader } from "@/components/ui/PlanHeader";
import { PlanLoadingView } from "@/components/ui/PlanLoadingView";
import { PlanErrorView } from "@/components/ui/PlanErrorView";
import { PlanOptionCard } from "@/components/ui/PlanOptionCard";
import { PlanWelcomeSection } from "@/components/ui/PlanWelcomeSection";
import { useGeneratedPlans } from "@/hooks/services/useGeneratedPlans";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import {
  PersonalizedPlanInput,
  PersonalizedPlanOutput,
} from "@/types/Assistant";
import { PageView } from "@/components/ui/PageView";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function PlansScreen() {
  const { user } = useUser();
  const { plans, createPlan, loading: isSavingPlan } = useGeneratedPlans();
  const { generatePersonalizedPlan } = usePersonalizedPlan();

  const [viewState, setViewState] = useState<ViewState>("main");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] =
    useState<PersonalizedPlanOutput | null>(null);
  const [planInputParams, setPlanInputParams] =
    useState<PersonalizedPlanInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickGenerate = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para generar un plan");
      return;
    }

    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const defaultInput: PersonalizedPlanInput = {
        fullName: user.firstName || "Usuaria",
        age: 30,
        sexo: "Femenino",
        altura: 165,
        peso: 65,
        objetivo: "Mejora de la salud general",
        plazo: "3 meses",
        nivel_entrenamiento: "Principiante",
        sesiones_semana: "3-4 días a la semana",
        minutos_por_sesion: "30-45 minutos",
        horario_entrenamiento: "Flexible",
        presupuesto_semana: "Moderado",
        cookingAvailability: "Moderado",
        personalPriorities: "Bienestar general",
        nutritionKnowledge: "Nivel general",
      };

      const plan = await generatePersonalizedPlan(defaultInput);
      setGeneratedPlan(plan);
      setPlanInputParams(defaultInput);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando plan rápido:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = () => {
    setViewState("form");
  };

  const handleDailyMealPlanGenerate = () => {
    router.push("/dashboard/plans/daily-meal-plan");
  };

  const handleWorkoutRoutineGenerate = () => {
    router.push("/dashboard/plans/workout-routine");
  };

  const handleExerciseSuggestionGenerate = () => {
    router.push("/dashboard/plans/exercise-suggestion");
  };

  const handleFormSubmit = async (formData: PersonalizedPlanInput) => {
    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const plan = await generatePersonalizedPlan(formData);
      setGeneratedPlan(plan);
      setPlanInputParams(formData);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando plan personalizado:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!generatedPlan || !planInputParams) return;

    try {
      await createPlan({
        title: `Plan personalizado - ${planInputParams.objetivo}`,
        planType: "comprehensive",
        planData: generatedPlan,
        inputParameters: planInputParams,
        isFromCompleteProfile: false,
        tags: ["personalizado"],
      });

      Alert.alert(
        "Plan Guardado",
        "Tu plan se ha guardado exitosamente en tu biblioteca",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error guardando plan:", error);
      Alert.alert("Error", "No se pudo guardar el plan. Inténtalo de nuevo.", [
        { text: "OK" },
      ]);
      throw error;
    }
  };

  const handleRegenerate = async () => {
    if (!planInputParams) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const plan = await generatePersonalizedPlan(planInputParams);
      setGeneratedPlan(plan);
    } catch (error) {
      console.error("Error regenerando plan:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleEditParams = () => {
    setViewState("form");
  };

  const handleGoBack = () => {
    if (viewState === "form") {
      setViewState("main");
    } else if (viewState === "generated") {
      setViewState("main");
      setGeneratedPlan(null);
      setPlanInputParams(null);
    } else if (viewState === "error") {
      setViewState("main");
      setError(null);
    }
  };

  const handleRetry = () => {
    if (planInputParams) {
      handleFormSubmit(planInputParams);
    } else {
      handleQuickGenerate();
    }
  };

  const getHeaderConfig = () => {
    switch (viewState) {
      case "form":
        return {
          title: "Personalizar Plan",
          subtitle: "Completa tu información",
          showBack: true,
        };
      case "generated":
        return {
          title: "Tu Plan Personalizado",
          subtitle: "Generado por Aira",
          showBack: true,
        };
      case "loading":
        return {
          title: "Generando Plan",
          subtitle: "Aira está creando tu plan personalizado...",
          showBack: false,
        };
      case "error":
        return {
          title: "Error",
          subtitle: "Hubo un problema generando tu plan",
          showBack: true,
        };
      default:
        return {
          title: "Plan Completo Personalizado",
          subtitle: "Genera tu plan de bienestar integral",
          showBack: false,
        };
    }
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      <PlanWelcomeSection
        title="¡Crea tu plan de bienestar ideal! ✨"
        description="Aira te ayudará a generar planes personalizados adaptados a tus objetivos y estilo de vida."
        iconName="star"
        iconColor={AiraColors.primary}
      />

      <View style={styles.optionsContainer}>
        <PlanOptionCard
          title="Plan Completo Rápido"
          description="Plan integral basado en tu perfil"
          iconName="flash"
          onPress={handleQuickGenerate}
          variant="gradient"
          gradientColors={[AiraColors.primary, AiraColors.accent]}
          disabled={isGenerating}
        />

        <PlanOptionCard
          title="Plan Completo Personalizado"
          description="Configura todos los detalles de tu plan"
          iconName="create"
          onPress={handleCustomGenerate}
          variant="outline"
          gradientColors={[AiraColors.primary, AiraColors.accent]}
          disabled={isGenerating}
        />

        <PlanOptionCard
          title="Plan de Comidas Diarias"
          description="Genera un menú completo para el día"
          iconName="restaurant"
          onPress={handleDailyMealPlanGenerate}
          variant="outline"
          gradientColors={[AiraColors.accent, AiraColors.primary]}
          disabled={isGenerating}
        />

        <PlanOptionCard
          title="Rutina de Ejercicio"
          description="Crea tu rutina de entrenamiento personalizada"
          iconName="fitness"
          onPress={handleWorkoutRoutineGenerate}
          variant="outline"
          gradientColors={["#3B82F6", "#1D4ED8"]}
          disabled={isGenerating}
        />

        <PlanOptionCard
          title="Sugerencias de Ejercicio"
          description="Obtén sugerencias de ejercicio personalizadas"
          iconName="bulb"
          onPress={handleExerciseSuggestionGenerate}
          variant="outline"
          gradientColors={["#3B82F6", "#1D4ED8"]}
          disabled={isGenerating}
        />
      </View>

      {!user && (
        <View style={styles.authWarning}>
          <Ionicons name="warning" size={20} color={AiraColors.destructive} />
          <ThemedText style={styles.authWarningText}>
            Debes iniciar sesión para generar planes personalizados
          </ThemedText>
        </View>
      )}

      {plans?.length > 0 && <ExistingPlansSection plans={plans} />}
    </View>
  );

  const renderLoadingView = () => (
    <PlanLoadingView
      title="Generando tu plan personalizado"
      subtitle="Aira está analizando tu información y creando el plan perfecto para ti..."
      useGradient
      gradientColors={[AiraColors.primary, AiraColors.accent]}
      indicatorColor="white"
    />
  );

  const renderErrorView = () => (
    <PlanErrorView
      title="Error al generar el plan"
      message={error || "Ocurrió un error inesperado"}
      onRetry={handleRetry}
      retryText="Intentar de nuevo"
      iconName="alert-circle"
      useGradientButton
      gradientColors={[AiraColors.primary, AiraColors.accent]}
    />
  );

  const renderContent = () => {
    switch (viewState) {
      case "form":
        return (
          <PlanConfigForm
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
            initialData={planInputParams || undefined}
          />
        );
      case "generated":
        return generatedPlan && planInputParams ? (
          <GeneratedPlanSection
            plan={generatedPlan}
            inputParams={planInputParams}
            onSave={handleSavePlan}
            onRegenerate={handleRegenerate}
            onEditParams={handleEditParams}
            isSaving={isSavingPlan}
            isRegenerating={isRegenerating}
          />
        ) : null;
      case "loading":
        return renderLoadingView();
      case "error":
        return renderErrorView();
      default:
        return renderMainView();
    }
  };

  const config = getHeaderConfig();

  return (
    <PageView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <PlanHeader
          title={config.title}
          subtitle={config.subtitle}
          onBack={handleGoBack}
          showBack={config.showBack}
          gradientColors={[AiraColors.primary, AiraColors.accent]}
          disabled={isGenerating}
        />
        {renderContent()}
      </ScrollView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },

  mainContainer: {
    flex: 1,
    padding: 20,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },

  authWarning: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 16,
    backgroundColor: AiraColorsWithAlpha.destructiveWithOpacity(0.1),
    borderRadius: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.destructiveWithOpacity(0.2),
    marginBottom: 24,
  },
  authWarningText: {
    fontSize: 14,
    color: AiraColors.destructive,
    flex: 1,
  },
});
