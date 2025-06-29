import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { StyleSheet, View, ActivityIndicator, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedScrollView } from "../../Views/ThemedScrollView";
import { Event } from "@/services/api/event.service";
import { EventItem } from "./EventItem";
import { AiraColors } from "@/constants/Colors";

interface EventListProps {
  selectedDate: Date;
  events: Event[];
  loading?: boolean;
  onToggleCompleted: (eventId: string, isCompleted: boolean) => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const EventList: React.FC<EventListProps> = ({
  selectedDate,
  events,
  loading = false,
  onToggleCompleted,
  onEditEvent,
  onDeleteEvent,
  onScroll,
}) => {
  return (
    <View style={styles.contentContainer}>
      <View style={styles.contentHeader}>
        <ThemedText type="small">
          {format(selectedDate, "dd 'de' MMMM yyyy", { locale: es })}
        </ThemedText>
      </View>

      <ThemedScrollView 
        style={styles.eventList}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={AiraColors.primary} />
            <ThemedText style={styles.loadingText}>
              Cargando eventos...
            </ThemedText>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyContainer}>
            <ThemedText
              style={styles.emptyText}
              lightColor={AiraColors.mutedForeground}
              darkColor={AiraColors.mutedForeground}
            >
              No hay eventos para este día.
            </ThemedText>
          </View>
        ) : (
          events.map((event) => (
            <EventItem
              key={event.id}
              event={event}
              onToggleCompleted={onToggleCompleted}
              onEdit={onEditEvent}
              onDelete={onDeleteEvent}
            />
          ))
        )}
      </ThemedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  contentHeader: {
    marginBottom: 15,
    paddingHorizontal: 8,
  },
  eventList: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: AiraColors.mutedForeground,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 16,
  },
}); 