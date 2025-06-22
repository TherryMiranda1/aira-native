import { startOfWeek, endOfWeek, isSameDay } from "date-fns";
import React, { useState, useMemo, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { useEvents } from "@/hooks/services/useEvents";
import { Event, CreateEventData, UpdateEventData } from "@/services/api/event.service";
import { WeekNavigation, EventList, EventForm } from "./components";

const WeeklyCalendar: React.FC = () => {
  const today = new Date();
  const initialWeekStart = startOfWeek(today, { weekStartsOn: 1 });

  // State for calendar navigation
  const [currentWeekStart, setCurrentWeekStart] = useState(initialWeekStart);
  const [selectedDate, setSelectedDate] = useState(today);

  // Event form state
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Memoizar las fechas de la semana
  const { weekStart, weekEnd } = useMemo(() => {
    const start = startOfWeek(currentWeekStart, { weekStartsOn: 1 });
    const end = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
    return { weekStart: start, weekEnd: end };
  }, [currentWeekStart]);

  // Hook para datos de eventos
  const {
    events,
    loading,
    saving,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleCompleted,
  } = useEvents({
    startDate: weekStart,
    endDate: weekEnd,
    autoRefresh: false,
  });

  // Eventos del día seleccionado (excluyendo actividades completadas automáticas)
  const selectedDayEvents = useMemo(() => {
    return events
      .filter((event) => {
        // Filtrar eventos de actividades completadas (mood, ritual, challenge)
        if (["mood", "ritual", "challenge"].includes(event.eventType)) {
          const isActivityCompletion = event.metadata?.source && 
            ["mood-tracker", "ritual-completion", "challenge-completion"].includes(event.metadata.source);
          return !isActivityCompletion;
        }
        return true;
      })
      .filter((event) => isSameDay(new Date(event.startTime), selectedDate));
  }, [events, selectedDate]);

  // Handlers for event operations
  const handleAddEvent = useCallback(() => {
    setEditingEvent(null);
    setModalVisible(true);
  }, []);

  const handleEditEvent = useCallback((event: Event) => {
    setEditingEvent(event);
    setModalVisible(true);
  }, []);

  const handleSaveEvent = useCallback(async (eventData: Partial<CreateEventData | UpdateEventData>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData as UpdateEventData);
      } else {
        await createEvent(eventData as Omit<CreateEventData, "userId">);
      }
      setModalVisible(false);
      setEditingEvent(null);
    } catch (error) {
      console.error("Error saving event:", error);
    }
  }, [editingEvent, updateEvent, createEvent]);

  const handleToggleCompleted = useCallback(async (eventId: string, isCompleted: boolean) => {
    try {
      await toggleCompleted(eventId, isCompleted);
    } catch (error) {
      console.error("Error toggling event completion:", error);
    }
  }, [toggleCompleted]);

  const handleDeleteEvent = useCallback(async (eventId: string) => {
    try {
      await deleteEvent(eventId);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }, [deleteEvent]);

  const handleWeekChange = useCallback((newWeekStart: Date) => {
    setCurrentWeekStart(newWeekStart);
  }, []);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
  }, []);

  return (
    <View style={styles.container}>
      {/* Week navigation component */}
      <WeekNavigation
        currentWeekStart={currentWeekStart}
        selectedDate={selectedDate}
        onWeekChange={handleWeekChange}
        onDateSelect={handleDateSelect}
        events={events}
      />

      {/* Event list component */}
      <EventList
        selectedDate={selectedDate}
        events={selectedDayEvents}
        loading={loading}
        onAddEvent={handleAddEvent}
        onToggleCompleted={handleToggleCompleted}
        onEditEvent={handleEditEvent}
        onDeleteEvent={handleDeleteEvent}
      />

      {/* Event form modal */}
      <EventForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        saving={saving}
        initialEvent={editingEvent || undefined}
        selectedDate={selectedDate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default WeeklyCalendar;
