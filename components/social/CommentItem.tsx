import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Image, View } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Comment } from "@/services/api/post.service";
import { useThemeColor } from "@/hooks/useThemeColor";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string) => Promise<boolean>;
  onUnlike: (commentId: string) => Promise<boolean>;
  onDelete?: (commentId: string) => Promise<boolean>;
  isCurrentUserAuthor?: boolean;
}

export function CommentItem({
  comment,
  onLike,
  onUnlike,
  onDelete,
  isCurrentUserAuthor = false,
}: CommentItemProps) {
  const [liked, setLiked] = useState(comment.hasLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const primary = useThemeColor({}, "primary");
  const muted = useThemeColor({}, "muted");
  const foreground = useThemeColor({}, "foreground");

  const handleLikePress = async () => {
    if (liked) {
      const success = await onUnlike(comment.id);
      if (success) {
        setLiked(false);
        setLikeCount((prev) => Math.max(0, prev - 1));
      }
    } else {
      const success = await onLike(comment.id);
      if (success) {
        setLiked(true);
        setLikeCount((prev) => prev + 1);
      }
    }
  };

  const handleDeletePress = async () => {
    if (onDelete) {
      await onDelete(comment.id);
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

  return (
    <ThemedView variant="secondary" style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.avatarContainer}>
          {comment.autor.avatar ? (
            <Image
              source={{ uri: comment.autor.avatar }}
              style={styles.avatar}
            />
          ) : (
            <ThemedView variant="primary" style={styles.defaultAvatar}>
              <ThemedText style={styles.avatarText}>
                {comment.autor.nombre.substring(0, 1).toUpperCase()}
              </ThemedText>
            </ThemedView>
          )}
        </View>

        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <ThemedText type="defaultSemiBold">{comment.autor.nombre}</ThemedText>
            <ThemedText type="small" style={{ color: muted }}>
              {formatDate(comment.createdAt)}
            </ThemedText>
          </View>

          <ThemedText style={styles.commentText}>{comment.contenido}</ThemedText>

          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLikePress}
            >
              {liked ? (
                <AntDesign name="heart" size={16} color={primary} />
              ) : (
                <AntDesign name="hearto" size={16} color={foreground} />
              )}
              <ThemedText style={styles.actionText} type="small">
                {likeCount > 0 ? likeCount : ""}
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {(isCurrentUserAuthor || onDelete) && (
          <View style={styles.menuContainer}>
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <Feather name="more-vertical" size={18} color={foreground} />
            </TouchableOpacity>

            {isMenuOpen && (
              <ThemedView variant="secondary" style={styles.menuDropdown} border>
                {onDelete && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={handleDeletePress}
                  >
                    <Feather name="trash-2" size={14} color="red" />
                    <ThemedText style={styles.menuText} type="small">
                      Eliminar
                    </ThemedText>
                  </TouchableOpacity>
                )}
              </ThemedView>
            )}
          </View>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  headerContainer: {
    flexDirection: "row",
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  defaultAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    color: "white",
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: "column",
    marginBottom: 4,
  },
  commentText: {
    marginBottom: 8,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: "row",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
  },
  menuContainer: {
    position: "relative",
  },
  menuButton: {
    padding: 4,
  },
  menuDropdown: {
    position: "absolute",
    right: 0,
    top: 30,
    width: 100,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  menuText: {
    marginLeft: 6,
  },
}); 