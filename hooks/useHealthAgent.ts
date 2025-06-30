import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  Message,
  AgentOption,
  AgentOptionAction,
  DailyMealPlanOutput,
  SuggestRecipeOutput,
  ExerciseSuggestionOutput,
  MotivationalOutput,
  FullExerciseRoutineOutput,
  DailyMealPlanInput,
  SuggestRecipeInput,
  ExerciseSuggestionInput,
  FullExerciseRoutineInput,
} from "@/types/Assistant";
import { usePersonalizedPlan } from "./usePersonalizedPlan";

type AwaitingInputFor =
  | "recipe_preferences"
  | "exercise_details"
  | "motivation_topic"
  | "full_routine_details"
  | "daily_meal_plan_details"
  | "reminder_text"
  | null;

const MAX_HISTORY_MESSAGES = 8;
const CACHE_DURATION = 5 * 60 * 1000;
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000;

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

class AiraLogger {
  private static log(
    level: LogLevel,
    message: string,
    ...optionalParams: any[]
  ) {
    const timestamp = new Date().toISOString();
    const prefix = `[AiraHealthAgent ${level}] ${timestamp}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(prefix, message, ...optionalParams);
        break;
      case LogLevel.WARN:
        console.warn(prefix, message, ...optionalParams);
        break;
      case LogLevel.DEBUG:
        if (__DEV__) {
          console.debug(prefix, message, ...optionalParams);
        }
        break;
      default:
        console.log(prefix, message, ...optionalParams);
    }
  }

  static info(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.INFO, message, ...optionalParams);
  }

  static warn(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.WARN, message, ...optionalParams);
  }

  static error(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.ERROR, message, ...optionalParams);
  }

  static debug(message: string, ...optionalParams: any[]) {
    this.log(LogLevel.DEBUG, message, ...optionalParams);
  }
}

class CacheManager {
  private static cache = new Map<string, CacheEntry>();

  static set<T>(
    key: string,
    data: T,
    durationMs: number = CACHE_DURATION
  ): void {
    const now = Date.now();
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + durationMs,
    });
  }

  static get<T>(key: string): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data as T;
  }

  static clear(): void {
    this.cache.clear();
  }

  static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  attempts: number = RETRY_ATTEMPTS,
  delay: number = RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (attempts <= 1) throw error;

    AiraLogger.warn(
      `Retry attempt failed, ${attempts - 1} attempts remaining`,
      error
    );
    await new Promise((resolve) => setTimeout(resolve, delay));
    return retryWithBackoff(fn, attempts - 1, delay * 2);
  }
};

export function useHealthAgent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [awaitingInputFor, setAwaitingInputFor] =
    useState<AwaitingInputFor>(null);

  const messageIdCounter = useRef(0);
  const initialGreetingSentRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    generateRecipeSuggestion,
    generateExerciseSuggestion,
    generateFullExerciseRoutine,
    generateDailyMealPlan,
    generateMotivationalSupport,
  } = usePersonalizedPlan();

  useEffect(() => {
    const interval = setInterval(() => {
      CacheManager.cleanup();
    }, CACHE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const getNewMessageId = useCallback(() => {
    messageIdCounter.current += 1;
    return `aira-msg-${Date.now()}-${messageIdCounter.current}`;
  }, []);

  const motivationalGreetings = useMemo(
    () => [
      "¡Hola preciosa! Soy Aira, tu compañera de bienestar. ¿Cómo podemos hacer que hoy sea increíble? ✨",
      "¡Qué alegría verte aquí! Soy Aira y estoy lista para acompañarte en tu viaje de bienestar 💜",
      "¡Hola hermosa! Soy Aira, tu aliada en salud y bienestar. ¿En qué puedo ayudarte hoy? 🌸",
      "¡Bienvenida querida! Soy Aira y estoy aquí para cuidarte y apoyarte. ¿Qué necesitas hoy? 🌟",
    ],
    []
  );

  const getDefaultOptions = useCallback(
    (): AgentOption[] => [
      {
        id: "recipe",
        label: "Receta nutritiva y deliciosa",
        action: { type: "show_recipe_prompt" },
      },
      {
        id: "exercise",
        label: "Ejercicio que me haga sentir bien",
        action: { type: "show_exercise_prompt" },
      },
      {
        id: "suggest_routine",
        label: "Rutina de ejercicios personalizada",
        action: {
          type: "user_message",
          payload: "Diseña una rutina de ejercicios perfecta para mí",
        },
      },
      {
        id: "suggest_meal_plan",
        label: "Plan de comidas equilibrado",
        action: {
          type: "user_message",
          payload: "Crea un plan de comidas saludable para hoy",
        },
      },
      {
        id: "motivation",
        label: "Inspiración y motivación",
        action: { type: "show_motivation_prompt" },
      },
    ],
    []
  );

  const addMessage = useCallback(
    (message: Omit<Message, "id" | "timestamp">): string => {
      const newId = getNewMessageId();
      const newMessage: Message = {
        ...message,
        id: newId,
        timestamp: new Date(),
      };

      setMessages((prev) => {
        const updatedMessages = [...prev, newMessage];
        if (updatedMessages.length > MAX_HISTORY_MESSAGES * 2) {
          return updatedMessages.slice(-MAX_HISTORY_MESSAGES);
        }
        return updatedMessages;
      });

      AiraLogger.debug("Message added:", { id: newId, sender: message.sender });
      return newId;
    },
    [getNewMessageId]
  );

  const addAgentMessage = useCallback(
    (
      text?: string,
      optionsInput?: AgentOption[],
      data?: Partial<
        Pick<
          Message,
          | "recipe"
          | "exercise"
          | "motivation"
          | "fullRoutine"
          | "dailyMealPlan"
          | "calendarData"
          | "isLoading"
          | "isError"
        >
      >
    ): string => {
      const optsToShow = optionsInput === undefined ? [] : optionsInput;

      AiraLogger.info("Adding Aira message:", {
        text: text?.substring(0, 50) + (text && text.length > 50 ? "..." : ""),
        optionsCount: optsToShow.length,
        hasData: !!data,
      });

      return addMessage({
        sender: "agent",
        text,
        options: optsToShow,
        ...data,
      });
    },
    [addMessage]
  );

  const prepareChatHistory = useCallback((): {
    role: "user" | "model";
    text: string;
  }[] => {
    return messages
      .slice(-MAX_HISTORY_MESSAGES)
      .map((msg) => {
        let textContent = msg.text || "";

        if (msg.sender === "agent") {
          if (msg.recipe?.recipeName) {
            textContent = msg.recipe.clarificationQuestion
              ? `Aira preguntó: "${msg.recipe.clarificationQuestion}"`
              : `Aira sugirió la receta: ${msg.recipe.recipeName}. (Razón: ${
                  msg.recipe.reason || "Deliciosa y nutritiva"
                })`;
          } else if (msg.exercise?.exerciseName) {
            textContent = msg.exercise.clarificationQuestion
              ? `Aira preguntó: "${msg.exercise.clarificationQuestion}"`
              : `Aira sugirió el ejercicio: ${msg.exercise.exerciseName}. (Beneficios: ${msg.exercise.benefits})`;
          } else if (msg.motivation?.message) {
            textContent = msg.motivation.message;
          } else if (msg.fullRoutine?.nombreRutina) {
            textContent = `Aira sugirió la rutina: ${msg.fullRoutine.nombreRutina}. (Descripción: ${msg.fullRoutine.descripcionGeneral})`;
          } else if (msg.dailyMealPlan?.planTitle) {
            textContent = `Aira sugirió el plan de comidas: ${
              msg.dailyMealPlan.planTitle
            }. (Introducción: ${msg.dailyMealPlan.introduction || ""})`;
          }
        }

        return {
          role: msg.sender === "user" ? "user" : "model",
          text: textContent,
        } as { role: "user" | "model"; text: string };
      })
      .filter((msg) => msg.text && msg.text.trim() !== "");
  }, [messages]);

  const generateMotivationalResponse = useCallback(
    async (
      userInput: string,
      history: { role: "user" | "model"; text: string }[]
    ): Promise<MotivationalOutput> => {
      const motivationalResponses = [
        "Te escucho con mucho cariño. Es completamente válido sentirse así, y quiero que sepas que estás siendo muy valiente al compartir esto conmigo 💕",
        "Gracias por confiar en mí. Cada paso que das, por pequeño que sea, es importante. ¿Te apetece que exploremos esto juntas?",
        "Me parece hermoso que te tomes el tiempo para reflexionar sobre esto. Tu bienestar es una prioridad, no un lujo 🌸",
        "Estoy muy orgullosa de ti por dar este paso. Recuerda que el camino del cuidado personal es único para cada persona.",
        "Tu honestidad me conmueve. ¿Sabes qué? Está perfecto no tener todas las respuestas. Estamos aquí para descubrirlas juntas ✨",
        "Me alegra que hayamos podido hablar de esto. Siempre puedes volver cuando necesites, estaré aquí para ti 🤗",
      ];

      const contextualResponses = {
        tired:
          "Entiendo que te sientas cansada. Es natural sentirse así a veces. ¿Qué te parece si empezamos con algo muy suave? Incluso 5 minutos de respiración profunda pueden hacer una diferencia 🌱",
        overwhelmed:
          "Comprendo que te sientas abrumada. Vamos paso a paso, sin presiones. ¿Hay algo pequeño que te haría sentir un poquito mejor ahora mismo? 🤗",
        unmotivated:
          "La falta de motivación es completamente normal. No te juzgues por ello. A veces el primer paso es simplemente reconocer cómo nos sentimos. Estoy aquí para acompañarte ✨",
        frustrated:
          "Entiendo tu frustración. Los cambios toman tiempo y no siempre son lineales. Cada pequeño esfuerzo cuenta, incluso cuando no lo vemos inmediatamente 💜",
        proud:
          "¡Qué maravilloso! Me alegra mucho escuchar esto. Celebremos este logro juntas. Cada paso que das es valioso y merece ser reconocido 🎉",
      };

      const lowerInput = userInput.toLowerCase();
      let selectedResponse =
        motivationalResponses[
          Math.floor(Math.random() * motivationalResponses.length)
        ];

      if (lowerInput.includes("cansad") || lowerInput.includes("agotad")) {
        selectedResponse = contextualResponses.tired;
      } else if (
        lowerInput.includes("abrumad") ||
        lowerInput.includes("estresad")
      ) {
        selectedResponse = contextualResponses.overwhelmed;
      } else if (
        lowerInput.includes("desmotivad") ||
        lowerInput.includes("sin ganas")
      ) {
        selectedResponse = contextualResponses.unmotivated;
      } else if (
        lowerInput.includes("frustrad") ||
        lowerInput.includes("molest")
      ) {
        selectedResponse = contextualResponses.frustrated;
      } else if (
        lowerInput.includes("logré") ||
        lowerInput.includes("conseguí") ||
        lowerInput.includes("orgullos")
      ) {
        selectedResponse = contextualResponses.proud;
      }

      return {
        message: selectedResponse,
        suggestedNextActions: [
          {
            label: "Cuéntame más sobre esto",
            actionPrompt: "Me gustaría hablar más sobre cómo me siento",
          },
          {
            label: "Sugerir una actividad relajante",
            actionPrompt: "¿Qué actividad relajante me recomiendas para hoy?",
          },
          {
            label: "Ver opciones de bienestar",
            actionPrompt: "¿Qué opciones de bienestar tienes para mí?",
          },
        ],
      };
    },
    []
  );

  const processUserMessage = useCallback(
    async (inputText: string) => {
      if (!inputText?.trim()) return;

      const userText = inputText.trim();
      AiraLogger.info("Processing user message:", userText.substring(0, 100));

      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      addMessage({
        sender: "user",
        text: userText,
        options: [],
      });

      setMessages((prev) => prev.map((msg) => ({ ...msg, options: [] })));

      setIsLoading(true);
      const loadingMsgId = addAgentMessage(
        "Pensando en la mejor respuesta para ti...",
        [],
        { isLoading: true }
      );

      try {
        const chatHistory = prepareChatHistory();
        let agentResponse: string | undefined;
        let agentOptions: AgentOption[] = [];
        let recipeData: SuggestRecipeOutput | undefined;
        let exerciseData: ExerciseSuggestionOutput | undefined;
        let motivationData: MotivationalOutput | undefined;
        let fullRoutineData: FullExerciseRoutineOutput | undefined;
        let dailyMealPlanData: DailyMealPlanOutput | undefined;

        const lowerText = userText.toLowerCase();
        const isRecipeRequest =
          /\b(receta|cocin|comid|ingrediente|plato)\b/.test(lowerText);
        const isExerciseRequest =
          /\b(ejercicio|entrena|movimiento|actividad|deporte)\b/.test(
            lowerText
          );
        const isRoutineRequest =
          /\b(rutina|plan de ejercicio|entrenamiento completo)\b/.test(
            lowerText
          );
        const isMealPlanRequest =
          /\b(plan de comidas?|menú|alimentación|plan nutricional|comidas del día|comidas de hoy)\b/.test(
            lowerText
          );
        const isMotivationRequest =
          /\b(motiv|ánimo|inspiración|apoyo|tristeza|desánimo)\b/.test(
            lowerText
          );

        if (awaitingInputFor === "recipe_preferences" || isRecipeRequest) {
          const cacheKey = `recipe-${userText.substring(0, 50)}`;
          recipeData = CacheManager.get<SuggestRecipeOutput>(cacheKey);

          if (!recipeData) {
            recipeData = await retryWithBackoff(async () => {
              return await generateRecipeSuggestion({
                userInput: userText,
                history: chatHistory,
              } as SuggestRecipeInput);
            });
            CacheManager.set(cacheKey, recipeData);
          }

          agentResponse = recipeData.clarificationQuestion;
          agentOptions = recipeData.clarificationQuestion
            ? []
            : getDefaultOptions();
        } else if (
          awaitingInputFor === "exercise_details" ||
          isExerciseRequest
        ) {
          const cacheKey = `exercise-${userText.substring(0, 50)}`;
          exerciseData = CacheManager.get<ExerciseSuggestionOutput>(cacheKey);

          if (!exerciseData) {
            exerciseData = await retryWithBackoff(async () => {
              return await generateExerciseSuggestion({
                userInput: userText,
                fitnessLevel: "Intermedio",
                history: chatHistory,
              } as ExerciseSuggestionInput);
            });
            CacheManager.set(cacheKey, exerciseData);
          }

          agentResponse = exerciseData?.clarificationQuestion;
          agentOptions = exerciseData?.clarificationQuestion
            ? []
            : getDefaultOptions();
        } else if (isRoutineRequest) {
          const routineInputParams: FullExerciseRoutineInput = {
            userInput: userText,
            history: chatHistory,
          };

          fullRoutineData = await retryWithBackoff(async () => {
            return await generateFullExerciseRoutine(routineInputParams);
          });

          agentResponse = `¡Aquí tienes tu rutina personalizada! 💪✨`;
          agentOptions = getDefaultOptions();

          setMessages((prev) =>
            prev.map((m) =>
              m.id === loadingMsgId
                ? {
                    ...m,
                    sender: "agent",
                    text: agentResponse,
                    fullRoutine: fullRoutineData,
                    fullRoutineInputParams: routineInputParams,
                    isLoading: false,
                    isError: false,
                    options: agentOptions,
                    timestamp: new Date(),
                  }
                : m
            )
          );

          setAwaitingInputFor(null);
          AiraLogger.info("Routine message processed successfully");
          return;
        } else if (isMealPlanRequest) {
          const mealPlanInputParams: DailyMealPlanInput = {
            userInput: userText,
            history: chatHistory,
          };

          dailyMealPlanData = await retryWithBackoff(async () => {
            return await generateDailyMealPlan(mealPlanInputParams);
          });

          agentResponse = `¡Tu plan de comidas está listo! 🥗✨`;
          agentOptions = getDefaultOptions();

          setMessages((prev) =>
            prev.map((m) =>
              m.id === loadingMsgId
                ? {
                    ...m,
                    sender: "agent",
                    text: agentResponse,
                    dailyMealPlan: dailyMealPlanData,
                    dailyMealPlanInputParams: mealPlanInputParams,
                    isLoading: false,
                    isError: false,
                    options: agentOptions,
                    timestamp: new Date(),
                  }
                : m
            )
          );

          setAwaitingInputFor(null);
          AiraLogger.info("Meal plan message processed successfully");
          return;
        } else if (
          awaitingInputFor === "motivation_topic" ||
          isMotivationRequest
        ) {
          motivationData = await retryWithBackoff(async () => {
            return await generateMotivationalSupport({
              userInput: userText,
              history: chatHistory,
            });
          });

          agentOptions = getDefaultOptions();
        } else {
          motivationData = await retryWithBackoff(async () => {
            return await generateMotivationalSupport({
              userInput: userText,
              history: chatHistory,
            });
          });

          agentOptions = getDefaultOptions();
        }

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsgId
              ? {
                  ...m,
                  sender: "agent",
                  text: agentResponse,
                  recipe: recipeData,
                  exercise: exerciseData,
                  motivation: motivationData,
                  fullRoutine: fullRoutineData,
                  dailyMealPlan: dailyMealPlanData,
                  isLoading: false,
                  isError: false,
                  options:
                    awaitingInputFor && agentOptions.length === 0
                      ? []
                      : agentOptions,
                  timestamp: new Date(),
                }
              : m
          )
        );

        setAwaitingInputFor(null);
        AiraLogger.info("Message processed successfully");
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;

        AiraLogger.error("Error processing user message:", error);

        const errorResponses = [
          "¡Ups! Algo salió mal, pero no te preocupes. ¿Intentamos con otra cosa? 💜",
          "¡Vaya! Parece que hubo un pequeño problema. ¿Probamos de nuevo? ✨",
          "¡Oh! La tecnología a veces nos juega pasadas. ¿Qué tal si lo intentamos otra vez? 😊",
        ];

        setMessages((prev) =>
          prev.map((m) =>
            m.id === loadingMsgId
              ? {
                  ...m,
                  sender: "agent",
                  text: errorResponses[
                    Math.floor(Math.random() * errorResponses.length)
                  ],
                  isError: true,
                  isLoading: false,
                  options: getDefaultOptions(),
                  timestamp: new Date(),
                }
              : m
          )
        );

        setAwaitingInputFor(null);
      } finally {
        setIsLoading(false);
      }
    },
    [
      addMessage,
      awaitingInputFor,
      getDefaultOptions,
      prepareChatHistory,
      addAgentMessage,
      generateRecipeSuggestion,
      generateExerciseSuggestion,
      generateFullExerciseRoutine,
      generateDailyMealPlan,
      generateMotivationalSupport,
    ]
  );

  useEffect(() => {
    if (
      !initialGreetingSentRef.current &&
      messages.length === 0 &&
      !isLoading
    ) {
      const greeting =
        motivationalGreetings[
          Math.floor(Math.random() * motivationalGreetings.length)
        ];
      addAgentMessage(greeting, getDefaultOptions());
      initialGreetingSentRef.current = true;
    }
  }, [
    messages.length,
    isLoading,
    addAgentMessage,
    getDefaultOptions,
    motivationalGreetings,
  ]);

  const handleOptionClick = useCallback(
    async (action: AgentOptionAction) => {
      AiraLogger.info("Option clicked:", action.type);

      setMessages((prev) => prev.map((msg) => ({ ...msg, options: [] })));

      let agentPromptText: string | undefined;
      let newAwaitingInputFor: AwaitingInputFor = null;
      let shouldProcessUserMessage = false;
      let userMessagePayload: string | undefined;

      setIsLoading(true);

      const prompts = {
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
      };

      switch (action.type) {
        case "user_message":
          shouldProcessUserMessage = true;
          userMessagePayload = action.payload as string;
          break;

        case "show_recipe_prompt":
          agentPromptText =
            prompts.show_recipe_prompt[
              Math.floor(Math.random() * prompts.show_recipe_prompt.length)
            ];
          newAwaitingInputFor = "recipe_preferences";
          break;

        case "show_exercise_prompt":
          agentPromptText =
            prompts.show_exercise_prompt[
              Math.floor(Math.random() * prompts.show_exercise_prompt.length)
            ];
          newAwaitingInputFor = "exercise_details";
          break;

        case "show_motivation_prompt":
          agentPromptText =
            prompts.show_motivation_prompt[
              Math.floor(Math.random() * prompts.show_motivation_prompt.length)
            ];
          newAwaitingInputFor = "motivation_topic";
          break;

        case "tell_date":
          const today = new Date().toLocaleDateString("es-ES", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          addAgentMessage(
            `¡Claro! Hoy es ${today} ✨ ¿En qué más puedo ayudarte?`,
            getDefaultOptions()
          );
          setAwaitingInputFor(null);
          break;

        default:
          addAgentMessage(
            "¡Ups! Esa opción se me escapa por ahora 😅 ¿Qué tal si probamos con alguna de estas otras ideas?",
            getDefaultOptions()
          );
          newAwaitingInputFor = null;
      }

      if (agentPromptText) {
        addAgentMessage(agentPromptText, []);
      }

      setAwaitingInputFor(newAwaitingInputFor);
      setIsLoading(false);

      if (shouldProcessUserMessage && userMessagePayload) {
        await processUserMessage(userMessagePayload);
      }
    },
    [
      processUserMessage,
      addAgentMessage,
      getDefaultOptions,
      setIsLoading,
      setAwaitingInputFor,
      setMessages,
    ]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      CacheManager.clear();
    };
  }, []);

  return {
    messages,
    isLoading,
    processUserMessage,
    handleOptionClick,
  };
}
