import React, { useState } from "react";
import { ScrollView } from "react-native";
import { router } from "expo-router";

import { AiraColors } from "@/constants/Colors";
import { ExerciseSuggestionForm } from "@/components/ui/ExerciseSuggestionForm";
import { GeneratedExerciseSection } from "@/components/ui/GeneratedExerciseSection";
import { Topbar } from "@/components/ui/Topbar";
import { PlanLoadingView } from "@/components/ui/PlanLoadingView";
import { PlanErrorView } from "@/components/ui/PlanErrorView";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import { ExerciseSuggestionInput } from "@/types/Assistant";
import { PageView } from "@/components/ui/PageView";
import { useToastHelpers } from "@/components/ui/ToastSystem";

type ViewState = "form" | "generated" | "loading" | "error";

export default function ExerciseSuggestionScreen() {
  const { generateExerciseSuggestion } = usePersonalizedPlan();
  const { showErrorToast } = useToastHelpers();

  const [viewState, setViewState] = useState<ViewState>("form");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedExercise, setGeneratedExercise] = useState<any>(null);
  const [exerciseInputParams, setExerciseInputParams] =
    useState<ExerciseSuggestionInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (formData: ExerciseSuggestionInput) => {
    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const exercise = await generateExerciseSuggestion(formData);
      setGeneratedExercise(exercise);
      setExerciseInputParams(formData);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando sugerencia de ejercicio:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!exerciseInputParams) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const exercise = await generateExerciseSuggestion(exerciseInputParams);
      setGeneratedExercise(exercise);
    } catch (error) {
      console.error("Error regenerando ejercicio:", error);
      showErrorToast(
        "Error",
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleEditParams = () => {
    setViewState("form");
  };

  const handleGoBack = () => {
    if (viewState === "generated") {
      setViewState("form");
    } else {
      router.back();
    }
  };

  const handleRetry = () => {
    setViewState("form");
    setError(null);
  };

  const getHeaderConfig = () => {
    switch (viewState) {
      case "form":
        return {
          title: "Sugerencia de ejercicio",
          showBack: true,
        };
      case "generated":
        return {
          title: "Ejercicio generado",
          showBack: true,
        };
      case "loading":
        return {
          title: "Generando ejercicio...",
          showBack: false,
        };
      case "error":
        return {
          title: "Error",
          showBack: true,
        };
      default:
        return {
          title: "Sugerencia de ejercicio",
          showBack: true,
        };
    }
  };

  const renderLoadingView = () => (
    <PlanLoadingView
      title="Aira está generando tu ejercicio personalizado..."
      subtitle="Esto puede tomar unos segundos"
      indicatorColor={AiraColors.primary}
    />
  );

  const renderErrorView = () => (
    <PlanErrorView
      title="Error al generar ejercicio"
      message={error || "Ha ocurrido un error inesperado"}
      onRetry={handleRetry}
      useGradientButton={false}
    />
  );

  const renderContent = () => {
    switch (viewState) {
      case "form":
        return (
          <ExerciseSuggestionForm
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
          />
        );
      case "generated":
        return (
          <GeneratedExerciseSection
            exercise={generatedExercise}
            inputParams={exerciseInputParams!}
            onRegenerate={handleRegenerate}
            onEditParams={handleEditParams}
            isRegenerating={isRegenerating}
          />
        );
      case "loading":
        return renderLoadingView();
      case "error":
        return renderErrorView();
      default:
        return null;
    }
  };

  const headerConfig = getHeaderConfig();

  return (
    <PageView>
      <Topbar
        title={headerConfig.title}
        showBackButton={headerConfig.showBack}
        onBack={handleGoBack}
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {renderContent()}
      </ScrollView>
    </PageView>
  );
}
