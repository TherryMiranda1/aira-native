import { addDays, isSameDay } from "date-fns";
import React from "react";
import { StyleSheet, View } from "react-native";
import { DayItem } from "./DayItem";
import { Event } from "@/services/api/event.service";

interface WeekViewProps {
  weekStart: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  events?: Event[];
}

// Generates an array of 7 dates for a given week start
const generateWeekDays = (weekStart: Date) => {
  return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
};

export const WeekView: React.FC<WeekViewProps> = ({
  weekStart,
  selectedDate,
  onSelectDate,
  events = [],
}) => {
  const days = generateWeekDays(weekStart);

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      // Filtrar eventos de actividades completadas automáticas
      if (["mood", "ritual", "challenge"].includes(event.eventType)) {
        const isActivityCompletion = event.metadata?.source && 
          ["mood-tracker", "ritual-completion", "challenge-completion"].includes(event.metadata.source);
        if (isActivityCompletion) return false;
      }
      return isSameDay(new Date(event.startTime), date);
    });
  };

  return (
    <View style={styles.weekContainer}>
      {days.map((date) => (
        <DayItem
          key={date.toISOString()}
          date={date}
          selectedDate={selectedDate}
          onSelect={onSelectDate}
          events={getEventsForDate(date)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  weekContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 4,
    gap: 2,
    paddingHorizontal: 2,
  },
});
