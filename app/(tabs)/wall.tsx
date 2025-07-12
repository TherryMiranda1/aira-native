import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { PostItem } from "@/components/social/PostItem";
import { CreatePostModal } from "@/components/modals/CreatePostModal";
import { usePosts } from "@/hooks/services/usePosts";
import { useThemeColor } from "@/hooks/useThemeColor";
import { EmptyState } from "@/components/States/EmptyState";
import { PageView } from "@/components/ui/PageView";
import { Topbar } from "@/components/ui/Topbar";
import { ProfileButton } from "@/components/ui/ProfileButton";
import { PostsSkeleton } from "@/components/ui/FeedSkeleton";
import { ThemedGradient } from "@/components/ThemedGradient";
import { AiraVariants } from "@/constants/Themes";
import { router } from "expo-router";

export default function MuroScreen() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const muted = useThemeColor({}, "muted");

  const {
    posts,
    loading,
    refreshing,
    pagination,
    fetchPosts,
    loadMorePosts,
    refreshPosts,
    likePost,
    unlikePost,
    deletePost,
  } = usePosts();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleRefresh = () => {
    refreshPosts();
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !loading) {
      loadMorePosts();
    }
  };

  const handleCreatePost = () => {
    refreshPosts();
    setIsCreateModalVisible(false);
  };

  const handlePostPress = (postId: string) => {
    router.push(`/dashboard/post/${postId}`);
  };

  const renderItem = ({ item }: { item: any }) => (
    <PostItem
      post={item}
      onLike={likePost}
      onUnlike={unlikePost}
      onDelete={deletePost}
      onPress={handlePostPress}
    />
  );

  const renderEmpty = () => {
    if (loading) return null;

    return (
      <EmptyState
        title="No hay publicaciones"
        description="Sé el primero en compartir algo con la comunidad"
      />
    );
  };

  if (loading && posts.length === 0) {
    return (
      <PageView safeAreaBottom={false}>
        <Topbar title="Muro" actions={<ProfileButton />} />
        <PostsSkeleton />
      </PageView>
    );
  }

  return (
    <PageView safeAreaBottom={false}>
      <Topbar title="Muro" actions={<ProfileButton />} />
      <ThemedGradient>
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />

        <CreatePostModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onPostCreated={handleCreatePost}
        />
      </ThemedGradient>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: muted }]}
        onPress={() => setIsCreateModalVisible(true)}
      >
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
    </PageView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 80,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 8,
    width: 56,
    height: 56,
    borderRadius: AiraVariants.cardRadius,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
