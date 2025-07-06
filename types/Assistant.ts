// Personalized Plan
export interface PersonalizedPlanInput {
  fullName?: string;
  age: number;
  sexo: string;
  altura: number;
  peso: number;
  imc?: number;
  objetivo: string;
  plazo?: string;
  condiciones_medicas?: string;
  alergias?: string;
  preferencias_nutricionales?: string;
  habitos_alimenticios?: string;
  nivel_actividad_actual?: string;
  nivel_entrenamiento?: string;
  sesiones_semana?: string;
  minutos_por_sesion?: string;
  equipamiento_disponible?: string;
  horario_entrenamiento?: string;
  horario_comidas?: string;
  presupuesto_semana?: string;
  estres?: string;
  sueno?: string;
  motivadores?: string;
  cookingAvailability?: string;
  personalPriorities?: string;
  nutritionKnowledge?: string;
}

export interface PersonalizedPlanOutput {
  planNutricional: {
    mensajeIntroductorio: string;
    desgloseMacros: {
      caloriasTotales: string;
      proteinas: string;
      carbohidratos: string;
      grasas: string;
    };
    distribucionComidas: string;
    ejemplosRecetasPlatos: {
      tipoComida: string;
      opciones: string[];
    }[];
    consejosPreparacionTiming: string;
  };
  programaEntrenamiento: {
    tipoEjercicio: string;
    frecuenciaVolumenSemanal: string;
    ejerciciosDetalladosPorSesion: {
      nombreSesion: string;
      descripcionSesion?: string;
      ejercicios: {
        nombreEjercicio: string;
        seriesRepeticiones: string;
        descanso: string;
        alternativaOpcional?: string;
      }[];
    }[];
    opcionesAlternativas?: string;
  };
  sugerenciasSeguimientoAjustes: {
    indicadoresProgreso: string;
    frecuenciaRevisionesModificaciones: string;
    estrategiasMotivacionAdherencia: string;
    mensajeFinalMotivador: string;
  };
}

// Exercise Suggestion
export interface ExerciseSuggestionInput {
  fitnessLevel: string;
  userInput: string;
  history?: {
    role: "user" | "model";
    text: string;
  }[];
}

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

// Motivational Input & Output
export interface ProvideMotivationInput {
  userInput: string;
  history?: {
    role: "user" | "model";
    text: string;
  }[];
  assistantConfig?: {
    personality?: {
      communicationTone?: string;
      energyLevel?: string;
      motivationStyle?: string;
      empathyLevel?: string;
    };
    communication?: {
      responseLength?: string;
      emojiUsage?: string;
      languageStyle?: string;
      questioningStyle?: string;
    };
    guidance?: {
      adviceDepth?: string;
      focusAreas?: string[];
      suggestionStyle?: string;
    };
    customization?: {
      preferredGreetings?: string[];
      avoidTerms?: string[];
      specialInstructions?: string;
    };
  };
}

type MotivationalOutput = {
  message: string;
  suggestedNextActions?:
    | {
        label: string;
        actionPrompt: string;
      }[]
    | undefined;
};

// Full Exercise Routine
export interface FullExerciseRoutineInput {
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
}

export interface FullExerciseRoutineOutput {
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
}

// Daily Meal Plan
export interface DailyMealPlanInput {
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
}

export interface DailyMealPlanOutput {
  planTitle: string;
  introduction?: string;
  meals: {
    mealType: string;
    options: string[];
  }[];
  generalTips?: string;
  suggestedNextActions?: {
    label: string;
    actionPrompt: string;
  }[];
}

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

// Suggest Recipe
export interface SuggestRecipeInput {
  userInput: string;
  mealType?: string;
  mainIngredients?: string[];
  dietaryRestrictions?: string[];
  cuisineType?: string;
  cookingTime?: string;
  userDietaryPreferences?: string;
  userAllergies?: string;
  userDislikedFoods?: string;
  history?: {
    role: "user" | "model";
    text: string;
  }[];
}

export interface SuggestRecipeOutput {
  recipeName?: string;
  ingredients?: string;
  instructions?: string;
  reason?: string;
  estimatedTime?: string;
  clarificationQuestion?: string;
  suggestedNextActions?: Array<{ label: string; actionPrompt: string }>;
}

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
  completePlan?: PersonalizedPlanOutput;
  completePlanInputParams?: PersonalizedPlanInput;
}

export type { ExerciseSuggestionOutput, MotivationalOutput };
