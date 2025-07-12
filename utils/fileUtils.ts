import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

/**
 * Interfaz para la información de un archivo
 */
export interface FileInfo {
  exists: boolean;
  size?: number;
  uri?: string;
  mimeType?: string;
  modificationTime?: number;
  isDirectory?: boolean;
}

/**
 * Obtiene información detallada sobre un archivo
 */
export async function getFileInfo(uri: string): Promise<FileInfo> {
  try {
    // Verificar si el archivo existe y obtener información básica
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists) {
      return { exists: false };
    }

    let mimeType: string | undefined;

    // Intentar obtener el tipo MIME
    try {
      // Para archivos de la biblioteca de medios, podemos obtener más información
      if (uri.startsWith("file://") || uri.startsWith("content://")) {
        const asset = await MediaLibrary.getAssetInfoAsync(uri);
        if (asset && asset.mediaType) {
          // Mapear el tipo de MediaLibrary a MIME
          switch (asset.mediaType) {
            case "photo":
              mimeType = asset.mediaSubtypes?.includes(
                "gif" as MediaLibrary.MediaSubtype
              )
                ? "image/gif"
                : asset.mediaSubtypes?.includes(
                    "png" as MediaLibrary.MediaSubtype
                  )
                ? "image/png"
                : "image/jpeg";
              break;
            case "video":
              mimeType = "video/mp4";
              break;
            case "audio":
              mimeType = "audio/mpeg";
              break;
            default:
              // Intentar inferir del nombre de archivo
              mimeType = inferMimeTypeFromUri(uri);
          }
        }
      } else {
        // Para otros tipos de URI, inferir del nombre
        mimeType = inferMimeTypeFromUri(uri);
      }
    } catch (error) {
      console.warn("Error al obtener tipo MIME:", error);
      // Fallar silenciosamente y continuar sin tipo MIME
    }

    return {
      exists: true,
      size: fileInfo.size,
      uri: fileInfo.uri,
      mimeType,
      modificationTime: fileInfo.modificationTime,
      isDirectory: fileInfo.isDirectory,
    };
  } catch (error) {
    console.error("Error al obtener información del archivo:", error);
    return { exists: false };
  }
}

/**
 * Infiere el tipo MIME basado en la extensión del archivo
 */
function inferMimeTypeFromUri(uri: string): string | undefined {
  const extension = uri.split(".").pop()?.toLowerCase();

  if (!extension) return undefined;

  const mimeTypes: Record<string, string> = {
    // Imágenes
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    heic: "image/heic",

    // Videos
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    webm: "video/webm",
    mkv: "video/x-matroska",

    // Audio
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",

    // Documentos
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    txt: "text/plain",
  };

  return mimeTypes[extension];
}

/**
 * Formatea el tamaño del archivo a una representación legible
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Verifica si un archivo es demasiado grande según un límite especificado
 */
export function isFileTooLarge(fileSize: number, maxSizeInMB: number): boolean {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return fileSize > maxSizeInBytes;
}
