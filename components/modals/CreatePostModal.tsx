import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";

import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedInput } from "../ThemedInput";
import { AiraVariants } from "@/constants/Themes";
import { ModalView } from "./ModalView";
import { useToastHelpers } from "../ui/ToastSystem";
import { usePosts } from "@/hooks/services/usePosts";
import { useCustomerContext } from "@/context/CustomerContext";
import { MediaUploader } from "../ui/MediaUploader";
import {
  useMedia,
  MediaItem,
  ExternalMediaItem,
} from "@/hooks/services/useMedia";

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

export function CreatePostModal({
  visible,
  onClose,
  onPostCreated,
}: CreatePostModalProps) {
  const { createPost } = usePosts();
  const { customer } = useCustomerContext();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { showErrorToast } = useToastHelpers();
  const primary = useThemeColor({}, "primary");
  const foreground = useThemeColor({}, "foreground");

  // Usar el hook useMedia para manejar la subida de archivos
  const {
    media,
    isUploading,
    uploadAllMedia,
    getMediaForCMS,
    clearMedia,
    removeMedia,
    pickImage,
    pickVideo,
    pickFromCamera,
    uploadProgress,
  } = useMedia();

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!content.trim()) {
      return;
    }

    if (!customer) {
      showErrorToast("Debes iniciar sesión para crear una publicación");
      return;
    }

    try {
      setIsLoading(true);

      // Crear la publicación con las URLs de Cloudinary
      const postData: {
        contenido: string;
        tags?: string[];
        externalMedia?: ExternalMediaItem[];
      } = {
        contenido: content.trim(),
        tags: tags.length > 0 ? tags : undefined,
      };

      // Subir los archivos multimedia a Cloudinary primero
      console.log("media", media);
      if (media.length > 0) {
        const uploadedMedia = await uploadAllMedia();
        const mediaForCMS = getMediaForCMS(uploadedMedia);
        if (mediaForCMS.length > 0) {
          postData.externalMedia = mediaForCMS;
        }
      }

      const response = await createPost(postData);

      onPostCreated(response);
      handleCleanup();
    } catch (error) {
      console.error("Error al crear la publicación:", error);
      showErrorToast("No se pudo crear la publicación. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = () => {
    setContent("");
    setTags([]);
    setTagInput("");
    clearMedia();
    onClose();
  };

  const handleMediaChange = (newMedia: MediaItem[]) => {
    // No necesitamos hacer nada aquí porque el estado de media
    // ya se maneja internamente en el hook useMedia
    // Este callback es obligatorio para el componente MediaUploader
  };

  return (
    <ModalView
      visible={visible}
      submitButtonText="Publicar"
      closeButtonText="Cancelar"
      onClose={handleCleanup}
      onSubmit={handleCreatePost}
      title="Nueva publicación"
      loading={isLoading || isUploading}
    >
      <ThemedInput
        style={styles.contentInput}
        placeholder="¿Qué quieres compartir hoy?"
        value={content}
        onChangeText={setContent}
        multiline
        maxLength={2000}
      />

      {/* Media Uploader Component */}
      <MediaUploader
        onMediaChange={handleMediaChange}
        maxItems={5}
        media={media}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        removeMedia={removeMedia}
        pickImage={pickImage}
        pickVideo={pickVideo}
        pickFromCamera={pickFromCamera}
      />

      {/* Tags Input */}
      <View style={styles.tagsContainer}>
        <View style={styles.tagsInputContainer}>
          <ThemedInput
            style={styles.tagInput}
            placeholder="Añadir etiqueta"
            value={tagInput}
            onChangeText={setTagInput}
            onSubmitEditing={handleAddTag}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
            <AntDesign name="plus" size={20} color={primary} />
          </TouchableOpacity>
        </View>

        {/* Tags Display */}
        {tags.length > 0 && (
          <View style={styles.tagsDisplay}>
            {tags.map((tag, index) => (
              <ThemedView key={index} variant="border" style={styles.tag}>
                <ThemedText style={styles.tagText}>{tag}</ThemedText>
                <TouchableOpacity
                  onPress={() => handleRemoveTag(index)}
                  style={styles.removeTagButton}
                >
                  <AntDesign name="close" size={14} color={foreground} />
                </TouchableOpacity>
              </ThemedView>
            ))}
          </View>
        )}
      </View>
    </ModalView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ccc",
  },
  closeButton: {
    padding: 8,
  },
  postButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  postButtonText: {
    color: "white",
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  contentInput: {
    minHeight: 120,
    marginBottom: 16,
  },
  mediaPreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  mediaPreviewItem: {
    position: "relative",
    margin: 4,
  },
  mediaPreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeMediaButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 2,
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    marginRight: 8,
  },
  addTagButton: {
    padding: 8,
  },
  tagsDisplay: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: AiraVariants.cardRadius,
  },
  tagText: {
    fontSize: 14,
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  mediaButton: {
    padding: 8,
    marginRight: 16,
  },
});
