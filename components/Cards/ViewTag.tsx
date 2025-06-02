import { StyleSheet } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PressableButton } from "@/components/Buttons/PressableButton";
import { useThemesContext } from "@/context/ThemeContext";
import { DEFAULT_TAGS } from "@/constants/Tags";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { ICON_SIZES } from "@/constants/Icons";
import { Colors } from "@/constants/Colors";

interface Props<T> {
  tag: T & { id: string; title: string };
  isSelected: boolean;
  onSelect: (item: T) => void;
}
export const ViewTag = <_, T>({ tag, isSelected, onSelect }: Props<T>) => {
  const { variants, theme } = useThemesContext();
  const color = useThemeColor({}, "backgroundSecondary");
  const selectedColor = useThemeColor({}, "tint");

  const backgroundColor = isSelected ? selectedColor : color;

  const rendeContent = () => {
    if (tag.title == DEFAULT_TAGS[1].title) {
      return (
        <MaterialIcons
          name={"label-important"}
          size={ICON_SIZES.SMALL}
          color={Colors[theme].text}
        />
      );
    }

    if (tag.title == DEFAULT_TAGS[2].title) {
      return (
        <Entypo
          name={"images"}
          size={ICON_SIZES.MEDIUM}
          color={Colors[theme].text}
        />
      );
    }

    return <ThemedText>{tag.title}</ThemedText>;
  };

  return (
    <PressableButton
      style={[{ ...styles.button, backgroundColor }, variants.selectableTag]}
      onPress={() => onSelect(tag)}
    >
      {rendeContent()}
    </PressableButton>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
    paddingHorizontal: 12,
  },
});
