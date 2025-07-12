import { useState, useCallback } from "react";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useToastHelpers } from "@/components/ui/ToastSystem";
import {
  mediaService,
  MediaServiceError,
  CloudinaryUploadError,
  MediaCompressionError,
} from "@/services/api/media.service";
import { formatFileSize, isFileTooLarge } from "@/utils/fileUtils";

export type MediaItem = {
  uri: string;
  tipo: "imagen" | "video";
  id?: string;
  cloudinaryUrl?: string;
  publicId?: string;
  format?: string;
  resourceType?: string;
  bytes?: number;
  width?: number;
  height?: number;
  mimeType?: string;
};

export type ExternalMediaItem = {
  url: string;
  tipo: "imagen" | "video";
  publicId?: string;
  descripcion?: string;
};

// Configuración de límites de archivos
const FILE_LIMITS = {
  MAX_IMAGE_SIZE_MB: 10, // 10 MB
  MAX_VIDEO_SIZE_MB: 50, // 50 MB
  MAX_VIDEO_DURATION_SEC: 60, // 60 segundos
  MAX_FILES: 5, // Máximo 5 archivos
};

export function useMedia() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadRetries, setUploadRetries] = useState<Record<string, number>>(
    {}
  );
  const { showErrorToast, showSuccessToast, showInfoToast } = useToastHelpers();

  /**
   * Valida un archivo multimedia antes de añadirlo
   */
  const validateMediaFile = useCallback(
    async (uri: string, tipo: "imagen" | "video"): Promise<boolean> => {
      try {
        // Verificar límite de archivos
        if (media.length >= FILE_LIMITS.MAX_FILES) {
          showErrorToast(
            `Solo puedes añadir hasta ${FILE_LIMITS.MAX_FILES} archivos multimedia`
          );
          return false;
        }

        // Verificar tamaño del archivo
        const fileInfo = await FileSystem.getInfoAsync(uri);
        if (!fileInfo.exists) {
          showErrorToast("No se pudo acceder al archivo");
          return false;
        }

        const maxSizeMB =
          tipo === "imagen"
            ? FILE_LIMITS.MAX_IMAGE_SIZE_MB
            : FILE_LIMITS.MAX_VIDEO_SIZE_MB;

        if (isFileTooLarge(fileInfo.size, maxSizeMB)) {
          const formattedSize = formatFileSize(fileInfo.size);
          showErrorToast(
            `El archivo es demasiado grande (${formattedSize}). Máximo ${maxSizeMB}MB para ${
              tipo === "imagen" ? "imágenes" : "videos"
            }`
          );
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error al validar archivo multimedia:", error);
        showErrorToast("Error al validar el archivo");
        return false;
      }
    },
    [media.length, showErrorToast]
  );

  /**
   * Selecciona una imagen de la galería
   */
  const pickImage = useCallback(async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showErrorToast("Se necesita permiso para acceder a la galería");
        return null;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        exif: true,
      });

      if (!pickerResult.canceled) {
        const selectedAsset = pickerResult.assets[0];

        // Validar el archivo antes de añadirlo
        if (!(await validateMediaFile(selectedAsset.uri, "imagen"))) {
          return null;
        }

        const newMediaItem: MediaItem = {
          uri: selectedAsset.uri,
          tipo: "imagen",
          width: selectedAsset.width,
          height: selectedAsset.height,
          mimeType: selectedAsset.mimeType || undefined,
        };

        setMedia((prevMedia) => [...prevMedia, newMediaItem]);
        return newMediaItem;
      }
      return null;
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
      showErrorToast("Error al seleccionar imagen");
      return null;
    }
  }, [showErrorToast, validateMediaFile]);

  /**
   * Selecciona un video de la galería
   */
  const pickVideo = useCallback(async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        showErrorToast("Se necesita permiso para acceder a la galería");
        return null;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: FILE_LIMITS.MAX_VIDEO_DURATION_SEC,
      });

      if (!pickerResult.canceled) {
        const selectedAsset = pickerResult.assets[0];

        // Validar el archivo antes de añadirlo
        if (!(await validateMediaFile(selectedAsset.uri, "video"))) {
          return null;
        }

        const newMediaItem: MediaItem = {
          uri: selectedAsset.uri,
          tipo: "video",
          width: selectedAsset.width,
          height: selectedAsset.height,
          mimeType: selectedAsset.mimeType || undefined,
        };

        setMedia((prevMedia) => [...prevMedia, newMediaItem]);
        return newMediaItem;
      }
      return null;
    } catch (error) {
      console.error("Error al seleccionar video:", error);
      showErrorToast("Error al seleccionar video");
      return null;
    }
  }, [showErrorToast, validateMediaFile]);

  /**
   * Selecciona un archivo multimedia (imagen o video) de la cámara
   */
  const pickFromCamera = useCallback(
    async (mediaType: "imagen" | "video" = "imagen") => {
      try {
        const permissionResult =
          await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
          showErrorToast("Se necesita permiso para acceder a la cámara");
          return null;
        }

        const pickerResult = await ImagePicker.launchCameraAsync({
          mediaTypes:
            mediaType === "imagen"
              ? ImagePicker.MediaTypeOptions.Images
              : ImagePicker.MediaTypeOptions.Videos,
          allowsEditing: true,
          quality: 0.8,
          videoMaxDuration: FILE_LIMITS.MAX_VIDEO_DURATION_SEC,
          exif: true,
        });

        if (!pickerResult.canceled) {
          const selectedAsset = pickerResult.assets[0];

          // Validar el archivo antes de añadirlo
          if (!(await validateMediaFile(selectedAsset.uri, mediaType))) {
            return null;
          }

          const newMediaItem: MediaItem = {
            uri: selectedAsset.uri,
            tipo: mediaType,
            width: selectedAsset.width,
            height: selectedAsset.height,
            mimeType: selectedAsset.mimeType || undefined,
          };

          setMedia((prevMedia) => [...prevMedia, newMediaItem]);
          return newMediaItem;
        }
        return null;
      } catch (error) {
        console.error("Error al capturar con la cámara:", error);
        showErrorToast("Error al capturar con la cámara");
        return null;
      }
    },
    [showErrorToast, validateMediaFile]
  );

  /**
   * Elimina un archivo multimedia del estado
   */
  const removeMedia = useCallback((index: number) => {
    setMedia((prevMedia) => prevMedia.filter((_, i) => i !== index));
  }, []);

  /**
   * Sube todos los archivos multimedia a Cloudinary
   */
  const uploadAllMedia = useCallback(async (): Promise<MediaItem[]> => {
    if (media.length === 0) return [];

    try {
      setIsUploading(true);
      setUploadProgress(0);

      // Mostrar toast informativo
      if (media.length > 1) {
        showInfoToast(`Subiendo ${media.length} archivos multimedia...`);
      } else {
        showInfoToast("Subiendo archivo multimedia...");
      }

      const uploadedMedia = await mediaService.uploadMultipleToCloudinary(
        media,
        (progress) => setUploadProgress(progress)
      );

      if (uploadedMedia.length > 0) {
        const successMessage =
          uploadedMedia.length === 1
            ? "Archivo subido correctamente"
            : `${uploadedMedia.length} archivos subidos correctamente`;

        showSuccessToast(successMessage);
      }

      return uploadedMedia;
    } catch (error) {
      // Manejo específico según el tipo de error
      if (error instanceof CloudinaryUploadError) {
        console.error("Error de Cloudinary:", error.message, error.details);
        showErrorToast(`Error al subir a Cloudinary: ${error.message}`);
      } else if (error instanceof MediaCompressionError) {
        console.error("Error de compresión:", error.message, error.details);
        showErrorToast(`Error al comprimir archivo: ${error.message}`);
      } else if (error instanceof MediaServiceError) {
        console.error("Error del servicio de media:", error.message);
        showErrorToast(`Error del servicio multimedia: ${error.message}`);
      } else {
        console.error("Error desconocido al subir archivos multimedia:", error);
        showErrorToast("Error inesperado al subir archivos multimedia");
      }
      return [];
    } finally {
      setIsUploading(false);
    }
  }, [media, showErrorToast, showSuccessToast, showInfoToast]);

  /**
   * Transforma los media items al formato requerido por el CMS
   */
  const getMediaForCMS = useCallback(
    (uploadedMedia: MediaItem[]): ExternalMediaItem[] => {
      try {
        return uploadedMedia
          .filter((item) => item.cloudinaryUrl && item.tipo)
          .map((item) => ({
            url: item.cloudinaryUrl!,
            tipo: item.tipo,
            publicId: item.publicId,
            descripcion: undefined,
          }));
      } catch (error) {
        console.error("Error al transformar media para CMS:", error);
        showErrorToast("Error al procesar archivos multimedia");
        return [];
      }
    },
    [showErrorToast]
  );

  /**
   * Limpia el estado de los archivos multimedia
   */
  const clearMedia = useCallback(() => {
    setMedia([]);
    setUploadProgress(0);
    setUploadRetries({});
  }, []);

  return {
    media,
    isUploading,
    uploadProgress,
    pickImage,
    pickVideo,
    pickFromCamera,
    removeMedia,
    uploadAllMedia,
    getMediaForCMS,
    clearMedia,
  };
}
