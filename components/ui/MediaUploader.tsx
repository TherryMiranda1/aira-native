import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Text,
} from "react-native";
import {
  AntDesign,
  Feather,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MediaItem } from "@/hooks/services/useMedia";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import { formatFileSize } from "@/utils/fileUtils";

interface MediaUploaderProps {
  onMediaChange: (media: MediaItem[]) => void;
  maxItems?: number;
  initialMedia?: MediaItem[];
  media: MediaItem[];
  isUploading: boolean;
  uploadProgress: number;
  removeMedia: (index: number) => void;
  pickImage: () => void;
  pickVideo: () => void;
  pickFromCamera: (type: "imagen" | "video") => void;
}

export function MediaUploader({
  onMediaChange,
  maxItems = 5,
  initialMedia = [],
  media,
  isUploading,
  uploadProgress,
  removeMedia,
  pickImage,
  pickVideo,
  pickFromCamera,
}: MediaUploaderProps) {
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null
  );

  const primary = useThemeColor({}, "primary");
  const foreground = useThemeColor({}, "foreground");

  // Inicializar con media inicial si se proporciona
  useEffect(() => {
    if (initialMedia.length > 0 && media.length === 0) {
      // Aquí podríamos inicializar el estado interno con initialMedia
      // pero por ahora lo dejamos comentado ya que useMedia no tiene un setter público
      // setMedia(initialMedia);
    }
  }, [initialMedia]);

  // Notificar al componente padre cuando cambia el estado de los medios
  useEffect(() => {
    onMediaChange(media);
  }, [media, onMediaChange]);

  const handleAddMedia = () => {
    if (media.length >= maxItems) {
      return;
    }

    setShowMediaOptions(true);
  };

  const handleRemoveMedia = (index: number) => {
    removeMedia(index);
  };

  const handleMediaPress = (index: number) => {
    setSelectedMediaIndex(index);
  };

  const handleCloseMediaDetails = () => {
    setSelectedMediaIndex(null);
  };

  // Renderiza los detalles del archivo multimedia seleccionado
  const renderMediaDetails = () => {
    if (selectedMediaIndex === null || selectedMediaIndex >= media.length) {
      return null;
    }

    const item = media[selectedMediaIndex];
    const fileSize = item.bytes ? formatFileSize(item.bytes) : "Desconocido";
    const dimensions =
      item.width && item.height
        ? `${item.width}x${item.height}`
        : "Desconocidas";
    const format = item.format || item.mimeType?.split("/")[1] || "Desconocido";

    return (
      <Modal
        visible={selectedMediaIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseMediaDetails}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMediaDetails}
        >
          <View style={styles.modalContent}>
            <ThemedView style={styles.detailsContainer}>
              <View style={styles.detailsHeader}>
                <ThemedText style={styles.detailsTitle}>
                  {item.tipo === "imagen"
                    ? "Detalles de la imagen"
                    : "Detalles del video"}
                </ThemedText>
                <TouchableOpacity onPress={handleCloseMediaDetails}>
                  <AntDesign name="close" size={24} color={foreground} />
                </TouchableOpacity>
              </View>

              <Image
                source={{ uri: item.uri }}
                style={styles.detailsImage}
                resizeMode="contain"
              />

              <View style={styles.detailsInfo}>
                <View style={styles.detailRow}>
                  <Ionicons
                    name="document-outline"
                    size={20}
                    color={foreground}
                  />
                  <ThemedText style={styles.detailText}>
                    Tipo: {item.tipo}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons
                    name="resize-outline"
                    size={20}
                    color={foreground}
                  />
                  <ThemedText style={styles.detailText}>
                    Dimensiones: {dimensions}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="code-outline" size={20} color={foreground} />
                  <ThemedText style={styles.detailText}>
                    Formato: {format}
                  </ThemedText>
                </View>

                <View style={styles.detailRow}>
                  <Ionicons name="save-outline" size={20} color={foreground} />
                  <ThemedText style={styles.detailText}>
                    Tamaño: {fileSize}
                  </ThemedText>
                </View>
              </View>

              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  handleRemoveMedia(selectedMediaIndex);
                  handleCloseMediaDetails();
                }}
              >
                <AntDesign name="delete" size={20} color="white" />
                <Text style={styles.removeButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      {/* Media Preview */}
      {media.length > 0 && (
        <View style={styles.mediaPreviewContainer}>
          {media.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.mediaPreviewItem}
              onPress={() => handleMediaPress(index)}
            >
              <Image source={{ uri: item.uri }} style={styles.mediaPreview} />
              {item.tipo === "video" && (
                <View style={styles.videoIndicator}>
                  <MaterialIcons name="videocam" size={20} color="white" />
                </View>
              )}
              <TouchableOpacity
                style={styles.removeMediaButton}
                onPress={() => handleRemoveMedia(index)}
                disabled={isUploading}
              >
                <AntDesign name="closecircle" size={20} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Upload Controls */}
      <View style={styles.controlsContainer}>
        {isUploading ? (
          <ThemedView variant="border" style={styles.progressContainer}>
            <ActivityIndicator
              size="small"
              color={primary}
              style={styles.progressIndicator}
            />
            <ThemedText style={styles.progressText}>{`${Math.round(
              uploadProgress
            )}%`}</ThemedText>
          </ThemedView>
        ) : (
          <TouchableOpacity
            style={[
              styles.addButton,
              media.length >= maxItems && styles.disabledButton,
            ]}
            onPress={handleAddMedia}
            disabled={media.length >= maxItems}
          >
            <Feather
              name="plus"
              size={24}
              color={media.length >= maxItems ? "#999" : primary}
            />
            <ThemedText style={styles.addButtonText}>
              {media.length > 0
                ? `${media.length}/${maxItems} archivos`
                : "Añadir multimedia"}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {/* Media Options Modal */}
      <Modal
        visible={showMediaOptions}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMediaOptions(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMediaOptions(false)}
        >
          <View style={styles.modalContent}>
            <ThemedView style={styles.modalContainer}>
              <ThemedText style={styles.modalTitle}>
                Seleccionar multimedia
              </ThemedText>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowMediaOptions(false);
                  pickImage();
                }}
              >
                <Feather name="image" size={24} color={primary} />
                <View style={styles.modalOptionTextContainer}>
                  <ThemedText style={styles.modalOptionText}>
                    Imagen de la galería
                  </ThemedText>
                  <ThemedText style={styles.modalOptionSubtext}>
                    JPG, PNG, GIF (máx. 10MB)
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowMediaOptions(false);
                  pickVideo();
                }}
              >
                <Feather name="video" size={24} color={primary} />
                <View style={styles.modalOptionTextContainer}>
                  <ThemedText style={styles.modalOptionText}>
                    Video de la galería
                  </ThemedText>
                  <ThemedText style={styles.modalOptionSubtext}>
                    MP4, MOV (máx. 50MB, 60s)
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowMediaOptions(false);
                  pickFromCamera("imagen");
                }}
              >
                <Feather name="camera" size={24} color={primary} />
                <View style={styles.modalOptionTextContainer}>
                  <ThemedText style={styles.modalOptionText}>
                    Tomar foto
                  </ThemedText>
                  <ThemedText style={styles.modalOptionSubtext}>
                    Se comprimirá automáticamente
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => {
                  setShowMediaOptions(false);
                  pickFromCamera("video");
                }}
              >
                <MaterialIcons name="videocam" size={24} color={primary} />
                <View style={styles.modalOptionTextContainer}>
                  <ThemedText style={styles.modalOptionText}>
                    Grabar video
                  </ThemedText>
                  <ThemedText style={styles.modalOptionSubtext}>
                    Máximo 60 segundos
                  </ThemedText>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalOption, styles.cancelOption]}
                onPress={() => setShowMediaOptions(false)}
              >
                <ThemedText style={styles.cancelText}>Cancelar</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Media Details Modal */}
      {renderMediaDetails()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  mediaPreviewContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
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
  videoIndicator: {
    position: "absolute",
    bottom: 4,
    left: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 2,
  },
  removeMediaButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    padding: 2,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#ccc",
  },
  disabledButton: {
    opacity: 0.5,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 14,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
  },
  progressIndicator: {
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    width: "100%",
  },
  modalContainer: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(150, 150, 150, 0.2)",
  },
  modalOptionTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalOptionSubtext: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  cancelOption: {
    justifyContent: "center",
    marginTop: 8,
    borderBottomWidth: 0,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Estilos para el modal de detalles
  detailsContainer: {
    borderRadius: 16,
    padding: 16,
    width: "90%",
    alignSelf: "center",
  },
  detailsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  detailsImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsInfo: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  detailText: {
    fontSize: 14,
    marginLeft: 8,
  },
  removeButton: {
    backgroundColor: "#ff4d4f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
  },
});
