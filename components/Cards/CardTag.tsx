import { StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { PressableButton } from "../Buttons/PressableButton";
import { useThemesContext } from "@/context/ThemeContext";
import { Colors } from "@/constants/Colors";

export const CardTag = ({ tag }: any) => {
  const { variants, theme } = useThemesContext();

  return (
    <PressableButton
      style={[
        { backgroundColor: Colors[theme].tint },
        styles.button,
        variants.selectableTag,
      ]}
      onPress={() => ""}
    >
      <ThemedText type="small">{tag.title}</ThemedText>
    </PressableButton>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
  },
});
