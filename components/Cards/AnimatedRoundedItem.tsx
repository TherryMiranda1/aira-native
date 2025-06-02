import React, { useState, PropsWithChildren } from "react";
import { Image, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";

import Animated, {
  LinearTransition,
  SlideInRight,
  SlideOutLeft,
} from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import { PressableButton } from "../Buttons/PressableButton";
import { useThemesContext } from "@/context/ThemeContext";
import { buildDeleteBorderColor } from "@/utils/styles/buildBorderColor";
import { FontAwesome } from "@expo/vector-icons";
import { ICON_SIZES } from "@/constants/Icons";
import { Colors } from "@/constants/Colors";
import { useRealmNotes } from "@/infra/realm/services/useRealmNotes";
import { useDeleteGesture } from "@/hooks/useDeleteGesture";
import CardTags from "../Lists/CardTags";
import { formatDate } from "@/utils/formatDate";

interface ListItemProps {
  item: any;
  isOnTrash?: boolean;
  isSelectable?: boolean;
  isSelected?: boolean;
  showActions?: boolean;
  onSelect?: () => void;
  onDelete?: (item: any) => void;
}
export const AnimatedRoundedItem = ({
  item,
  isSelected,
  isSelectable = false,
  isOnTrash = false,
  showActions = true,
  onSelect,
  onDelete,
}: PropsWithChildren & ListItemProps) => {
  const { theme, variants } = useThemesContext();
  const { removeNote, toggleField } = useRealmNotes();
  const [isOnDeleteArea, setIsOnDeleteArea] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      return onDelete(item);
    }
    return isOnTrash
      ? removeNote(item.id)
      : toggleField(item.id, "isOnTrash", true);
  };

  const { deleteGesture, animatedDeleteStyle } = useDeleteGesture(
    () => handleDelete(),
    () => {
      setIsOnDeleteArea(true);
    },
    () => setIsOnDeleteArea(false)
  );

  return (
    <Animated.View
      exiting={SlideOutLeft}
      entering={SlideInRight}
      layout={LinearTransition.springify()}
    >
      <GestureDetector gesture={deleteGesture}>
        <Animated.View style={[animatedDeleteStyle]}>
          <PressableButton
            style={[
              styles.container,
              variants.card,
              buildDeleteBorderColor(theme, isOnDeleteArea),
            ]}
            onPress={() => {
              // @ts-ignore
              router.push(`/notes/${item.id}`);
            }}
          >
            {isSelectable && (
              <PressableButton style={{ padding: 8 }} onPress={onSelect}>
                <FontAwesome
                  name={isSelected ? "check" : "circle-thin"}
                  size={ICON_SIZES.MEDIUM}
                  color={Colors[theme].icon}
                />
              </PressableButton>
            )}
            {item.cover && (
              <Image source={{ uri: item.cover }} style={styles.image} />
            )}
            <ThemedView style={styles.itemContent}>
              <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
              <ThemedText type="small" numberOfLines={1} ellipsizeMode="tail">
                {item.content}
              </ThemedText>
              {item.categories && <CardTags data={item.categories} />}
            </ThemedView>

            <ThemedView style={styles.buttonsContent}>
              {item.updatedAt && (
                <ThemedText type="small">
                  {formatDate(item.updatedAt)}
                </ThemedText>
              )}
            </ThemedView>
          </PressableButton>
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 84,
    padding: 0,
    overflow: "hidden",
  },
  image: {
    width: "20%",
    height: "100%",
    objectFit: "cover",
  },
  itemContent: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    paddingLeft: 8,
    paddingBottom: 2,
  },
  buttonsContent: {
    padding: 4,
  },
});
