import { format, isSameDay, isToday } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AiraVariants } from "@/constants/Themes";
import { AiraColors } from "@/constants/Colors";
import { Event } from "@/services/api/event.service";

interface DayItemProps {
  date: Date;
  selectedDate: Date;
  onSelect: (date: Date) => void;
  events?: Event[];
}

export const DayItem: React.FC<DayItemProps> = ({
  date,
  selectedDate,
  onSelect,
  events = [],
}) => {
  const isSelected = isSameDay(date, selectedDate);
  const isCurrentDay = isToday(date);
  const hasEvents = events.length > 0;

  return (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => onSelect(date)}
    >
      <ThemedView
        style={[
          styles.dayContent,
          isSelected && styles.selectedDay,
          isCurrentDay && !isSelected && styles.todayDay,
        ]}
      >
        <ThemedText
          style={[
            styles.dayNumber,
            (isSelected || isCurrentDay) && styles.selectedText,
          ]}
          lightColor={
            isSelected || isCurrentDay
              ? AiraColors.background
              : AiraColors.foreground
          }
          darkColor={
            isSelected || isCurrentDay
              ? AiraColors.background
              : AiraColors.foreground
          }
        >
          {format(date, "dd", { locale: es })}
        </ThemedText>
        <ThemedText
          style={[
            styles.weekday,
            (isSelected || isCurrentDay) && styles.selectedText,
          ]}
          lightColor={
            isSelected || isCurrentDay
              ? AiraColors.background
              : AiraColors.foreground
          }
          darkColor={
            isSelected || isCurrentDay
              ? AiraColors.background
              : AiraColors.foreground
          }
        >
          {format(date, "EEE", { locale: es })}
        </ThemedText>
        {hasEvents && <View style={styles.eventIndicator} />}
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    alignItems: "center",
  },
  dayContent: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 4,
    borderRadius: AiraVariants.cardRadius,
    position: "relative",
  },
  selectedDay: {
    // Background color is handled by ThemedView props
  },
  todayDay: {
    // Background color is handled by ThemedView props
  },
  dayNumber: {
    fontSize: 16,
  },
  weekday: {
    fontSize: 12,
  },
  selectedText: {
    // Text color is handled by ThemedText props
  },
  eventIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AiraColors.primary,
    position: "absolute",
    bottom: 2,
    alignSelf: "center",
  },
});
