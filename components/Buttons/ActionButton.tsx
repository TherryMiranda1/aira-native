import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AiraColors, AiraColorsWithAlpha } from "@/constants/Colors";
import { AiraVariants } from "@/constants/Themes";

interface ActionButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
}

export const ActionButton = ({ onPress, icon }: ActionButtonProps) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <Ionicons name={icon} size={22} color={AiraColors.foreground} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: AiraVariants.tagRadius,
    backgroundColor: AiraColorsWithAlpha.backgroundWithOpacity(0.1),
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
    borderWidth: 1,
    borderColor: AiraColorsWithAlpha.borderWithOpacity(0.1),
  },
});
