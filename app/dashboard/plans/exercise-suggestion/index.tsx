import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import { ExerciseSuggestionForm } from "@/components/ui/ExerciseSuggestionForm";
import { GeneratedExerciseSection } from "@/components/ui/GeneratedExerciseSection";
import { usePersonalizedPlan } from "@/hooks/usePersonalizedPlan";
import { ExerciseSuggestionInput } from "@/types/Assistant";

type ViewState = "form" | "generated" | "loading" | "error";

export default function ExerciseSuggestionScreen() {
  const { generateExerciseSuggestion } = usePersonalizedPlan();

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
      Alert.alert(
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

  const renderHeader = () => {
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

    const config = getHeaderConfig();

    return (
      <View style={styles.header}>
        {config.showBack && (
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            disabled={isGenerating}
          >
            <Ionicons name="arrow-back" size={24} color={AiraColors.primary} />
          </TouchableOpacity>
        )}
        <ThemedText style={styles.headerTitle}>{config.title}</ThemedText>
      </View>
    );
  };

  const renderLoadingView = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={AiraColors.primary} />
      <ThemedText style={styles.loadingText}>
        Aira está generando tu ejercicio personalizado...
      </ThemedText>
      <ThemedText style={styles.loadingSubtext}>
        Esto puede tomar unos segundos
      </ThemedText>
    </View>
  );

  const renderErrorView = () => (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle" size={48} color={AiraColors.primary} />
      <ThemedText style={styles.errorTitle}>
        Error al generar ejercicio
      </ThemedText>
      <ThemedText style={styles.errorMessage}>
        {error || "Ha ocurrido un error inesperado"}
      </ThemedText>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <ThemedText style={styles.retryButtonText}>
          Intentar de nuevo
        </ThemedText>
      </TouchableOpacity>
    </View>
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

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AiraColors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AiraColors.foreground,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "500",
    color: AiraColors.foreground,
    textAlign: "center",
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: AiraColors.foreground,
    textAlign: "center",
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: AiraColors.foreground,
    textAlign: "center",
    marginTop: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: AiraColors.foreground,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: AiraColors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    fontSize: 16,
  },
});
