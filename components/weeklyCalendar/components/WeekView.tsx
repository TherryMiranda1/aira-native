import { addDays } from "date-fns";
import React from "react";
import { StyleSheet, View } from "react-native";
import { DayItem } from "./DayItem";

interface WeekViewProps {
  weekStart: Date;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

// Generates an array of 7 dates for a given week start
const generateWeekDays = (weekStart: Date) => {
  return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
};

export const WeekView: React.FC<WeekViewProps> = ({
  weekStart,
  selectedDate,
  onSelectDate,
}) => {
  const days = generateWeekDays(weekStart);

  return (
    <View style={styles.weekContainer}>
      {days.map((date) => (
        <DayItem
          key={date.toISOString()}
          date={date}
          selectedDate={selectedDate}
          onSelect={onSelectDate}
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
