import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  RefreshControl,
  FlatList,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

import { PostItem } from "@/components/social/PostItem";
import { CommentItem } from "@/components/social/CommentItem";
import { CreateCommentInput } from "@/components/social/CreateCommentInput";
import { usePosts } from "@/hooks/services/usePosts";
import { EmptyState } from "@/components/States/EmptyState";
import { ThemedText } from "@/components/ThemedText";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { PostDetailSkeleton } from "@/components/ui/FeedSkeleton";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const backgroundColor = useThemeColor({}, "background");
  const [refreshing, setRefreshing] = useState(false);

  const {
    post,
    comments,
    loading,
    commentsPagination,
    fetchPostById,
    fetchCommentsByPostId,
    loadMoreComments,
    createComment,
    likePost,
    unlikePost,
    likeComment,
    unlikeComment,
    deleteComment,
  } = usePosts();

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    if (!id) return;

    await fetchPostById(id);
    await fetchCommentsByPostId(id);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleLoadMoreComments = () => {
    if (commentsPagination.hasNextPage && !loading && id) {
      loadMoreComments(id);
    }
  };

  const renderCommentItem = ({ item }: { item: any }) => (
    <CommentItem
      comment={item}
      onLike={likeComment}
      onUnlike={unlikeComment}
      onDelete={deleteComment}
    />
  );

  const renderCommentsEmpty = () => {
    if (loading) return null;

    return (
      <EmptyState
        title="Sin comentarios"
        description="Sé el primero en comentar esta publicación"
      />
    );
  };

  if (loading && !post) {
    return (
      <PageView>
        <Topbar showBackButton={true} title="" />
        <PostDetailSkeleton />
      </PageView>
    );
  }

  if (!post) {
    return (
      <EmptyState
        title="Publicación no encontrada"
        description="La publicación que buscas no existe o ha sido eliminada"
      />
    );
  }

  return (
    <PageView>
      <KeyboardAvoidingView
        style={[styles.container, { backgroundColor }]}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <Topbar showBackButton={true} title="" />
        <View style={styles.contentContainer}>
          <FlatList
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={() => (
              <View style={styles.postContainer}>
                <PostItem
                  post={post}
                  onLike={likePost}
                  onUnlike={unlikePost}
                  showActions={false}
                />

                <ThemedText type="defaultSemiBold">Comentarios</ThemedText>
              </View>
            )}
            ListEmptyComponent={renderCommentsEmpty}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
              />
            }
            onEndReached={handleLoadMoreComments}
            onEndReachedThreshold={0.5}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <CreateCommentInput
          postId={id}
          onCommentCreated={() => {}}
          onSubmit={createComment}
        />
      </KeyboardAvoidingView>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  postContainer: {
    marginBottom: 8,
  },
  listContent: {
    flexGrow: 1,
    paddingVertical: 16,
  },
});
