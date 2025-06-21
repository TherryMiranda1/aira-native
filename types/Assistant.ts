type ExerciseSuggestionOutput = {
  exerciseName: string;
  instructions: string;
  benefits: string;
  clarificationQuestion?: string | undefined;
  suggestedNextActions?:
    | {
        label: string;
        actionPrompt: string;
      }[]
    | undefined;
};

type MotivationalOutput = {
  message: string;
  suggestedNextActions?:
    | {
        label: string;
        actionPrompt: string;
      }[]
    | undefined;
};

type FullExerciseRoutineInput = {
  userInput: string;
  fitnessLevel?: string | undefined;
  history?:
    | {
        role: "user" | "model";
        text: string;
      }[]
    | undefined;
  availableEquipment?: string | undefined;
  timePerSession?: string | undefined;
  daysPerWeek?: string | undefined;
};

type FullExerciseRoutineOutput = {
  nombreRutina: string;
  descripcionGeneral: string;
  sesiones: {
    ejercicios: {
      nombreEjercicio: string;
      seriesRepeticiones: string;
      descanso: string;
      descripcionDetallada: string;
      musculosImplicados: string;
      alternativaOpcional?: string | undefined;
      consejosEjecucion?: string | undefined;
      imagenSugeridaTerminos?: string | undefined;
    }[];
    nombreSesion: string;
    enfoque?: string | undefined;
    calentamiento?: string | undefined;
    enfriamiento?: string | undefined;
  }[];
  suggestedNextActions?:
    | {
        label: string;
        actionPrompt: string;
      }[]
    | undefined;
  advertencias?: string | undefined;
  sugerenciasAdicionales?: string | undefined;
};

type DailyMealPlanInput = {
  userInput: string;
  history?:
    | {
        role: "user" | "model";
        text: string;
      }[]
    | undefined;
  dietaryPreferences?: string | undefined;
  allergies?: string | undefined;
  dislikedFoods?: string | undefined;
  mainGoal?: string | undefined;
};

type DailyMealPlanOutputType = {
  name: string;
  description: string;
  ingredients: string;
  preparation: string;
  estimatedTime?: string;
};

export interface AgentOptionAction {
  type:
    | "show_recipe_prompt"
    | "show_exercise_prompt"
    | "show_motivation_prompt"
    | "start_listening"
    | "tell_date"
    | "view_reminders"
    | "user_message"
    | "suggest_full_routine_prompt"
    | "suggest_daily_meal_plan_prompt"
    | "ask_for_reminder_text"
    | "show_calendar_in_chat";
  payload?: any;
}

export interface AgentOption {
  id: string;
  label: string;
  action: AgentOptionAction;
}

// Estructura para UNA receta.
export interface SuggestRecipeOutput {
  recipeName?: string;
  ingredients?: string;
  instructions?: string;
  reason?: string;
  estimatedTime?: string;
  clarificationQuestion?: string;
  suggestedNextActions?: Array<{ label: string; actionPrompt: string }>;
}

export type DailyMealPlanOutput = DailyMealPlanOutputType;

// Este tipo se usa internamente por DailyMealPlanOutput
export interface DetailedMealOption {
  name: string;
  description?: string;
  ingredients: string;
  preparation: string;
  estimatedTime?: string;
}

export interface Reminder {
  id: string;
  originalText: string;
  reminderText: string;
  createdAt: Date;
  eventAt?: Date;
  // Campos adicionales para compatibilidad con el nuevo servicio (opcionales para retrocompatibilidad)
  userId?: string;
  isCompleted?: boolean;
  priority?: "low" | "medium" | "high" | "urgent";
  category?:
    | "health"
    | "exercise"
    | "nutrition"
    | "medical"
    | "selfcare"
    | "work"
    | "personal"
    | "family"
    | "other";
  tags?: string[];
  notes?: string;
  notificationSent?: boolean;
  recurrenceType?: "once" | "daily" | "weekly" | "monthly" | "yearly";
  updatedAt?: Date;
  metadata?: {
    interpretationNotes?: string;
    aiConfidence?: number;
    source?: "chat" | "web" | "api";
  };
}

export interface Message {
  id: string;
  text?: string;
  sender: "user" | "agent";
  timestamp: Date;
  options?: AgentOption[];
  recipe?: SuggestRecipeOutput;
  exercise?: ExerciseSuggestionOutput;
  motivation?: MotivationalOutput;
  fullRoutine?: FullExerciseRoutineOutput;
  fullRoutineInputParams?: FullExerciseRoutineInput;
  dailyMealPlan?: DailyMealPlanOutput;
  dailyMealPlanInputParams?: DailyMealPlanInput;
  calendarData?: { reminders: Reminder[] };
  isLoading?: boolean;
  isError?: boolean;
}

export type {
  ExerciseSuggestionOutput,
  MotivationalOutput,
  FullExerciseRoutineOutput,
};
