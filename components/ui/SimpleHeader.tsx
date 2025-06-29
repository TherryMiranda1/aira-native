import React from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/components/ThemedText";
import { AiraColors } from "@/constants/Colors";

interface SimpleHeaderProps {
  title: string;
  onBack: () => void;
  showBack?: boolean;
  disabled?: boolean;
}

export const SimpleHeader: React.FC<SimpleHeaderProps> = ({
  title,
  onBack,
  showBack = true,
  disabled = false,
}) => {
  return (
    <View style={styles.header}>
      {showBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          disabled={disabled}
        >
          <Ionicons name="arrow-back" size={24} color={AiraColors.primary} />
        </TouchableOpacity>
      )}
      <ThemedText style={styles.headerTitle}>{title}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: AiraColors.border,
    backgroundColor: AiraColors.background,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
     
    color: AiraColors.foreground,
  },
}); 