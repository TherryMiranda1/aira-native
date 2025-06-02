import { format, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AiraVariants } from "@/constants/Themes";
import { AiraColors } from "@/constants/Colors";

interface DayItemProps {
  date: Date;
  selectedDate: Date;
  onSelect: (date: Date) => void;
}

export const DayItem: React.FC<DayItemProps> = ({
  date,
  selectedDate,
  onSelect,
}) => {
  const isSelected = isSameDay(date, selectedDate);

  return (
    <TouchableOpacity
      style={styles.dayContainer}
      onPress={() => onSelect(date)}
    >
      <ThemedView
        style={[styles.dayContent, isSelected && styles.selectedDay]}
        lightColor={isSelected ? AiraColors.primary : AiraColors.card}
        darkColor={isSelected ? AiraColors.primary : AiraColors.card}
      >
        <ThemedText
          style={isSelected && styles.selectedText}
          lightColor={isSelected ? AiraColors.background : AiraColors.foreground}
          darkColor={isSelected ? AiraColors.background : AiraColors.foreground}
        >
          {format(date, "dd", { locale: es })}
        </ThemedText>
        <ThemedText
          style={[styles.weekday, isSelected && styles.selectedText]}
          lightColor={isSelected ? AiraColors.background : AiraColors.foreground}
          darkColor={isSelected ? AiraColors.background : AiraColors.foreground}
        >
          {format(date, "EEE", { locale: es })}
        </ThemedText>
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
  },
  selectedDay: {
    // Background color is handled by ThemedView props
  },
  weekday: {
    fontSize: 12,
  },
  selectedText: {
    // Text color is handled by ThemedText props
  },
});
