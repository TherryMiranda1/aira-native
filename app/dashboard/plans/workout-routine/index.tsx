import React, { useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { FullExerciseRoutineForm } from "@/components/ui/FullExerciseRoutineForm";
import { GeneratedFullExerciseRoutineSection } from "@/components/ui/GeneratedFullExerciseRoutineSection";
import { ExistingWorkoutRoutinesSection } from "@/components/ui/ExistingWorkoutRoutinesSection";
import { PlanHeader } from "@/components/ui/PlanHeader";
import { PlanLoadingView } from "@/components/ui/PlanLoadingView";
import { PlanErrorView } from "@/components/ui/PlanErrorView";
import { PlanOptionCard } from "@/components/ui/PlanOptionCard";
import { PlanWelcomeSection } from "@/components/ui/PlanWelcomeSection";
import { useDailyWorkoutRoutines } from "@/hooks/services/useDailyWorkoutRoutines";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import {
  FullExerciseRoutineInput,
  FullExerciseRoutineOutput,
} from "@/types/Assistant";
import { PageView } from "@/components/ui/PageView";

type ViewState = "main" | "form" | "generated" | "loading" | "error";

export default function WorkoutRoutineScreen() {
  const { user } = useUser();
  const {
    routines,
    createRoutine: createWorkoutRoutine,
    deleteRoutine,
    loading: isSavingWorkoutRoutine,
  } = useDailyWorkoutRoutines();
  const { generateFullExerciseRoutine } = usePersonalizedPlan();

  const [viewState, setViewState] = useState<ViewState>("main");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [generatedWorkoutRoutine, setGeneratedWorkoutRoutine] =
    useState<FullExerciseRoutineOutput | null>(null);
  const [workoutRoutineInputParams, setWorkoutRoutineInputParams] =
    useState<FullExerciseRoutineInput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQuickGenerate = async () => {
    if (!user) {
      Alert.alert(
        "Error",
        "Debes iniciar sesión para generar una rutina de ejercicio"
      );
      return;
    }

    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const defaultInput: FullExerciseRoutineInput = {
        userInput: "Necesito una rutina de ejercicios completa y equilibrada",
        fitnessLevel: "Intermedio",
        availableEquipment: "Acceso básico al gimnasio",
        timePerSession: "45 minutos",
        daysPerWeek: "3-4 días",
      };

      const routine = await generateFullExerciseRoutine(defaultInput);
      setGeneratedWorkoutRoutine(routine);
      setWorkoutRoutineInputParams(defaultInput);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando rutina rápida:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomGenerate = () => {
    setViewState("form");
  };

  const handleFormSubmit = async (formData: FullExerciseRoutineInput) => {
    setIsGenerating(true);
    setViewState("loading");
    setError(null);

    try {
      const routine = await generateFullExerciseRoutine(formData);
      setGeneratedWorkoutRoutine(routine);
      setWorkoutRoutineInputParams(formData);
      setViewState("generated");
    } catch (error) {
      console.error("Error generando rutina de ejercicio:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
      setViewState("error");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveWorkoutRoutine = async () => {
    if (!generatedWorkoutRoutine || !workoutRoutineInputParams) return;

    try {
      await createWorkoutRoutine({
        routineData: generatedWorkoutRoutine,
        inputParameters: workoutRoutineInputParams,
        tags: ["rutina-ejercicio", "entrenamiento"],
      });

      Alert.alert(
        "Rutina de Ejercicio Guardada",
        "Tu rutina se ha guardado exitosamente en tu biblioteca",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error guardando rutina de ejercicio:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar la rutina de ejercicio. Inténtalo de nuevo.",
        [{ text: "OK" }]
      );
      throw error;
    }
  };

  const handleRegenerate = async () => {
    if (!workoutRoutineInputParams) return;

    setIsRegenerating(true);
    setError(null);

    try {
      const routine = await generateFullExerciseRoutine(
        workoutRoutineInputParams
      );
      setGeneratedWorkoutRoutine(routine);
    } catch (error) {
      console.error("Error regenerando rutina de ejercicio:", error);
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
      setGeneratedWorkoutRoutine(null);
      setWorkoutRoutineInputParams(null);
    } else if (viewState === "error") {
      setViewState("main");
      setError(null);
    } else {
      router.back();
    }
  };

  const handleRetry = () => {
    if (workoutRoutineInputParams) {
      handleFormSubmit(workoutRoutineInputParams);
    } else {
      handleQuickGenerate();
    }
  };

  const handleDeleteRoutine = async (routineId: string) => {
    try {
      await deleteRoutine(routineId);
    } catch (error) {
      console.error("Error eliminando rutina:", error);
      Alert.alert("Error", "No se pudo eliminar la rutina.", [{ text: "OK" }]);
    }
  };

  const getHeaderConfig = () => {
    switch (viewState) {
      case "form":
        return {
          title: "Configurar Rutina",
          subtitle: "Personaliza tu entrenamiento",
          showBack: true,
        };
      case "generated":
        return {
          title: "Tu Rutina de Ejercicio",
          subtitle: "Generado por Aira",
          showBack: true,
        };
      case "loading":
        return {
          title: "Generando Rutina",
          subtitle: "Aira está creando tu rutina personalizada...",
          showBack: false,
        };
      case "error":
        return {
          title: "Error",
          subtitle: "Hubo un problema generando tu rutina",
          showBack: true,
        };
      default:
        return {
          title: "Rutinas de Ejercicio",
          subtitle: "Entrena con rutinas diseñadas para ti",
          showBack: true,
        };
    }
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      <PlanWelcomeSection
        title="¡Vamos a crear tu rutina perfecta! 💪"
        description="Aira te ayudará a diseñar una rutina de ejercicio personalizada, adaptada a tu nivel, objetivos y tiempo disponible."
        iconName="fitness"
        iconColor="#3B82F6"
      />

      <View style={styles.optionsContainer}>
        <PlanOptionCard
          title="Generación Rápida"
          description="Rutina equilibrada y completa automática"
          iconName="flash"
          onPress={handleQuickGenerate}
          variant="gradient"
          gradientColors={["#3B82F6", "#1D4ED8"]}
          disabled={isGenerating}
        />

        <PlanOptionCard
          title="Personalización Completa"
          description="Configura nivel, equipamiento y objetivos"
          iconName="create"
          onPress={handleCustomGenerate}
          variant="outline"
          gradientColors={["#3B82F6", "#1D4ED8"]}
          disabled={isGenerating}
        />
      </View>

      {!user && (
        <View style={styles.authWarning}>
          <Ionicons name="warning" size={20} color={AiraColors.destructive} />
          <ThemedText style={styles.authWarningText}>
            Debes iniciar sesión para generar rutinas de ejercicio
          </ThemedText>
        </View>
      )}

      {routines?.length > 0 && (
        <ExistingWorkoutRoutinesSection
          routines={routines}
          onRoutineDelete={handleDeleteRoutine}
        />
      )}
    </View>
  );

  const renderLoadingView = () => (
    <PlanLoadingView
      title="Generando tu rutina de ejercicio"
      subtitle="Aira está diseñando una rutina de entrenamiento perfecta especialmente para ti..."
      useGradient
      gradientColors={["#3B82F6", "#1D4ED8"]}
      indicatorColor="white"
    />
  );

  const renderErrorView = () => (
    <PlanErrorView
      title="Error al generar la rutina"
      message={error || "Ocurrió un error inesperado"}
      onRetry={handleRetry}
      retryText="Intentar de nuevo"
      iconName="alert-circle"
      useGradientButton
      gradientColors={["#3B82F6", "#1D4ED8"]}
    />
  );

  const renderContent = () => {
    switch (viewState) {
      case "form":
        return (
          <FullExerciseRoutineForm
            onSubmit={handleFormSubmit}
            isLoading={isGenerating}
            initialData={workoutRoutineInputParams || undefined}
          />
        );
      case "generated":
        return generatedWorkoutRoutine && workoutRoutineInputParams ? (
          <GeneratedFullExerciseRoutineSection
            routine={generatedWorkoutRoutine}
            inputParams={workoutRoutineInputParams}
            onSave={handleSaveWorkoutRoutine}
            onRegenerate={handleRegenerate}
            onEditParams={handleEditParams}
            isSaving={isSavingWorkoutRoutine}
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
          gradientColors={["#3B82F6", "#1D4ED8"]}
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
  },
  authWarningText: {
    fontSize: 14,
    color: AiraColors.destructive,
    flex: 1,
  },
});
