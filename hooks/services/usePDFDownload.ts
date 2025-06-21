"use client";

import { useState, useCallback } from "react";
import { useToast, ToastVariant } from "@/hooks/use-toast";
import { pdfService } from "@/services/pdfService";
import type {
  SuggestRecipeOutput,
  ExerciseSuggestionOutput,
} from "@/types/Assistant";

interface UsePDFDownloadReturn {
  isDownloading: boolean;
  downloadRecipePDF: (recipe: SuggestRecipeOutput) => Promise<void>;
  downloadExercisePDF: (exercise: ExerciseSuggestionOutput) => Promise<void>;
  shareContent: (
    content: SuggestRecipeOutput | ExerciseSuggestionOutput,
    type: "recipe" | "exercise"
  ) => Promise<void>;
}

export function usePDFDownload(): UsePDFDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const { toast } = useToast();

  const downloadRecipePDF = useCallback(
    async (recipe: SuggestRecipeOutput) => {
      if (
        !recipe.recipeName?.trim() ||
        !recipe.ingredients?.trim() ||
        !recipe.instructions?.trim()
      ) {
        toast({
          title: "No se puede generar PDF",
          description: "La receta debe estar completa para poder descargarla.",
          variant: "error",
        });
        return;
      }

      setIsDownloading(true);

      try {
        const result = await pdfService.downloadRecipePDF(recipe);

        if (result.success) {
          toast({
            title: "¡PDF descargado! 📄✨",
            description: `Tu receta "${recipe.recipeName}" se ha descargado exitosamente.`,
          });

          // Tracking analytics (opcional)
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "download", {
              event_category: "PDF",
              event_label: "Recipe",
              value: 1,
            });
          }
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error downloading recipe PDF:", error);
        toast({
          title: "Error al descargar PDF",
          description: "No pudimos generar el PDF. Inténtalo nuevamente.",
          variant: "error",
        });
      } finally {
        setIsDownloading(false);
      }
    },
    [toast]
  );

  const downloadExercisePDF = useCallback(
    async (exercise: ExerciseSuggestionOutput) => {
      if (!exercise.exerciseName?.trim()) {
        toast({
          title: "No se puede generar PDF",
          description:
            "El ejercicio debe tener un nombre para poder descargarlo.",
          variant: "error",
        });
        return;
      }

      setIsDownloading(true);

      try {
        const result = await pdfService.downloadExercisePDF(exercise);

        if (result.success) {
          toast({
            title: "¡PDF descargado! 📄✨",
            description: `Tu ejercicio "${exercise.exerciseName}" se ha descargado exitosamente.`,
          });

          // Tracking analytics (opcional)
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "download", {
              event_category: "PDF",
              event_label: "Exercise",
              value: 1,
            });
          }
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error downloading exercise PDF:", error);
        toast({
          title: "Error al descargar PDF",
          description: "No pudimos generar el PDF. Inténtalo nuevamente.",
          variant: "error",
        });
      } finally {
        setIsDownloading(false);
      }
    },
    [toast]
  );

  const shareContent = useCallback(
    async (
      content: SuggestRecipeOutput | ExerciseSuggestionOutput,
      type: "recipe" | "exercise"
    ) => {
      const isRecipe = type === "recipe";
      const recipe = isRecipe ? (content as SuggestRecipeOutput) : null;
      const exercise = !isRecipe ? (content as ExerciseSuggestionOutput) : null;

      const title = isRecipe ? recipe?.recipeName : exercise?.exerciseName;

      if (!title) {
        toast({
          title: "No se puede compartir",
          description: `El ${
            isRecipe ? "receta" : "ejercicio"
          } debe tener un nombre para poder compartirlo.`,
          variant: "error",
        });
        return;
      }

      if (navigator.share) {
        try {
          await navigator.share({
            title: `${isRecipe ? "Receta" : "Ejercicio"}: ${title}`,
            text: `Mira ${
              isRecipe
                ? "esta deliciosa receta"
                : "este ejercicio personalizado"
            } que creé con Aira: ${title}`,
            url: window.location.href,
          });

          // Tracking analytics (opcional)
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "share", {
              event_category: isRecipe ? "Recipe" : "Exercise",
              event_label: "Native Share",
              value: 1,
            });
          }
        } catch (error) {
          console.log("Error sharing:", error);
        }
      } else {
        // Fallback para navegadores que no soportan Web Share API
        if (navigator.clipboard) {
          let shareText = "";

          if (isRecipe && recipe) {
            shareText = `🍳 ${recipe.recipeName}\n\nIngredientes:\n${recipe.ingredients}\n\nInstrucciones:\n${recipe.instructions}\n\n💜 Creado con Aira - Tu compañera de bienestar`;
          } else if (exercise) {
            shareText = `🏃‍♀️ ${exercise.exerciseName}\n\nBeneficios:\n${
              exercise.benefits || "Ejercicio personalizado"
            }\n\nInstrucciones:\n${
              exercise.instructions || "Ver PDF para instrucciones detalladas"
            }\n\n💜 Creado con Aira - Tu compañera de bienestar`;
          }

          await navigator.clipboard.writeText(shareText);
          toast({
            title: `¡${isRecipe ? "Receta" : "Ejercicio"} copiado!`,
            description: `El ${
              isRecipe ? "receta" : "ejercicio"
            } se ha copiado al portapapeles.`,
          });

          // Tracking analytics (opcional)
          if (typeof window !== "undefined" && (window as any).gtag) {
            (window as any).gtag("event", "share", {
              event_category: isRecipe ? "Recipe" : "Exercise",
              event_label: "Clipboard",
              value: 1,
            });
          }
        } else {
          toast({
            title: "No se puede compartir",
            description:
              "Tu navegador no soporta la funcionalidad de compartir.",
            variant: "error",
          });
        }
      }
    },
    [toast]
  );

  return {
    isDownloading,
    downloadRecipePDF,
    downloadExercisePDF,
    shareContent,
  };
}
