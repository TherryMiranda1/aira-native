import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Post } from "@/services/api/post.service";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MediaViewer } from "./MediaViewer";

interface PostItemProps {
  post: Post;
  onLike: (postId: string) => Promise<boolean>;
  onUnlike: (postId: string) => Promise<boolean>;
  onDelete?: (postId: string) => Promise<boolean>;
  onPress?: (postId: string) => void;
  showActions?: boolean;
}

export function PostItem({
  post,
  onLike,
  onUnlike,
  onDelete,
  showActions = true,
  onPress,
}: PostItemProps) {
  const [liked, setLiked] = useState(post.hasLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primary = useThemeColor({}, "primary");
  const muted = useThemeColor({}, "muted");
  const foreground = useThemeColor({}, "foreground");

  const handleLikePress = async () => {
    if (liked) {
      const success = await onUnlike(post.id);
      if (success) {
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      }
    } else {
      const success = await onLike(post.id);
      if (success) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }
  };

  const handleDeletePress = async () => {
    if (onDelete) {
      await onDelete(post.id);
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true, locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const handleMediaPress = (index: number) => {
    // Aquí se puede implementar la funcionalidad para ver la imagen/video a pantalla completa
    // Por ahora, solo navegamos al detalle del post
    onPress?.(post.id);
  };

  return (
    <ThemedView variant="secondary" style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.authorInfoContainer}
          onPress={() => onPress?.(post.id)}
          activeOpacity={0.7}
        >
          <View style={styles.avatarContainer}>
            {post.autor.avatar ? (
              <Image
                source={{ uri: post.autor.avatar }}
                style={styles.avatar}
              />
            ) : (
              <ThemedView variant="primary" style={styles.defaultAvatar}>
                <ThemedText style={styles.avatarText}>
                  {post.autor.nombre.substring(0, 1).toUpperCase()}
                </ThemedText>
              </ThemedView>
            )}
          </View>

          <View style={styles.headerInfo}>
            <ThemedText type="defaultSemiBold">{post.autor.nombre}</ThemedText>
            <ThemedText type="small" style={{ color: muted }}>
              {formatDate(post.createdAt)}
            </ThemedText>
          </View>
        </TouchableOpacity>

        {showActions && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <Feather name="more-vertical" size={20} color={foreground} />
            </TouchableOpacity>

            {isMenuOpen && (
              <ThemedView
                variant="secondary"
                style={styles.menuDropdown}
                border
              >
                {onDelete && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleDeletePress}
                  >
                    <Feather name="trash-2" size={16} color="red" />
                    <ThemedText style={styles.menuText}>Eliminar</ThemedText>
                  </TouchableOpacity>
                )}
              </ThemedView>
            )}
          </View>
        )}
      </View>

      <TouchableOpacity onPress={() => onPress?.(post.id)} activeOpacity={0.9}>
        <ThemedText style={styles.content}>{post.contenido}</ThemedText>
      </TouchableOpacity>

      {post.media && post.media.length > 0 && (
        <MediaViewer media={post.media} onMediaPress={handleMediaPress} />
      )}

      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <ThemedView
              key={`${post.id}-tag-${index}`}
              variant="primary"
              style={styles.tag}
            >
              <ThemedText style={styles.tagText}>{tag}</ThemedText>
            </ThemedView>
          ))}
        </View>
      )}

      {showActions && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleLikePress}
          >
            {liked ? (
              <AntDesign name="heart" size={20} color={primary} />
            ) : (
              <AntDesign name="hearto" size={20} color={foreground} />
            )}
            <ThemedText style={styles.actionText}>
              {likeCount > 0 ? likeCount : ""}
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onPress?.(post.id)}
          >
            <MaterialCommunityIcons
              name="comment-outline"
              size={20}
              color={foreground}
            />
            <ThemedText style={styles.actionText}>Comentar</ThemedText>
          </TouchableOpacity>
        </View>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    marginBottom: 16,
  },
  headerContainer: {
    flexDirection: "row",
    paddingHorizontal: 8,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  authorInfoContainer: {
    flexDirection: "row",
    flex: 1,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 16,
    color: "white",
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 8,
    marginBottom: 12,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 12,
    color: "white",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  actionText: {
    marginLeft: 6,
  },
  menuContainer: {
    position: "relative",
  },
  menuButton: {
    padding: 8,
  },
  menuDropdown: {
    position: "absolute",
    right: 0,
    top: 40,
    width: 120,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  menuText: {
    marginLeft: 8,
  },
});
