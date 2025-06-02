import { Note } from "@/domain/Note";
import { ThemedView } from "../ThemedView";
import { sortByUpdatedAt } from "@/utils/sortByUpdatedAt";
import { FlatList } from "react-native-gesture-handler";
import { AnimatedRoundedItem } from "../Cards/AnimatedRoundedItem";
import { listStyles } from "./List.styles";


interface Props {
  data: Note[];
  isScrollable?: boolean;
  isOnTrash?: boolean;
  isSelectable?: boolean;
  selectedItems?: string[];
  showActions?: boolean;
  onSelect?: (item: Note) => void;
  onDelete?: (item: Note) => void;
}

export const AnimatedList = ({
  data,
  isOnTrash,
  isSelectable,
  selectedItems = [],
  isScrollable = true,
  showActions = true,
  onSelect,
  onDelete,
}: Props) => {
  return (
    <ThemedView style={[listStyles.container]}>
      <FlatList
        data={sortByUpdatedAt(data)}
        keyExtractor={(item) => `${item.id}`}
        scrollEnabled={isScrollable}
        keyboardShouldPersistTaps="always"
        contentContainerStyle={{ padding: 8, gap: 8 }}
        renderItem={({ item }) => (
          <AnimatedRoundedItem
            key={item.id}
            item={item}
            isOnTrash={isOnTrash}
            isSelectable={isSelectable}
            isSelected={selectedItems.includes(item.id)}
            showActions={showActions}
            onSelect={() => onSelect?.(item)}
            onDelete={onDelete}
          />
        )}
      />
    </ThemedView>
  );
};
