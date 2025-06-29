import React, { useState } from "react";
import { Alert } from "react-native";
import { FullExerciseRoutineOutput, FullExerciseRoutineInput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentText } from "./ContentCard";
import { SaveButton } from "./SaveButton";
import { useDailyWorkoutRoutines } from "@/hooks/services/useDailyWorkoutRoutines";

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
      title={`🏋️‍♀️ ${routine.nombreRutina}`}
      description={routine.descripcionGeneral}
      footer={saveButton}
    >
      {routine.sesiones?.map((sesion, index) => (
        <ContentSection key={index} title={sesion.nombreSesion}>
          {sesion.ejercicios
            ?.slice(0, 3)
            .map((ejercicio, ejIndex) => (
              <ContentText key={ejIndex}>
                • {ejercicio.nombreEjercicio} - {ejercicio.seriesRepeticiones}
              </ContentText>
            ))}
          {sesion.ejercicios && sesion.ejercicios.length > 3 && (
            <ContentText>
              ... y {sesion.ejercicios.length - 3} ejercicios más
            </ContentText>
          )}
        </ContentSection>
      ))}
    </ContentCard>
  );
} 