import React, { useCallback, useRef, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  ViewToken,
  TouchableOpacity,
} from "react-native";
import { Video, ResizeMode } from "expo-av";

const { width: screenWidth } = Dimensions.get("window");

interface MediaItem {
  tipo: "imagen" | "video";
  url: string;
  descripcion?: string;
}

interface MediaViewerProps {
  media: MediaItem[];
  onMediaPress?: (index: number) => void;
}

export function MediaViewer({ media, onMediaPress }: MediaViewerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index || 0);
      }
    },
    []
  );

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderMediaItem = useCallback(
    ({ item, index }: { item: MediaItem; index: number }) => {
      const handlePress = () => {
        if (onMediaPress) {
          onMediaPress(index);
        }
      };

      return (
        <TouchableOpacity
          activeOpacity={onMediaPress ? 0.9 : 1}
          onPress={(e) => {
            e.stopPropagation();
            handlePress();
          }}
          style={styles.mediaItemContainer}
        >
          {item.tipo === "imagen" ? (
            <Image
              source={{ uri: item.url }}
              style={styles.mediaItem}
              resizeMode="cover"
            />
          ) : (
            <Video
              source={{ uri: item.url }}
              style={styles.mediaItem}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
            />
          )}
        </TouchableOpacity>
      );
    },
    [onMediaPress]
  );

  // Si no hay elementos multimedia, no renderizar nada
  if (!media || media.length === 0) {
    return null;
  }

  // Si solo hay un elemento multimedia, no necesitamos un carrusel
  if (media.length === 1) {
    return renderMediaItem({ item: media[0], index: 0 });
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={media}
        renderItem={renderMediaItem}
        keyExtractor={(_, index) => `media-item-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        snapToInterval={screenWidth}
        decelerationRate="fast"
        scrollEventThrottle={16}
      />

      {media.length > 1 && (
        <View style={styles.pagination}>
          {media.map((_, index) => (
            <View
              key={`dot-${index}`}
              style={[
                styles.paginationDot,
                index === activeIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 4,
  },
  mediaItemContainer: {
    width: screenWidth,
  },
  mediaItem: {
    width: "100%",
    aspectRatio: 16 / 9,
    objectFit: "contain",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#ffffff",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
