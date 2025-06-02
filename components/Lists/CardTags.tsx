import { StyleSheet } from "react-native";
import { Category } from "@/domain/Category";
import { CardTag } from "../Cards/CardTag";
import { ThemedScrollView } from "../Views/ThemedScrollView";

interface Props {
  data: Category[];
}

export default function CardTags({ data }: Props) {
  return (
    <ThemedScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 4, paddingVertical: 6 }}
      style={styles.container}
    >
      {data.map((tag: Category) => (
        <CardTag key={tag.id} tag={tag} />
      ))}
    </ThemedScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 4,
    gap: 8,
    width: "100%",
  },
});
