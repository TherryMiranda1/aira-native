import { Colors } from "@/constants/Colors";
import { MaterialIcons } from "@expo/vector-icons";
import { iconButtonStyles } from "./Button.styles";
import { PressableButton } from "./PressableButton";
import { ICON_SIZES } from "@/constants/Icons";
import { useThemesContext } from "@/context/ThemeContext";

interface Props {
  onClose?: () => void;
}

export const CloseButton = ({ onClose }: Props) => {
  const { theme } = useThemesContext();

  return (
    <PressableButton
      style={iconButtonStyles.button}
      onPress={() => {
        onClose?.();
      }}
    >
      <MaterialIcons
        name="close"
        size={ICON_SIZES.MEDIUM}
        color={Colors[theme].icon}
      />
    </PressableButton>
  );
};
