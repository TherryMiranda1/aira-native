import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

type FullExerciseRoutineInput = {
  userInput: string;
  fitnessLevel?: string | undefined;
  availableEquipment?: string | undefined;
  timePerSession?: string | undefined;
  daysPerWeek?: string | undefined;
  history?: {
    role: string;
    text: string;
  };
};

type FullExerciseRoutineOutput = {
  nombreRutina: string;
  descripcionGeneral: string;
  sesiones: {
    nombreSesion: string;
    ejercicios: {
      nombreEjercicio: string;
      seriesRepeticiones: string;
      descanso: string;
      descripcionDetallada: string;
      musculosImplicados: string;
      consejosEjecucion?: string | undefined;
      alternativaOpcional?: string | undefined;
      imagenSugeridaTerminos?: string | undefined;
    }[];
    enfoque?: string | undefined;
    calentamiento?: string | undefined;
    enfriamiento?: string | undefined;
  }[];
  advertencias?: string | undefined;
  sugerenciasAdicionales?: string | undefined;
  suggestedNextActions?: {
    label: string;
    actionPrompt: string;
  }[];
};

export interface DailyWorkoutRoutineFromCMS {
  id: string;
  userId: string;
  routineName: string;
  generalDescription?: string;
  warnings?: string;
  sessions: {
    sessionName: string;
    focus?: string;
    warmup?: string;
    exercises: {
      exerciseName: string;
      setsReps: string;
      rest: string;
      detailedDescription: string;
      musclesInvolved: string;
      executionTips?: string;
      optionalAlternative?: string;
      suggestedImageTerms?: string;
    }[];
    cooldown?: string;
  }[];
  additionalSuggestions?: string;
  suggestedNextActions?: {
    label: string;
    actionPrompt: string;
  }[];
  inputParameters: {
    userInput?: string;
    fitnessLevel?: string;
    availableEquipment?: string;
    timePerSession?: string;
    daysPerWeek?: string;
  };
  isFavorite: boolean;
  tags: { tag: string }[];
  notes?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyWorkoutRoutine {
  id: string;
  userId: string;
  routineName: string;
  generalDescription?: string;
  warnings?: string;
  sessions: {
    sessionName: string;
    focus?: string;
    warmup?: string;
    exercises: {
      exerciseName: string;
      setsReps: string;
      rest: string;
      detailedDescription: string;
      musclesInvolved: string;
      executionTips?: string;
      optionalAlternative?: string;
      suggestedImageTerms?: string;
    }[];
    cooldown?: string;
  }[];
  additionalSuggestions?: string;
  suggestedNextActions?: {
    label: string;
    actionPrompt: string;
  }[];
  inputParameters: {
    userInput?: string;
    fitnessLevel?: string;
    availableEquipment?: string;
    timePerSession?: string;
    daysPerWeek?: string;
  };
  isFavorite: boolean;
  tags: string[];
  notes?: string;
  lastAccessedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyWorkoutRoutineData {
  routineData: FullExerciseRoutineOutput;
  inputParameters: FullExerciseRoutineInput;
  tags?: string[];
  notes?: string;
  isFavorite?: boolean;
}

const transformDailyWorkoutRoutine = (
  routine: DailyWorkoutRoutineFromCMS
): DailyWorkoutRoutine => {
  return {
    id: routine.id,
    userId: routine.userId,
    routineName: routine.routineName,
    generalDescription: routine.generalDescription,
    warnings: routine.warnings,
    sessions: routine.sessions.map((session) => ({
      sessionName: session.sessionName,
      focus: session.focus,
      warmup: session.warmup,
      exercises: session.exercises.map((exercise) => ({
        exerciseName: exercise.exerciseName,
        setsReps: exercise.setsReps,
        rest: exercise.rest,
        detailedDescription: exercise.detailedDescription,
        musclesInvolved: exercise.musclesInvolved,
        executionTips: exercise.executionTips,
        optionalAlternative: exercise.optionalAlternative,
        suggestedImageTerms: exercise.suggestedImageTerms,
      })),
      cooldown: session.cooldown,
    })),
    additionalSuggestions: routine.additionalSuggestions,
    suggestedNextActions: routine.suggestedNextActions,
    inputParameters: routine.inputParameters,
    isFavorite: routine.isFavorite,
    tags: routine.tags?.map((t) => t.tag) || [],
    notes: routine.notes,
    lastAccessedAt: routine.lastAccessedAt,
    createdAt: routine.createdAt,
    updatedAt: routine.updatedAt,
  };
};

const transformCreateData = (
  data: CreateDailyWorkoutRoutineData,
  userId: string
) => {
  return {
    userId,
    routineName: data.routineData.nombreRutina,
    generalDescription: data.routineData.descripcionGeneral,
    warnings: data.routineData.advertencias,
    sessions: data.routineData.sesiones.map((session) => ({
      sessionName: session.nombreSesion,
      focus: session.enfoque,
      warmup: session.calentamiento,
      exercises: session.ejercicios.map((exercise) => ({
        exerciseName: exercise.nombreEjercicio,
        setsReps: exercise.seriesRepeticiones,
        rest: exercise.descanso,
        detailedDescription: exercise.descripcionDetallada,
        musclesInvolved: exercise.musculosImplicados,
        executionTips: exercise.consejosEjecucion,
        optionalAlternative: exercise.alternativaOpcional,
        suggestedImageTerms: exercise.imagenSugeridaTerminos,
      })),
      cooldown: session.enfriamiento,
    })),
    additionalSuggestions: data.routineData.sugerenciasAdicionales,
    suggestedNextActions: data.routineData.suggestedNextActions,
    inputParameters: {
      userInput: data.inputParameters.userInput,
      fitnessLevel: data.inputParameters.fitnessLevel,
      availableEquipment: data.inputParameters.availableEquipment,
      timePerSession: data.inputParameters.timePerSession,
      daysPerWeek: data.inputParameters.daysPerWeek,
    },
    isFavorite: data.isFavorite || false,
    tags: (data.tags || []).map((tag) => ({ tag })),
    notes: data.notes,
  };
};

export const dailyWorkoutRoutineService = {
  async getUserRoutines(userId: string): Promise<DailyWorkoutRoutine[]> {
    try {
      const queryObj = {
        where: {
          userId: { equals: userId },
        },
        limit: "50",
        sort: "-createdAt",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(
        `/api/daily-workout-routines${queryString}`
      );

      return response.data.docs.map(transformDailyWorkoutRoutine);
    } catch (error) {
      console.error(
        `Failed to fetch workout routines for userId ${userId}:`,
        error
      );
      throw error;
    }
  },

  async createRoutine(
    userId: string,
    routineData: CreateDailyWorkoutRoutineData
  ): Promise<DailyWorkoutRoutine> {
    try {
      const transformedData = transformCreateData(routineData, userId);

      const response = await apiClient.post(
        `/api/daily-workout-routines`,
        transformedData
      );

      return transformDailyWorkoutRoutine(response.data.doc);
    } catch (error) {
      console.error("Failed to create workout routine:", error);
      throw error;
    }
  },

  async getRoutineById(routineId: string): Promise<DailyWorkoutRoutine | null> {
    try {
      const response = await apiClient.get(
        `/api/daily-workout-routines/${routineId}`
      );

      return transformDailyWorkoutRoutine(response.data);
    } catch (error) {
      console.error(
        `Failed to fetch workout routine with id ${routineId}:`,
        error
      );
      return null;
    }
  },

  async updateRoutine(
    routineId: string,
    updates: Partial<DailyWorkoutRoutine>
  ): Promise<DailyWorkoutRoutine> {
    try {
      const updateData: any = { ...updates };
      if (updates.tags) {
        updateData.tags = updates.tags.map((tag) => ({ tag }));
      }

      const response = await apiClient.patch(
        `/api/daily-workout-routines/${routineId}`,
        updateData
      );

      return transformDailyWorkoutRoutine(response.data);
    } catch (error) {
      console.error("Failed to update workout routine:", error);
      throw error;
    }
  },

  async deleteRoutine(routineId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/daily-workout-routines/${routineId}`);
    } catch (error) {
      console.error("Failed to delete workout routine:", error);
      throw error;
    }
  },

  async toggleFavorite(
    routineId: string,
    isFavorite: boolean
  ): Promise<DailyWorkoutRoutine> {
    return this.updateRoutine(routineId, { isFavorite });
  },

  async updateNotes(
    routineId: string,
    notes: string
  ): Promise<DailyWorkoutRoutine> {
    return this.updateRoutine(routineId, { notes });
  },

  async updateLastAccessed(routineId: string): Promise<void> {
    try {
      await this.updateRoutine(routineId, {
        lastAccessedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn("Failed to update last accessed time:", error);
    }
  },

  async getRecentRoutines(
    userId: string,
    limit: number = 5
  ): Promise<DailyWorkoutRoutine[]> {
    const allRoutines = await this.getUserRoutines(userId);
    return allRoutines.slice(0, limit);
  },

  async getFavoriteRoutines(userId: string): Promise<DailyWorkoutRoutine[]> {
    const allRoutines = await this.getUserRoutines(userId);
    return allRoutines.filter((routine) => routine.isFavorite);
  },

  async searchRoutines(
    userId: string,
    searchTerm: string
  ): Promise<DailyWorkoutRoutine[]> {
    const allRoutines = await this.getUserRoutines(userId);
    const lowercaseSearch = searchTerm.toLowerCase();

    return allRoutines.filter(
      (routine) =>
        routine.routineName.toLowerCase().includes(lowercaseSearch) ||
        routine.generalDescription?.toLowerCase().includes(lowercaseSearch) ||
        routine.tags.some((tag) =>
          tag.toLowerCase().includes(lowercaseSearch)
        ) ||
        routine.sessions.some(
          (session) =>
            session.sessionName.toLowerCase().includes(lowercaseSearch) ||
            session.focus?.toLowerCase().includes(lowercaseSearch)
        )
    );
  },
};
