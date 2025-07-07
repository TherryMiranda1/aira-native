import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";
import {
  FullExerciseRoutineOutput,
  FullExerciseRoutineInput,
} from "@/types/Assistant";
import {
  ContentCard,
  ContentSection,
  ContentText,
  ContentList,
} from "./ContentCard";
import { SaveButton } from "../SaveButton";
import { useDailyWorkoutRoutines } from "@/hooks/services/useDailyWorkoutRoutines";
import { ThemedView } from "@/components/ThemedView";
import { AiraVariants } from "@/constants/Themes";

interface RoutineCardProps {
  routine: FullExerciseRoutineOutput;
  inputParams?: FullExerciseRoutineInput;
}

export function RoutineCard({ routine, inputParams }: RoutineCardProps) {
  const [isSaving, setIsSaving] = useState(false);
  const { createRoutine } = useDailyWorkoutRoutines();

  const handleSave = async () => {
    if (!inputParams) {
      Alert.alert("Error", "No se pueden guardar los parámetros de la rutina");
      return;
    }

    setIsSaving(true);
    try {
      await createRoutine({
        routineData: routine,
        inputParameters: inputParams,
        tags: ["rutina-ejercicio", "entrenamiento", "chat"],
      });

      Alert.alert(
        "Rutina de Ejercicio Guardada",
        "Tu rutina se ha guardado exitosamente en tu biblioteca",
        [{ text: "OK" }]
      );
    } catch (error) {
      console.error("Error guardando rutina de ejercicio:", error);
      Alert.alert(
        "Error",
        "No se pudo guardar la rutina de ejercicio. Inténtalo de nuevo.",
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
      label="Guardar rutina en mi biblioteca"
    />
  ) : null;

  return (
    <ContentCard
      title={routine.nombreRutina || "Rutina de Ejercicio"}
      subtitle="Rutina personalizada"
      description={routine.descripcionGeneral}
      icon="🏋️‍♀️"
      variant="info"
      footer={saveButton}
    >
      {/* Resumen de la rutina */}
      {routine.sesiones && routine.sesiones.length > 0 && (
        <ThemedView variant="border" style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <ThemedText type="small" style={styles.summaryLabel}>
              📊 Resumen de la rutina
            </ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.summaryValue}>
              {routine.sesiones.length} sesión
              {routine.sesiones.length > 1 ? "es" : ""}
            </ThemedText>
          </View>
        </ThemedView>
      )}

      {routine.sesiones?.map((sesion, index) => (
        <ContentSection
          key={index}
          title={sesion.nombreSesion || `Sesión ${index + 1}`}
          icon="💪"
        >
          {sesion.ejercicios && sesion.ejercicios.length > 0 ? (
            <>
              <ContentList
                items={sesion.ejercicios
                  .slice(0, 3)
                  .map(
                    (ejercicio) =>
                      `${ejercicio.nombreEjercicio} - ${ejercicio.seriesRepeticiones}`
                  )}
                type="bullet"
              />
              {sesion.ejercicios.length > 3 && (
                <ContentText variant="highlight">
                  + {sesion.ejercicios.length - 3} ejercicios más
                </ContentText>
              )}
            </>
          ) : (
            <ContentText>
              No hay ejercicios definidos para esta sesión
            </ContentText>
          )}
        </ContentSection>
      ))}

      {(!routine.sesiones || routine.sesiones.length === 0) && (
        <ContentSection title="Información" icon="ℹ️">
          <ContentText variant="highlight">
            Esta rutina no tiene sesiones definidas aún.
          </ContentText>
        </ContentSection>
      )}
    </ContentCard>
  );
}

const styles = StyleSheet.create({
  summaryContainer: {
    marginBottom: 16,
    borderRadius: AiraVariants.cardRadius,
  },
  summaryCard: {
    padding: 12,
    borderRadius: AiraVariants.cardRadius,
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
