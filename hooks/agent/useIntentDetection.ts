import { useCallback } from "react";
import { DetectedIntent } from "@/hooks/agent/agentActions.constants";

const INTENT_KEYWORDS = {
  recipe: [
    "receta", "cocinar", "comida", "platillo", "ingredientes", "preparar",
    "cocina", "comer", "desayuno", "almuerzo", "cena", "merienda"
  ],
  exercise: [
    "ejercicio", "entrenar", "mover", "actividad", "físico", "deporte",
    "workout", "fitness", "cardio", "fuerza"
  ],
  exercise_routine: [
    "rutina", "plan de ejercicio", "entrenamiento completo", "programa",
    "rutina de ejercicios", "plan de entrenamiento"
  ],
  meal_plan: [
    "plan de comidas", "menú", "alimentación", "dieta", "plan nutricional",
    "plan alimentario", "menú semanal"
  ],
  motivation: [
    "motivación", "ánimo", "apoyo", "inspiración", "ayuda emocional",
    "me siento", "estoy triste", "necesito", "deprimida", "ansiosa",
    "preocupada", "mal día", "abrumada"
  ],
  complete_plan: [
    "plan completo", "plan integral", "todo junto", "plan personalizado",
    "programa completo"
  ]
};

export function useIntentDetection() {
  const detectIntent = useCallback((message: string): DetectedIntent => {
    const lowerMessage = message.toLowerCase();
    
    let maxScore = 0;
    let detectedIntent: DetectedIntent = "general";
    
    Object.entries(INTENT_KEYWORDS).forEach(([intent, keywords]) => {
      const score = keywords.reduce((acc, keyword) => {
        if (lowerMessage.includes(keyword.toLowerCase())) {
          return acc + 1;
        }
        return acc;
      }, 0);
      
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent as DetectedIntent;
      }
    });
    
    if (maxScore === 0) {
      if (lowerMessage.length > 50) {
        return "motivation";
      }
      return "general";
    }
    
    return detectedIntent;
  }, []);

  const getIntentConfidence = useCallback((message: string, intent: DetectedIntent): number => {
    const lowerMessage = message.toLowerCase();
    const keywords = INTENT_KEYWORDS[intent as keyof typeof INTENT_KEYWORDS] || [];
    
    const matchedKeywords = keywords.filter((keyword: string) => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    return matchedKeywords.length / keywords.length;
  }, []);

  return {
    detectIntent,
    getIntentConfidence,
  };
} 