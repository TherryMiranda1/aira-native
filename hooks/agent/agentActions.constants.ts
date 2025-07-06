import type { AgentOption, Message } from "@/types/Assistant";

export type DetectedIntent =
  | "recipe"
  | "exercise"
  | "exercise_routine"
  | "meal_plan"
  | "motivation"
  | "complete_plan"
  | "general";

export type AwaitingInputFor =
  | "recipe_preferences"
  | "exercise_details"
  | "motivation_topic"
  | "routine_preferences"
  | "meal_plan_preferences"
  | "complete_plan_preferences"
  | null;

export interface ActionConfig {
  intent: DetectedIntent;
  awaitingInputFor: AwaitingInputFor;
  promptKey: string;
  fallbackMessage: string;
  successMessage: string;
  hasDataResponse: boolean;
  allowsMoreInfo: boolean;
  moreInfoOptions?: AgentOption[];
  dataMapper?: (data: any) => Partial<Message>;
}

export const ACTION_CONFIGS: Record<string, ActionConfig> = {
  recipe: {
    intent: "recipe",
    awaitingInputFor: "recipe_preferences",
    promptKey: "show_recipe_prompt",
    fallbackMessage:
      "¡Perfecto! He encontrado algunas opciones de recetas para ti. 🍳✨",
    successMessage: "¡Aquí tienes una receta deliciosa! 🍳✨",
    hasDataResponse: true,
    allowsMoreInfo: true,
    dataMapper: (data) => ({ recipe: data }),
    moreInfoOptions: [
      {
        id: "recipe_more_ingredients",
        label: "Sugerir ingredientes alternativos",
        action: {
          type: "user_message",
          payload:
            "¿Puedes sugerir ingredientes alternativos para esta receta?",
        },
      },
      {
        id: "recipe_cooking_tips",
        label: "Consejos de preparación",
        action: {
          type: "user_message",
          payload: "Dame consejos para preparar mejor esta receta",
        },
      },
    ],
  },
  exercise: {
    intent: "exercise",
    awaitingInputFor: "exercise_details",
    promptKey: "show_exercise_prompt",
    fallbackMessage:
      "¡Perfecto! He encontrado algunos ejercicios ideales para ti. 💪✨",
    successMessage: "¡Excelente elección! 💪✨",
    hasDataResponse: true,
    allowsMoreInfo: true,
    dataMapper: (data) => ({ exercise: data }),
    moreInfoOptions: [
      {
        id: "exercise_variations",
        label: "Variaciones del ejercicio",
        action: {
          type: "user_message",
          payload: "¿Puedes mostrarme variaciones de este ejercicio?",
        },
      },
      {
        id: "exercise_progression",
        label: "Progresión y dificultad",
        action: {
          type: "user_message",
          payload: "¿Cómo puedo progresar en este ejercicio?",
        },
      },
    ],
  },
  exercise_routine: {
    intent: "exercise_routine",
    awaitingInputFor: "routine_preferences",
    promptKey: "show_routine_prompt",
    fallbackMessage: "¡Aquí tienes tu rutina personalizada! 💪✨",
    successMessage: "¡Tu rutina está lista! 💪✨",
    hasDataResponse: true,
    allowsMoreInfo: true,
    dataMapper: (data) => ({ fullRoutine: data }),
    moreInfoOptions: [
      {
        id: "routine_modifications",
        label: "Modificar rutina",
        action: {
          type: "user_message",
          payload: "¿Puedes modificar esta rutina según mis necesidades?",
        },
      },
      {
        id: "routine_schedule",
        label: "Programar rutina",
        action: {
          type: "user_message",
          payload: "Ayúdame a programar esta rutina en mi semana",
        },
      },
    ],
  },
  meal_plan: {
    intent: "meal_plan",
    awaitingInputFor: "meal_plan_preferences",
    promptKey: "show_meal_plan_prompt",
    fallbackMessage: "¡Tu plan de comidas está listo! 🥗✨",
    successMessage: "¡Perfecto! Tu plan nutricional está preparado! 🥗✨",
    hasDataResponse: true,
    allowsMoreInfo: true,
    dataMapper: (data) => ({ dailyMealPlan: data }),
    moreInfoOptions: [
      {
        id: "meal_plan_adjustments",
        label: "Ajustar plan",
        action: {
          type: "user_message",
          payload: "¿Puedes ajustar este plan de comidas?",
        },
      },
      {
        id: "meal_plan_shopping",
        label: "Lista de compras",
        action: {
          type: "user_message",
          payload: "Crea una lista de compras para este plan",
        },
      },
    ],
  },
  motivation: {
    intent: "motivation",
    awaitingInputFor: "motivation_topic",
    promptKey: "show_motivation_prompt",
    fallbackMessage: "¡Aquí estoy para apoyarte! 💜✨",
    successMessage: "¡Espero que esto te ayude! 💜✨",
    hasDataResponse: true,
    allowsMoreInfo: true,
    dataMapper: (data) => ({ motivation: data }),
    moreInfoOptions: [
      {
        id: "motivation_deeper",
        label: "Profundizar en el tema",
        action: {
          type: "user_message",
          payload: "Me gustaría profundizar más en este tema",
        },
      },
      {
        id: "motivation_action_plan",
        label: "Plan de acción",
        action: {
          type: "user_message",
          payload: "¿Puedes ayudarme a crear un plan de acción?",
        },
      },
    ],
  },
  complete_plan: {
    intent: "complete_plan",
    awaitingInputFor: "complete_plan_preferences",
    promptKey: "show_complete_plan_prompt",
    fallbackMessage: "¡Tu plan completo está listo! 💪✨",
    successMessage: "¡Tu plan completo está listo! 💪✨",
    hasDataResponse: true,
    allowsMoreInfo: true,
    dataMapper: (data) => ({ completePlan: data }),
    moreInfoOptions: [
      {
        id: "complete_plan_modify",
        label: "Modificar plan",
        action: {
          type: "user_message",
          payload: "¿Puedes modificar este plan completo?",
        },
      },
      {
        id: "complete_plan_schedule",
        label: "Programar en calendario",
        action: {
          type: "user_message",
          payload: "Ayúdame a programar este plan en mi calendario",
        },
      },
    ],
  },
  general: {
    intent: "general",
    awaitingInputFor: null,
    promptKey: "show_motivation_prompt",
    fallbackMessage: "¡Estoy aquí para ayudarte! ✨",
    successMessage: "¡Espero haberte ayudado! ✨",
    hasDataResponse: false,
    allowsMoreInfo: false,
  },
};

export const DEFAULT_OPTIONS: AgentOption[] = [
  {
    id: "suggest_recipe",
    label: "Sugerir receta",
    action: { type: "show_recipe_prompt" },
  },
  {
    id: "suggest_exercise",
    label: "Sugerir ejercicio",
    action: { type: "show_exercise_prompt" },
  },
  {
    id: "motivation",
    label: "Motivación",
    action: { type: "show_motivation_prompt" },
  },
  {
    id: "full_routine",
    label: "Rutina completa",
    action: { type: "suggest_full_routine_prompt" },
  },
  {
    id: "meal_plan",
    label: "Plan de comidas",
    action: { type: "suggest_daily_meal_plan_prompt" },
  },
];

export const CONTEXTUAL_PROMPTS = {
  show_recipe_prompt: [
    "¡Perfecto! 🍳 Para crear la receta ideal para ti, cuéntame: ¿qué ingredientes tienes disponibles o qué tipo de comida te apetece?",
    "¡Me encanta cocinar contigo! ✨ Dime, ¿tienes algún antojo en particular o ingredientes que quieras usar?",
    "¡Qué emocionante! 🥗 Para sugerir la receta perfecta, ¿hay algún sabor o tipo de platillo que te llame la atención?",
  ],
  show_exercise_prompt: [
    "¡Excelente elección! 💪 Para encontrar el ejercicio perfecto para ti, cuéntame: ¿cómo te sientes hoy o qué tipo de movimiento tienes ganas de hacer?",
    "¡Me encanta que quieras moverte! ✨ Dime, ¿prefieres algo suave y relajante o algo más energético?",
    "¡Qué bueno que pienses en ejercitarte! 🌟 ¿Tienes alguna zona del cuerpo en la que quieras enfocarte o algún estado de ánimo particular?",
  ],
  show_motivation_prompt: [
    "¡Aquí estoy para ti! 💜 Cuéntame, ¿hay algo en particular que te tiene preocupada o sobre lo que te gustaría recibir un poco de ánimo?",
    "¡Siempre es bueno buscar inspiración! ✨ Dime, ¿qué está pasando en tu vida o qué área te gustaría que trabajemos juntas?",
    "¡Me alegra que busques apoyo! 🌸 Comparte conmigo qué te está pasando o en qué puedo acompañarte hoy.",
  ],
  show_routine_prompt: [
    "¡Perfecto! 💪 Para crear tu rutina ideal, cuéntame: ¿qué tipo de ejercicios prefieres y cuánto tiempo tienes disponible?",
    "¡Excelente! ✨ Dime, ¿tienes algún objetivo específico o zona del cuerpo en la que quieras enfocarte?",
    "¡Qué bueno! 🌟 Para diseñar tu rutina perfecta, ¿prefieres entrenamientos intensos o más suaves?",
  ],
  show_meal_plan_prompt: [
    "¡Genial! 🥗 Para crear tu plan perfecto, cuéntame: ¿tienes alguna preferencia alimentaria o objetivo específico?",
    "¡Perfecto! ✨ Dime, ¿hay algún alimento que te encante o que prefieras evitar?",
    "¡Excelente! 🌟 Para diseñar tu plan ideal, ¿buscas algo específico como perder peso, ganar músculo o simplemente comer más saludable?",
  ],
};

export const FALLBACK_CONFIG = {
  noIntentDetected: {
    shouldRedirectToMotivation: true,
    message:
      "¡Hola! Me alegra que estés aquí. Aunque no estoy segura de qué necesitas exactamente, estoy aquí para apoyarte. 💜",
    options: DEFAULT_OPTIONS,
  },
  errorResponse: [
    "¡Ups! Algo salió mal, pero no te preocupes. ¿Intentamos con otra cosa? 💜",
    "¡Vaya! Parece que hubo un pequeño problema. ¿Probamos de nuevo? ✨",
    "¡Oh! La tecnología a veces nos juega pasadas. ¿Qué tal si lo intentamos otra vez? 😊",
  ],
  motivationalGreetings: [
    "¡Hola preciosa! Soy Aira, tu compañera de bienestar. ¿Cómo podemos hacer que hoy sea increíble? ✨",
    "¡Qué alegría verte aquí! Soy Aira y estoy lista para acompañarte en tu viaje de bienestar 💜",
    "¡Hola hermosa! Soy Aira, tu aliada en salud y bienestar. ¿En qué puedo ayudarte hoy? 🌸",
    "¡Bienvenida querida! Soy Aira y estoy aquí para cuidarte y apoyarte. ¿Qué necesitas hoy? 🌟",
  ],
};

export function getActionConfig(intent: DetectedIntent): ActionConfig {
  return ACTION_CONFIGS[intent] || ACTION_CONFIGS.general;
}

export function getRandomPrompt(promptKey: string): string {
  const prompts =
    CONTEXTUAL_PROMPTS[promptKey as keyof typeof CONTEXTUAL_PROMPTS];
  if (!prompts || prompts.length === 0) {
    return "¡Cuéntame más para poder ayudarte mejor! ✨";
  }
  return prompts[Math.floor(Math.random() * prompts.length)];
}

export function getRandomErrorResponse(): string {
  const responses = FALLBACK_CONFIG.errorResponse;
  return responses[Math.floor(Math.random() * responses.length)];
}

export function getRandomGreeting(): string {
  const greetings = FALLBACK_CONFIG.motivationalGreetings;
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export function getMoreInfoOptions(intent: DetectedIntent): AgentOption[] {
  const config = ACTION_CONFIGS[intent];
  return config?.moreInfoOptions || [];
}

export function shouldShowMoreInfoOptions(
  intent: DetectedIntent,
  hasData: boolean
): boolean {
  const config = ACTION_CONFIGS[intent];
  return config?.allowsMoreInfo && hasData;
}

export function mapResponseToMessage(toolUsed: string, data: any): Partial<Message> {
  const config = ACTION_CONFIGS[toolUsed];
  if (config?.dataMapper && data) {
    return config.dataMapper(data);
  }
  return {};
}

export function getMessageOptions(toolUsed: string, hasData: boolean): AgentOption[] {
  if (shouldShowMoreInfoOptions(toolUsed as DetectedIntent, hasData)) {
    return getMoreInfoOptions(toolUsed as DetectedIntent);
  }
  return DEFAULT_OPTIONS;
} 