import React from "react";
import { ExerciseSuggestionOutput } from "@/types/Assistant";
import { ContentCard, ContentSection, ContentText } from "./ContentCard";

interface ExerciseCardProps {
  exercise: ExerciseSuggestionOutput;
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <ContentCard
      title={`💪 ${exercise.exerciseName || "Ejercicio Sugerido"}`}
      description={exercise.benefits}
    >
      {exercise.instructions && (
        <ContentSection title="Instrucciones:">
          <ContentText>{exercise.instructions}</ContentText>
        </ContentSection>
      )}
    </ContentCard>
  );
} 