import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";

export const getRecipeDifficultyColor = (dificultad: string) => {
  switch (dificultad.toLowerCase()) {
    case "muy fácil":
      return "#4ade80"; // verde
    case "fácil":
      return "#60a5fa"; // azul
    case "medio":
      return "#facc15"; // amarillo
    case "difícil":
      return "#f87171"; // rojo
    default:
      return AiraColors.mutedForeground; // gris
  }
};

// Función para obtener el color según la dificultad
export const getExerciseDifficultyColor = (dificultad: string) => {
  switch (dificultad.toLowerCase()) {
    case "principiante":
      return "#60a5fa"; // azul
    case "intermedio":
      return "#facc15"; // amarillo
    case "avanzado":
      return "#f87171"; // rojo
    default:
      return AiraColors.mutedForeground;
  }
};

// Función para obtener el color según el tipo de ejercicio
export const getExerciseTypeColor = (tipo: string) => {
  switch (tipo.toLowerCase()) {
    case "fuerza":
      return AiraColors.primary;
    case "cardio":
      return "#60a5fa"; // azul
    case "flexibilidad":
      return "#34d399"; // verde
    default:
      return AiraColorsWithAlpha.foregroundWithOpacity(0.2);
  }
};
