import React from "react";
import { Message } from "@/types/Assistant";
import { LoadingIndicator } from "./LoadingIndicator";
import { RecipeCard } from "./cards/RecipeCard";
import { ExerciseCard } from "./cards/ExerciseCard";
import { RoutineCard } from "./cards/RoutineCard";
import { MealPlanCard } from "./cards/MealPlanCard";
import { MotivationCard } from "./cards/MotivationCard";
import { CompletePlanCard } from "./cards/CompletePlanCard";

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

  if (message.motivation) {
    return <MotivationCard motivation={message.motivation} />;
  }

  if (message.completePlan) {
    return <CompletePlanCard completePlan={message.completePlan} />;
  }

  return null;
}
