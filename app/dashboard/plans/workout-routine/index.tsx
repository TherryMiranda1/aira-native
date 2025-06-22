import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";
import { router } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";
import { FullExerciseRoutineForm } from "@/components/ui/FullExerciseRoutineForm";
import { GeneratedFullExerciseRoutineSection } from "@/components/ui/GeneratedFullExerciseRoutineSection";
import { ExistingWorkoutRoutinesSection } from "@/components/ui/ExistingWorkoutRoutinesSection";
import { useDailyWorkoutRoutines } from "@/hooks/services/useDailyWorkoutRoutines";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import {
  FullExerciseRoutineInput,
  FullExerciseRoutineOutput,
} from "@/types/Assistant";

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

  const renderHeader = () => {
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

    const config = getHeaderConfig();

    return (
      <LinearGradient colors={["#3B82F6", "#1D4ED8"]} style={styles.header}>
        <SafeAreaView edges={["top"]} style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.headerTextContainer}>
              <ThemedText style={styles.headerTitle}>{config.title}</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                {config.subtitle}
              </ThemedText>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  };

  const renderMainView = () => (
    <View style={styles.mainContainer}>
      <View style={styles.welcomeSection}>
        <View style={styles.iconContainer}>
          <Ionicons name="fitness" size={48} color="#3B82F6" />
        </View>
        <ThemedText style={styles.welcomeTitle}>
          ¡Vamos a crear tu rutina perfecta! 💪
        </ThemedText>
        <ThemedText style={styles.welcomeDescription}>
          Aira te ayudará a diseñar una rutina de ejercicio personalizada,
          adaptada a tu nivel, objetivos y tiempo disponible.
        </ThemedText>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleQuickGenerate}
          disabled={isGenerating}
        >
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            style={styles.optionGradient}
          >
            <Ionicons name="flash" size={32} color="white" />
            <ThemedText style={styles.optionTitle}>
              Generación Rápida
            </ThemedText>
            <ThemedText style={styles.optionDescription}>
              Rutina equilibrada y completa automática
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionCard}
          onPress={handleCustomGenerate}
          disabled={isGenerating}
        >
          <View style={styles.optionOutline}>
            <Ionicons name="create" size={32} color="#3B82F6" />
            <ThemedText style={styles.optionTitleOutline}>
              Personalización Completa
            </ThemedText>
            <ThemedText style={styles.optionDescriptionOutline}>
              Configura nivel, equipamiento y objetivos
            </ThemedText>
          </View>
        </TouchableOpacity>
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
    <View style={styles.loadingContainer}>
      <LinearGradient
        colors={["#3B82F6", "#1D4ED8"]}
        style={styles.loadingGradient}
      >
        <ActivityIndicator size="large" color="white" />
        <ThemedText style={styles.loadingTitle}>
          Generando tu rutina de ejercicio
        </ThemedText>
        <ThemedText style={styles.loadingSubtitle}>
          Aira está diseñando una rutina de entrenamiento perfecta especialmente
          para ti...
        </ThemedText>
      </LinearGradient>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.errorContainer}>
      <View style={styles.errorCard}>
        <Ionicons
          name="alert-circle"
          size={48}
          color={AiraColors.destructive}
        />
        <ThemedText style={styles.errorTitle}>
          Error al generar la rutina
        </ThemedText>
        <ThemedText style={styles.errorMessage}>
          {error || "Ocurrió un error inesperado"}
        </ThemedText>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <LinearGradient
            colors={["#3B82F6", "#1D4ED8"]}
            style={styles.retryButtonGradient}
          >
            <Ionicons name="refresh" size={20} color="white" />
            <ThemedText style={styles.retryButtonText}>
              Intentar de nuevo
            </ThemedText>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
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

  return (
    <ScrollView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  header: {
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  mainContainer: {
    flex: 1,
    padding: 20,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingVertical: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: AiraColorsWithAlpha.primaryWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: AiraColors.foreground,
    textAlign: "center",
    marginBottom: 12,
  },
  welcomeDescription: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  optionCard: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
  },
  optionGradient: {
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  optionOutline: {
    padding: 24,
    alignItems: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#3B82F6",
    borderRadius: AiraVariants.cardRadius,
    backgroundColor: AiraColors.background,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  optionTitleOutline: {
    fontSize: 18,
    fontWeight: "600",
    color: "#3B82F6",
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  optionDescriptionOutline: {
    fontSize: 14,
    color: AiraColors.mutedForeground,
    textAlign: "center",
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
  loadingContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  loadingGradient: {
    padding: 40,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 16,
  },
  loadingTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
  },
  loadingSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 22,
  },
  errorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  errorCard: {
    backgroundColor: AiraColors.card,
    padding: 32,
    borderRadius: AiraVariants.cardRadius,
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: AiraColors.mutedForeground,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
    borderRadius: AiraVariants.cardRadius,
    overflow: "hidden",
    marginTop: 8,
  },
  retryButtonGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});
