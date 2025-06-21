import { apiClient } from "./apiClient";
import { stringify } from "qs-esm";

// Tipos base
export type RecurrenceType = "none" | "daily" | "weekly" | "monthly" | "custom";
export type EventType =
  | "personal"
  | "recipe"
  | "exercise"
  | "challenge"
  | "ritual"
  | "mood";
export type EventCategory =
  | "health"
  | "exercise"
  | "nutrition"
  | "medical"
  | "selfcare"
  | "work"
  | "personal"
  | "family"
  | "other";
export type EventPriority = "low" | "medium" | "high" | "urgent";
export type EventColor =
  | "purple"
  | "pink"
  | "blue"
  | "green"
  | "orange"
  | "red"
  | "yellow"
  | "gray";

export type MoodType =
  | "radiante"
  | "tranquila"
  | "reflexiva"
  | "cansada"
  | "sensible"
  | "neutral";

export interface MoodData {
  mood: MoodType;
  intensity?: number;
  triggers?: string;
}

// Tipos para referencias
export interface RecipeReference {
  id: string;
  titulo: string;
  ingrediente_principal: string;
  tiempo_preparacion: string;
  calorias: string;
  dificultad: string;
  categoria?: string;
}

export interface ExerciseReference {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_ejercicio: string;
  nivel_dificultad: string;
  grupos_musculares: string[];
  modalidad: string;
}

export interface ChallengeReference {
  id: string;
  title: string;
  description: string;
  categoria: string;
  dificultad: string;
  duration: string;
  icon: string;
}

export interface RitualReference {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  momento_recomendado?: string;
  duracion_total?: string;
  nivel_energia?: string;
}

// Interfaces del CMS
export interface EventFromCMS {
  id: string;
  userId: string;
  eventType: EventType;
  recipeReference?: RecipeReference;
  exerciseReference?: ExerciseReference;
  challengeReference?: ChallengeReference;
  ritualReference?: RitualReference;
  moodData?: MoodData;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay: boolean;
  recurrence: {
    type: RecurrenceType;
    interval?: number;
    daysOfWeek?: { day: string }[];
    dayOfMonth?: number;
    until?: string;
    count?: number;
  };
  exceptions: { date: string }[];
  category: EventCategory;
  priority: EventPriority;
  isCompleted: boolean;
  completedAt?: string;
  location?: string;
  reminder: {
    enabled: boolean;
    minutesBefore?: string;
  };
  tags: { tag: string }[];
  notes?: string;
  color: EventColor;
  metadata: {
    source: string;
    timezone: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Interfaces transformadas para la aplicación
export interface EventRecurrence {
  type: RecurrenceType;
  interval?: number;
  daysOfWeek?: string[]; // Array simple de números como strings
  dayOfMonth?: number;
  until?: string;
  count?: number;
}

export interface EventReminder {
  enabled: boolean;
  minutesBefore?: number;
}

export interface EventMetadata {
  source: string;
  timezone: string;
}

export interface Event {
  id: string;
  userId: string;
  eventType: EventType;
  recipeReference?: RecipeReference;
  exerciseReference?: ExerciseReference;
  challengeReference?: ChallengeReference;
  ritualReference?: RitualReference;
  moodData?: MoodData;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay: boolean;
  recurrence: EventRecurrence;
  exceptions: string[]; // Array simple de fechas
  category: EventCategory;
  priority: EventPriority;
  isCompleted: boolean;
  completedAt?: string;
  location?: string;
  reminder: EventReminder;
  tags: string[]; // Array simple de strings
  notes?: string;
  color: EventColor;
  metadata: EventMetadata;
  createdAt: string;
  updatedAt: string;
}

// Interface para crear eventos
export interface CreateEventData {
  userId: string;
  eventType?: EventType;
  recipeReference?: string; // ID de la receta
  exerciseReference?: string; // ID del ejercicio
  challengeReference?: string; // ID del challenge
  ritualReference?: string; // ID del ritual
  moodData?: MoodData;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay?: boolean;
  recurrence?: Partial<EventRecurrence>;
  category?: EventCategory;
  priority?: EventPriority;
  location?: string;
  reminder?: Partial<EventReminder>;
  tags?: string[];
  notes?: string;
  color?: EventColor;
  metadata?: Partial<EventMetadata>;
}

// Interface para actualizar eventos
export interface UpdateEventData {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  recurrence?: Partial<EventRecurrence>;
  category?: EventCategory;
  priority?: EventPriority;
  isCompleted?: boolean;
  location?: string;
  reminder?: Partial<EventReminder>;
  tags?: string[];
  notes?: string;
  color?: EventColor;
}

// Transformaciones entre CMS y App
const transformEvent = (cmsEvent: EventFromCMS): Event => {
  return {
    id: cmsEvent.id,
    userId: cmsEvent.userId,
    eventType: cmsEvent.eventType,
    recipeReference: cmsEvent.recipeReference,
    exerciseReference: cmsEvent.exerciseReference,
    challengeReference: cmsEvent.challengeReference,
    ritualReference: cmsEvent.ritualReference,
    moodData: cmsEvent.moodData,
    title: cmsEvent.title,
    description: cmsEvent.description,
    startTime: cmsEvent.startTime,
    endTime: cmsEvent.endTime,
    allDay: cmsEvent.allDay,
    recurrence: {
      type: cmsEvent.recurrence.type,
      interval: cmsEvent.recurrence.interval,
      daysOfWeek: cmsEvent.recurrence.daysOfWeek?.map((d) => d.day) || [],
      dayOfMonth: cmsEvent.recurrence.dayOfMonth,
      until: cmsEvent.recurrence.until,
      count: cmsEvent.recurrence.count,
    },
    exceptions: cmsEvent.exceptions.map((e) => e.date),
    category: cmsEvent.category,
    priority: cmsEvent.priority,
    isCompleted: cmsEvent.isCompleted,
    completedAt: cmsEvent.completedAt,
    location: cmsEvent.location,
    reminder: {
      enabled: cmsEvent.reminder.enabled,
      minutesBefore: cmsEvent.reminder.minutesBefore
        ? parseInt(cmsEvent.reminder.minutesBefore)
        : undefined,
    },
    tags: cmsEvent.tags.map((t) => t.tag),
    notes: cmsEvent.notes,
    color: cmsEvent.color,
    metadata: cmsEvent.metadata,
    createdAt: cmsEvent.createdAt,
    updatedAt: cmsEvent.updatedAt,
  };
};

const transformCreateData = (data: CreateEventData): any => {
  const transformed: any = {
    userId: data.userId,
    eventType: data.eventType || "personal",
    title: data.title,
    description: data.description,
    startTime: data.startTime,
    endTime: data.endTime,
    allDay: data.allDay || false,
    recurrence: {
      type: data.recurrence?.type || "none",
      interval: data.recurrence?.interval || 1,
      daysOfWeek: data.recurrence?.daysOfWeek?.map((day) => ({ day })) || [],
      dayOfMonth: data.recurrence?.dayOfMonth,
      until: data.recurrence?.until,
      count: data.recurrence?.count,
    },
    exceptions: [], // Inicialmente vacío
    category: data.category || "personal",
    priority: data.priority || "medium",
    isCompleted: false,
    location: data.location,
    reminder: {
      enabled: data.reminder?.enabled || false,
      minutesBefore: data.reminder?.minutesBefore?.toString(),
    },
    tags: data.tags?.map((tag) => ({ tag })) || [],
    notes: data.notes,
    color: data.color || "purple",
    metadata: {
      source: data.metadata?.source || "mood-tracker",
      timezone: data.metadata?.timezone || "America/Mexico_City",
    },
  };

  // Agregar referencias según el tipo de evento
  if (data.eventType === "recipe" && data.recipeReference) {
    transformed.recipeReference = data.recipeReference;
  }

  if (data.eventType === "exercise" && data.exerciseReference) {
    transformed.exerciseReference = data.exerciseReference;
  }

  if (data.eventType === "challenge" && data.challengeReference) {
    transformed.challengeReference = data.challengeReference;
  }

  if (data.eventType === "ritual" && data.ritualReference) {
    transformed.ritualReference = data.ritualReference;
  }

  if (data.eventType === "mood" && data.moodData) {
    transformed.moodData = data.moodData;
  }

  return transformed;
};

const transformUpdateData = (data: UpdateEventData): any => {
  const transformed: any = {};
  console.log(data);

  if (data.title !== undefined) transformed.title = data.title;
  if (data.description !== undefined)
    transformed.description = data.description;
  if (data.startTime !== undefined) transformed.startTime = data.startTime;
  if (data.endTime !== undefined) transformed.endTime = data.endTime;
  if (data.allDay !== undefined) transformed.allDay = data.allDay;
  if (data.category !== undefined) transformed.category = data.category;
  if (data.priority !== undefined) transformed.priority = data.priority;
  if (data.isCompleted !== undefined)
    transformed.isCompleted = data.isCompleted;
  if (data.location !== undefined) transformed.location = data.location;
  if (data.notes !== undefined) transformed.notes = data.notes;
  if (data.color !== undefined) transformed.color = data.color;

  if (data.recurrence) {
    transformed.recurrence = {};
    if (data.recurrence.type !== undefined)
      transformed.recurrence.type = data.recurrence.type;
    if (data.recurrence.interval !== undefined)
      transformed.recurrence.interval = data.recurrence.interval;
    if (data.recurrence.daysOfWeek !== undefined) {
      transformed.recurrence.daysOfWeek = data.recurrence.daysOfWeek.map(
        (day) => ({ day })
      );
    }
    if (data.recurrence.dayOfMonth !== undefined)
      transformed.recurrence.dayOfMonth = data.recurrence.dayOfMonth;
    if (data.recurrence.until !== undefined)
      transformed.recurrence.until = data.recurrence.until;
    if (data.recurrence.count !== undefined)
      transformed.recurrence.count = data.recurrence.count;
  }

  if (data.reminder) {
    transformed.reminder = {};
    if (data.reminder.enabled !== undefined)
      transformed.reminder.enabled = data.reminder.enabled;
    if (data.reminder.minutesBefore !== undefined) {
      transformed.reminder.minutesBefore =
        data.reminder.minutesBefore.toString();
    }
  }

  if (data.tags !== undefined) {
    transformed.tags = data.tags.map((tag) => ({ tag }));
  }

  return transformed;
};

// Utilidades para manejo de recurrencia
export const generateRecurrentEvents = (
  baseEvent: Event,
  startDate: Date,
  endDate: Date
): Event[] => {
  if (baseEvent.recurrence.type === "none") {
    // Solo devolver el evento si está en el rango
    const eventStart = new Date(baseEvent.startTime);
    if (eventStart >= startDate && eventStart <= endDate) {
      return [baseEvent];
    }
    return [];
  }

  const events: Event[] = [];
  const eventStart = new Date(baseEvent.startTime);
  const eventDuration = baseEvent.endTime
    ? new Date(baseEvent.endTime).getTime() - eventStart.getTime()
    : 60 * 60 * 1000; // 1 hora por defecto

  let currentDate = new Date(eventStart);
  const maxOccurrences = baseEvent.recurrence.count || 365; // Límite de seguridad
  let occurrenceCount = 0;

  while (currentDate <= endDate && occurrenceCount < maxOccurrences) {
    // Verificar si no está en excepciones
    const isException = baseEvent.exceptions.some((exceptionDate) => {
      const exception = new Date(exceptionDate);
      return exception.toDateString() === currentDate.toDateString();
    });

    if (!isException && currentDate >= startDate) {
      const eventEnd = new Date(currentDate.getTime() + eventDuration);

      events.push({
        ...baseEvent,
        id: `${baseEvent.id}_${currentDate.toISOString()}`,
        startTime: currentDate.toISOString(),
        endTime: eventEnd.toISOString(),
      });
    }

    // Calcular siguiente ocurrencia
    currentDate = getNextOccurrence(currentDate, baseEvent.recurrence);
    occurrenceCount++;

    // Verificar fecha límite de recurrencia
    if (baseEvent.recurrence.until) {
      const untilDate = new Date(baseEvent.recurrence.until);
      if (currentDate > untilDate) break;
    }
  }

  return events;
};

const getNextOccurrence = (
  currentDate: Date,
  recurrence: EventRecurrence
): Date => {
  const next = new Date(currentDate);
  const interval = recurrence.interval || 1;

  switch (recurrence.type) {
    case "daily":
      next.setDate(next.getDate() + interval);
      break;

    case "weekly":
      next.setDate(next.getDate() + 7 * interval);
      break;

    case "monthly":
      next.setMonth(next.getMonth() + interval);
      break;

    case "custom":
      if (recurrence.daysOfWeek && recurrence.daysOfWeek.length > 0) {
        // Encontrar el siguiente día de la semana
        const currentDay = next.getDay();
        const targetDays = recurrence.daysOfWeek.map((d) => parseInt(d)).sort();

        let nextDay = targetDays.find((day) => day > currentDay);
        if (!nextDay) {
          nextDay = targetDays[0];
          next.setDate(next.getDate() + 7 * interval); // Siguiente semana
        }

        const daysToAdd = nextDay - currentDay;
        next.setDate(next.getDate() + daysToAdd);
      }
      break;

    default:
      // Sin recurrencia, devolver fecha muy lejana para terminar el loop
      next.setFullYear(next.getFullYear() + 10);
  }

  return next;
};

// Servicio principal
export const eventService = {
  async getUserEvents(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Event[]> {
    try {
      let queryObj: any = {
        where: {
          userId: { equals: userId },
        },
        limit: "100",
        sort: "startTime",
      };

      // Si se especifican fechas, filtrar
      if (startDate && endDate) {
        queryObj.where = {
          ...queryObj.where,
          or: [
            // Eventos únicos en el rango
            {
              and: [
                { "recurrence.type": { equals: "none" } },
                { startTime: { greater_than_equal: startDate.toISOString() } },
                { startTime: { less_than_equal: endDate.toISOString() } },
              ],
            },
            // Eventos recurrentes que podrían tener ocurrencias en el rango
            {
              and: [
                { "recurrence.type": { not_equals: "none" } },
                {
                  or: [
                    {
                      "recurrence.until": {
                        greater_than_equal: startDate.toISOString(),
                      },
                    },
                    { "recurrence.until": { exists: false } },
                  ],
                },
              ],
            },
          ],
        };
      }

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/events${queryString}`);

      const events = response.data.docs.map(transformEvent);

      // Si hay fechas especificadas, generar eventos recurrentes
      if (startDate && endDate) {
        const allEvents: Event[] = [];

        for (const event of events) {
          if (event.recurrence.type === "none") {
            allEvents.push(event);
          } else {
            const recurrentEvents = generateRecurrentEvents(
              event,
              startDate,
              endDate
            );
            allEvents.push(...recurrentEvents);
          }
        }

        return allEvents.sort(
          (a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }

      return events;
    } catch (error) {
      console.error(`Failed to fetch events for userId ${userId}:`, error);
      return [];
    }
  },

  async getEventById(eventId: string): Promise<Event | null> {
    try {
      const response = await apiClient.get(`/api/events/${eventId}`);

      return transformEvent(response.data);
    } catch (error) {
      console.error(`Failed to fetch event ${eventId}:`, error);
      return null;
    }
  },

  async createEvent(eventData: CreateEventData): Promise<Event> {
    try {
      const transformedData = transformCreateData(eventData);

      const response = await apiClient.post(`/api/events`, transformedData);

      return transformEvent(response.data.doc);
    } catch (error) {
      console.error("Failed to create event:", error);
      throw error;
    }
  },

  async updateEvent(eventId: string, updates: UpdateEventData): Promise<Event> {
    try {
      const transformedData = transformUpdateData(updates);

      const response = await apiClient.patch(
        `/api/events/${eventId}`,
        transformedData
      );

      return transformEvent(response.data.doc);
    } catch (error) {
      console.error("Failed to update event:", error);
      throw error;
    }
  },

  async deleteEvent(eventId: string): Promise<void> {
    try {
      await apiClient.delete(`/api/events/${eventId}`);
    } catch (error) {
      console.error("Failed to delete event:", error);
      throw error;
    }
  },

  async toggleCompleted(eventId: string, isCompleted: boolean): Promise<Event> {
    return this.updateEvent(eventId, { isCompleted });
  },

  async addException(eventId: string, exceptionDate: string): Promise<Event> {
    try {
      const event = await this.getEventById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      const updatedExceptions = [...event.exceptions, exceptionDate];
      return this.updateEvent(eventId, { tags: event.tags }); // Hack: necesitamos actualizar algo para trigger la transformación
    } catch (error) {
      console.error("Failed to add exception:", error);
      throw error;
    }
  },

  async getEventsByCategory(
    userId: string,
    category: EventCategory
  ): Promise<Event[]> {
    try {
      const queryObj = {
        where: {
          and: [
            { userId: { equals: userId } },
            { category: { equals: category } },
          ],
        },
        limit: "50",
        sort: "startTime",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/events${queryString}`);

      return response.data.docs.map(transformEvent);
    } catch (error) {
      console.error(`Failed to fetch events for category ${category}:`, error);
      return [];
    }
  },

  async getUpcomingEvents(
    userId: string,
    limit: number = 10
  ): Promise<Event[]> {
    try {
      const now = new Date();
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30); // Próximos 30 días

      const events = await this.getUserEvents(userId, now, futureDate);

      return events
        .filter(
          (event) => new Date(event.startTime) >= now && !event.isCompleted
        )
        .slice(0, limit);
    } catch (error) {
      console.error("Failed to fetch upcoming events:", error);
      return [];
    }
  },

  async getPendingTasks(userId: string): Promise<Event[]> {
    try {
      const queryObj = {
        where: {
          and: [
            { userId: { equals: userId } },
            { isCompleted: { equals: false } },
          ],
        },
        limit: "50",
        sort: "startTime",
      };

      const queryString = stringify(queryObj, { addQueryPrefix: true });

      const response = await apiClient.get(`/api/events${queryString}`);

      return response.data.docs.map(transformEvent);
    } catch (error) {
      console.error("Failed to fetch pending tasks:", error);
      return [];
    }
  },

  // Métodos específicos para recetas y ejercicios
  async createRecipeEvent(
    userId: string,
    recipeId: string,
    recipeTitle: string,
    startTime: string,
    options?: {
      recurrence?: Partial<EventRecurrence>;
      location?: string;
      notes?: string;
    }
  ): Promise<Event> {
    const eventData: CreateEventData = {
      userId,
      eventType: "recipe",
      recipeReference: recipeId,
      title: `Cocinar: ${recipeTitle}`,
      description: `Preparar la receta: ${recipeTitle}`,
      startTime,
      category: "nutrition",
      priority: "medium",
      color: "orange",
      recurrence: options?.recurrence,
      location: options?.location || "Cocina",
      notes: options?.notes,
    };

    return this.createEvent(eventData);
  },

  async createExerciseEvent(
    userId: string,
    exerciseId: string,
    exerciseName: string,
    startTime: string,
    options?: {
      recurrence?: Partial<EventRecurrence>;
      location?: string;
      notes?: string;
    }
  ): Promise<Event> {
    const eventData: CreateEventData = {
      userId,
      eventType: "exercise",
      exerciseReference: exerciseId,
      title: `Entrenar: ${exerciseName}`,
      description: `Realizar ejercicio: ${exerciseName}`,
      startTime,
      category: "exercise",
      priority: "medium",
      color: "blue",
      recurrence: options?.recurrence,
      location: options?.location || "Gimnasio",
      notes: options?.notes,
    };

    return this.createEvent(eventData);
  },

  async createChallengeEvent(
    userId: string,
    challengeId: string,
    challengeTitle: string,
    startTime: string,
    options?: {
      recurrence?: Partial<EventRecurrence>;
      location?: string;
      notes?: string;
    }
  ): Promise<Event> {
    const eventData: CreateEventData = {
      userId,
      eventType: "challenge",
      challengeReference: challengeId,
      title: `Mini Reto: ${challengeTitle}`,
      description: `Completar el mini reto: ${challengeTitle}`,
      startTime,
      category: "health",
      priority: "medium",
      color: "purple",
      recurrence: options?.recurrence,
      location: options?.location || "Casa",
      notes: options?.notes,
    };

    return this.createEvent(eventData);
  },

  async createRitualEvent(
    userId: string,
    ritualId: string,
    ritualTitle: string,
    startTime: string,
    options?: {
      recurrence?: Partial<EventRecurrence>;
      location?: string;
      notes?: string;
    }
  ): Promise<Event> {
    const eventData: CreateEventData = {
      userId,
      eventType: "ritual",
      ritualReference: ritualId,
      title: `Ritual: ${ritualTitle}`,
      description: `Completar el ritual: ${ritualTitle}`,
      startTime,
      category: "health",
      priority: "medium",
      color: "purple",
      recurrence: options?.recurrence,
      location: options?.location || "Casa",
      notes: options?.notes,
    };

    return this.createEvent(eventData);
  },

  async createMoodEvent(
    userId: string,
    moodType: MoodType,
    intensity?: number,
    triggers?: string,
    notes?: string
  ): Promise<Event> {
    const moodLabels = {
      radiante: "Radiante",
      tranquila: "Tranquila",
      reflexiva: "Reflexiva",
      cansada: "Cansada",
      sensible: "Sensible",
      neutral: "Neutral",
    };

    const moodColors = {
      radiante: "yellow",
      tranquila: "green",
      reflexiva: "purple",
      cansada: "orange",
      sensible: "pink",
      neutral: "gray",
    };

    const eventData: CreateEventData = {
      userId,
      eventType: "mood",
      moodData: {
        mood: moodType,
        intensity,
        triggers,
      },
      title: `Estado emocional: ${moodLabels[moodType]}`,
      description: intensity ? `Intensidad: ${intensity}/10` : undefined,
      startTime: new Date().toISOString(),
      category: "selfcare",
      priority: "low",
      color: moodColors[moodType] as EventColor,
      notes,
      recurrence: { type: "none" },
      metadata: {
        timezone: "America/Mexico_City",
      },
    };

    return this.createEvent(eventData);
  },

  async getMoodEvents(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Event[]> {
    try {
      const events = await this.getUserEvents(userId, startDate, endDate);
      return events.filter((event) => event.eventType === "mood");
    } catch (error) {
      console.error("Failed to get mood events:", error);
      throw error;
    }
  },

  async recordCompletedRitual(
    userId: string,
    ritualId: string,
    ritualTitle: string,
    durationMinutes?: number,
    notes?: string
  ): Promise<Event> {
    const eventData: CreateEventData = {
      userId,
      eventType: "ritual",
      ritualReference: ritualId,
      title: `Ritual completado: ${ritualTitle}`,
      description: durationMinutes
        ? `Dedicaste ${durationMinutes} minutos a tu bienestar realizando este ritual`
        : `Completaste el ritual: ${ritualTitle}`,
      startTime: new Date().toISOString(),
      category: "selfcare",
      priority: "low",
      color: "purple",
      notes,
      recurrence: { type: "none" },
      metadata: {
        source: "ritual-completion",
        timezone: "America/Mexico_City",
      },
    };

    const createdEvent = await this.createEvent(eventData);
    // Marcar como completado después de crear
    return this.updateEvent(createdEvent.id, { isCompleted: true });
  },

  async recordCompletedChallenge(
    userId: string,
    challengeId: string,
    challengeTitle: string,
    durationMinutes?: number,
    notes?: string
  ): Promise<Event> {
    const eventData: CreateEventData = {
      userId,
      eventType: "challenge",
      challengeReference: challengeId,
      title: `Mini reto completado: ${challengeTitle}`,
      description: durationMinutes
        ? `Dedicaste ${durationMinutes} minutos completando este reto`
        : `Completaste el mini reto: ${challengeTitle}`,
      startTime: new Date().toISOString(),
      category: "health",
      priority: "low",
      color: "blue",
      notes,
      recurrence: { type: "none" },
      metadata: {
        source: "challenge-completion",
        timezone: "America/Mexico_City",
      },
    };

    const createdEvent = await this.createEvent(eventData);
    // Marcar como completado después de crear
    return this.updateEvent(createdEvent.id, { isCompleted: true });
  },

  async getActivityEvents(
    userId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Event[]> {
    try {
      const events = await this.getUserEvents(userId, startDate, endDate);
      return events.filter(
        (event) =>
          ["mood", "ritual", "challenge"].includes(event.eventType) &&
          event.metadata?.source &&
          [
            "mood-tracker",
            "ritual-completion",
            "challenge-completion",
          ].includes(event.metadata.source)
      );
    } catch (error) {
      console.error("Failed to get activity events:", error);
      throw error;
    }
  },
};
