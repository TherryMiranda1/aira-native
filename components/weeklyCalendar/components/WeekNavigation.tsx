import { addWeeks } from "date-fns";
import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { WeekView } from "./WeekView";
import { Event } from "@/services/api/event.service";

interface WeekNavigationProps {
  currentWeekStart: Date;
  selectedDate: Date;
  onWeekChange: (newWeekStart: Date) => void;
  onDateSelect: (date: Date) => void;
  events?: Event[];
}

export const WeekNavigation: React.FC<WeekNavigationProps> = ({
  currentWeekStart,
  selectedDate,
  onWeekChange,
  onDateSelect,
  events = [],
}) => {
  const pagerRef = useRef<PagerView>(null);

  const handlePageSelected = (e: any) => {
    const position = e.nativeEvent.position;
    if (position === 0) {
      // Previous week
      const newWeekStart = addWeeks(currentWeekStart, -1);
      onWeekChange(newWeekStart);
      onDateSelect(addWeeks(selectedDate, -1));
      // Reset to middle page
      if (pagerRef.current) {
        pagerRef.current.setPage(1);
      }
    } else if (position === 2) {
      // Next week
      const newWeekStart = addWeeks(currentWeekStart, 1);
      onWeekChange(newWeekStart);
      onDateSelect(addWeeks(selectedDate, 1));
      // Reset to middle page
      if (pagerRef.current) {
        pagerRef.current.setPage(1);
      }
    }
  };

  return (
    <PagerView
      style={styles.pager}
      initialPage={1}
      scrollEnabled={true}
      orientation="horizontal"
      onPageSelected={handlePageSelected}
      ref={pagerRef}
    >
      {/* Previous week */}
      <View key="0">
        <WeekView
          weekStart={addWeeks(currentWeekStart, -1)}
          selectedDate={selectedDate}
          onSelectDate={onDateSelect}
          events={events}
        />
      </View>
      {/* Current week */}
      <View key="1">
        <WeekView
          weekStart={currentWeekStart}
          selectedDate={selectedDate}
          onSelectDate={onDateSelect}
          events={events}
        />
      </View>
      {/* Next week */}
      <View key="2">
        <WeekView
          weekStart={addWeeks(currentWeekStart, 1)}
          selectedDate={selectedDate}
          onSelectDate={onDateSelect}
          events={events}
        />
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pager: {
    height: 60,
    marginBottom: 8,
  },
});
