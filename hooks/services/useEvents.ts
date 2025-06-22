import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  eventService,
  Event,
  CreateEventData,
  UpdateEventData,
  EventCategory,
  generateRecurrentEvents,
} from "@/services/api/event.service";

interface UseEventsOptions {
  startDate?: Date;
  endDate?: Date;
  category?: EventCategory;
  autoRefresh?: boolean;
  refreshInterval?: number; // Intervalo en milisegundos (default: 5 minutos)
}

export const useEvents = (options: UseEventsOptions = {}) => {
  const { user } = useUser();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Usar refs para estabilizar las opciones y evitar re-renders innecesarios
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Memoizar las fechas para evitar comparaciones innecesarias
  const dateRange = useMemo(() => {
    return {
      startDate: options.startDate?.toISOString(),
      endDate: options.endDate?.toISOString(),
      category: options.category,
    };
  }, [
    options.startDate?.getTime(),
    options.endDate?.getTime(),
    options.category,
  ]);

  const loadEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const currentOptions = optionsRef.current;
      let userEvents: Event[];

      if (currentOptions.category) {
        userEvents = await eventService.getEventsByCategory(
          user.id,
          currentOptions.category
        );
      } else {
        userEvents = await eventService.getUserEvents(
          user.id,
          currentOptions.startDate,
          currentOptions.endDate
        );
      }

      setEvents(userEvents);
    } catch (err) {
      setError("Error al cargar los eventos");
      console.error("Failed to load events:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createEvent = useCallback(
    async (eventData: Omit<CreateEventData, "userId">) => {
      if (!user?.id) {
        throw new Error("Usuario no autenticado");
      }

      try {
        setSaving(true);
        setError(null);

        const newEvent = await eventService.createEvent({
          ...eventData,
          userId: user.id,
        });

        setEvents((prev) => {
          const updated = [newEvent, ...prev];
          return updated.sort(
            (a, b) =>
              new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
          );
        });

        return newEvent;
      } catch (err) {
        setError("Error al crear el evento");
        console.error("Failed to create event:", err);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    [user?.id]
  );

  const updateEvent = useCallback(
    async (eventId: string, updates: UpdateEventData) => {
      try {
        setSaving(true);
        setError(null);

        const updatedEvent = await eventService.updateEvent(eventId, updates);
        setEvents((prev) =>
          prev.map((event) => (event.id === eventId ? updatedEvent : event))
        );

        return updatedEvent;
      } catch (err) {
        setError("Error al actualizar el evento");
        console.error("Failed to update event:", err);
        throw err;
      } finally {
        setSaving(false);
      }
    },
    []
  );

  const deleteEvent = useCallback(async (eventId: string) => {
    try {
      setSaving(true);
      setError(null);

      await eventService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event.id !== eventId));
    } catch (err) {
      setError("Error al eliminar el evento");
      console.error("Failed to delete event:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, []);

  const toggleCompleted = useCallback(
    async (eventId: string, isCompleted: boolean) => {
      try {
        const updatedEvent = await eventService.toggleCompleted(
          eventId,
          isCompleted
        );
        setEvents((prev) =>
          prev.map((event) => (event.id === eventId ? updatedEvent : event))
        );

        return updatedEvent;
      } catch (err) {
        setError("Error al actualizar el estado del evento");
        console.error("Failed to toggle completed:", err);
        throw err;
      }
    },
    []
  );

  const addException = useCallback(
    async (eventId: string, exceptionDate: string) => {
      try {
        const updatedEvent = await eventService.addException(
          eventId,
          exceptionDate
        );
        setEvents((prev) =>
          prev.map((event) => (event.id === eventId ? updatedEvent : event))
        );

        return updatedEvent;
      } catch (err) {
        setError("Error al añadir excepción");
        console.error("Failed to add exception:", err);
        throw err;
      }
    },
    []
  );

  // Funciones de utilidad memoizadas
  const getEventsByDate = useCallback(
    (date: Date): Event[] => {
      const targetDate = date.toDateString();
      return events.filter((event) => {
        const eventDate = new Date(event.startTime).toDateString();
        return eventDate === targetDate;
      });
    },
    [events]
  );

  const getUpcomingEvents = useCallback(
    (limit: number = 5): Event[] => {
      const now = new Date();
      return events
        .filter(
          (event) => new Date(event.startTime) >= now && !event.isCompleted
        )
        .slice(0, limit);
    },
    [events]
  );

  const getPendingTasks = useCallback((): Event[] => {
    return events.filter((event) => !event.isCompleted);
  }, [events]);

  const getEventsByCategory = useCallback(
    (category: EventCategory): Event[] => {
      return events.filter((event) => event.category === category);
    },
    [events]
  );

  const getEventsByPriority = useCallback(
    (priority: string): Event[] => {
      return events.filter((event) => event.priority === priority);
    },
    [events]
  );

  const getTodayEvents = useCallback((): Event[] => {
    return getEventsByDate(new Date());
  }, [getEventsByDate]);

  const getThisWeekEvents = useCallback((): Event[] => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return eventDate >= startOfWeek && eventDate <= endOfWeek;
    });
  }, [events]);

  const getEventsForCalendar = useCallback(
    (startDate: Date, endDate: Date): Event[] => {
      const calendarEvents: Event[] = [];

      for (const event of events) {
        if (event.recurrence.type === "none") {
          const eventStart = new Date(event.startTime);
          if (eventStart >= startDate && eventStart <= endDate) {
            calendarEvents.push(event);
          }
        } else {
          const recurrentEvents = generateRecurrentEvents(
            event,
            startDate,
            endDate
          );
          calendarEvents.push(...recurrentEvents);
        }
      }

      return calendarEvents.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    },
    [events]
  );

  const getEventStats = useCallback(() => {
    const total = events.length;
    const completed = events.filter((e) => e.isCompleted).length;
    const pending = total - completed;
    const upcoming = getUpcomingEvents().length;
    const overdue = events.filter((e) => {
      const eventDate = new Date(e.startTime);
      return eventDate < new Date() && !e.isCompleted;
    }).length;

    const byCategory = events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {} as Record<EventCategory, number>);

    const byPriority = events.reduce((acc, event) => {
      acc[event.priority] = (acc[event.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      completed,
      pending,
      upcoming,
      overdue,
      byCategory,
      byPriority,
    };
  }, [events, getUpcomingEvents]);

  // Cargar eventos inicialmente y cuando cambien las dependencias clave
  useEffect(() => {
    if (user?.id) {
      loadEvents();
    }
  }, [
    user?.id,
    dateRange.startDate,
    dateRange.endDate,
    dateRange.category,
    loadEvents,
  ]);

  // Auto-refresh opcional con intervalo más largo
  useEffect(() => {
    if (options.autoRefresh && user?.id) {
      const refreshInterval = options.refreshInterval || 300000; // 5 minutos por defecto
      const interval = setInterval(loadEvents, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [options.autoRefresh, options.refreshInterval, user?.id, loadEvents]);

  return {
    // Estado
    events,
    loading,
    error,
    saving,

    // Operaciones CRUD
    createEvent,
    updateEvent,
    deleteEvent,
    toggleCompleted,
    addException,

    // Funciones de utilidad
    getEventsByDate,
    getUpcomingEvents,
    getPendingTasks,
    getEventsByCategory,
    getEventsByPriority,
    getTodayEvents,
    getThisWeekEvents,
    getEventsForCalendar,
    getEventStats,

    // Control
    refetch: loadEvents,
  };
};

// Hook especializado para eventos del día actual
export const useTodayEvents = () => {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const tomorrow = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + 1);
    return date;
  }, [today]);

  return useEvents({
    startDate: today,
    endDate: tomorrow,
    autoRefresh: false, // Desactivar para evitar exceso de peticiones
  });
};

// Hook especializado para eventos de la semana
export const useWeekEvents = () => {
  const { startOfWeek, endOfWeek } = useMemo(() => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { startOfWeek: start, endOfWeek: end };
  }, []);

  return useEvents({
    startDate: startOfWeek,
    endDate: endOfWeek,
    autoRefresh: false, // Desactivar para evitar exceso de peticiones
  });
};

// Hook especializado para tareas pendientes
export const usePendingTasks = () => {
  const { user } = useUser();
  const [tasks, setTasks] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPendingTasks = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const pendingTasks = await eventService.getPendingTasks(user.id);
      setTasks(pendingTasks);
    } catch (err) {
      setError("Error al cargar las tareas pendientes");
      console.error("Failed to load pending tasks:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const toggleTaskCompleted = useCallback(
    async (taskId: string, isCompleted: boolean) => {
      try {
        const updatedTask = await eventService.toggleCompleted(
          taskId,
          isCompleted
        );
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task))
        );
        return updatedTask;
      } catch (err) {
        console.error("Failed to toggle task:", err);
        throw err;
      }
    },
    []
  );

  // Cargar tareas inicialmente
  useEffect(() => {
    if (user?.id) {
      loadPendingTasks();
    }
  }, [user?.id, loadPendingTasks]);

  // Auto-refresh menos frecuente para tareas pendientes
  useEffect(() => {
    if (user?.id) {
      const interval = setInterval(loadPendingTasks, 600000); // 10 minutos
      return () => clearInterval(interval);
    }
  }, [user?.id, loadPendingTasks]);

  return {
    tasks,
    loading,
    error,
    toggleTaskCompleted,
    refetch: loadPendingTasks,
  };
};

// Hook especializado para eventos de mood
export const useMoodEvents = (options: UseEventsOptions = {}) => {
  const { user } = useUser();
  const [moodEvents, setMoodEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoodEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const events = await eventService.getMoodEvents(
        user.id,
        options.startDate,
        options.endDate
      );

      setMoodEvents(events);
    } catch (err) {
      setError("Error al cargar el historial emocional");
      console.error("Failed to load mood events:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, options.startDate?.getTime(), options.endDate?.getTime()]);

  useEffect(() => {
    if (user?.id) {
      loadMoodEvents();
    }
  }, [user?.id, loadMoodEvents]);

  const getMoodsByDate = useCallback(
    (date: Date): Event[] => {
      const targetDate = date.toDateString();
      return moodEvents.filter((event) => {
        const eventDate = new Date(event.startTime).toDateString();
        return eventDate === targetDate;
      });
    },
    [moodEvents]
  );

  const getTodayMoods = useCallback((): Event[] => {
    return getMoodsByDate(new Date());
  }, [getMoodsByDate]);

  const getMoodStats = useCallback(() => {
    const total = moodEvents.length;
    const moodCounts = moodEvents.reduce((acc, event) => {
      if (event.moodData?.mood) {
        acc[event.moodData.mood] = (acc[event.moodData.mood] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      moodCounts,
      lastEntry: moodEvents[0], // Eventos ordenados por fecha más reciente
    };
  }, [moodEvents]);

  return {
    moodEvents,
    loading,
    error,
    getMoodsByDate,
    getTodayMoods,
    getMoodStats,
    refetch: loadMoodEvents,
  };
};

// Hook especializado para todas las actividades completadas (moods, rituales, retos)
export const useActivityEvents = (options: UseEventsOptions = {}) => {
  const { user } = useUser();
  const [activityEvents, setActivityEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadActivityEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      const events = await eventService.getActivityEvents(
        user.id,
        options.startDate,
        options.endDate
      );

      setActivityEvents(events);
    } catch (err) {
      setError("Error al cargar el historial de actividades");
      console.error("Failed to load activity events:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id, options.startDate?.getTime(), options.endDate?.getTime()]);

  useEffect(() => {
    if (user?.id) {
      loadActivityEvents();
    }
  }, [user?.id, loadActivityEvents]);

  const getActivitiesByDate = useCallback(
    (date: Date): Event[] => {
      const targetDate = date.toDateString();
      return activityEvents.filter((event) => {
        const eventDate = new Date(event.startTime).toDateString();
        return eventDate === targetDate;
      });
    },
    [activityEvents]
  );

  const getTodayActivities = useCallback((): Event[] => {
    return getActivitiesByDate(new Date());
  }, [getActivitiesByDate]);

  const getActivityStats = useCallback(() => {
    const total = activityEvents.length;
    const moodCount = activityEvents.filter(
      (e) => e.eventType === "mood"
    ).length;
    const ritualCount = activityEvents.filter(
      (e) => e.eventType === "ritual"
    ).length;
    const challengeCount = activityEvents.filter(
      (e) => e.eventType === "challenge"
    ).length;

    const typeDistribution = {
      moods: moodCount,
      rituales: ritualCount,
      retos: challengeCount,
    };

    return {
      total,
      typeDistribution,
      lastEntry: activityEvents[0], // Eventos ordenados por fecha más reciente
    };
  }, [activityEvents]);

  return {
    activityEvents,
    loading,
    error,
    getActivitiesByDate,
    getTodayActivities,
    getActivityStats,
    refetch: loadActivityEvents,
  };
};
