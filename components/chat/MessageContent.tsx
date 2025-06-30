import React from "react";
import { Message } from "@/types/Assistant";
import { LoadingIndicator } from "./LoadingIndicator";
import { RecipeCard } from "./RecipeCard";
import { ExerciseCard } from "./ExerciseCard";
import { RoutineCard } from "./RoutineCard";
import { MealPlanCard } from "./MealPlanCard";

interface MessageContentProps {
  message: Message;
}

export function MessageContent({ message }: MessageContentProps) {
  if (message.isLoading) {
    return <LoadingIndicator />;
  }

  if (message.recipe) {
    return <RecipeCard recipe={message.recipe} />;
  }

  if (message.exercise) {
    return <ExerciseCard exercise={message.exercise} />;
  }

  if (message.fullRoutine) {
    return (
      <RoutineCard 
        routine={message.fullRoutine} 
        inputParams={message.fullRoutineInputParams}
      />
    );
  }

  if (message.dailyMealPlan) {
    return (
      <MealPlanCard 
        mealPlan={message.dailyMealPlan} 
        inputParams={message.dailyMealPlanInputParams}
      />
    );
  }

  return null;
} 