import { MediaItem } from '@/hooks/services/useMedia';
import { CLOUDINARY_CONFIG } from '@/constants/Config';
import * as ImageManipulator from 'expo-image-manipulator';
import { getFileInfo } from '@/utils/fileUtils';

// Interfaz para los elementos de media en un post
export interface PostMediaItem {
  archivo: string;
  tipo: 'imagen' | 'video';
  descripcion?: string;
}

// Interfaz para los elementos de media externa en un post
export interface ExternalMediaItem {
  url: string;
  tipo: 'imagen' | 'video';
  publicId?: string;
  descripcion?: string;
}

// Configuración de reintentos
const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
};

// Configuración de compresión
const COMPRESSION_CONFIG = {
  IMAGE: {
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: 0.8,
  },
  VIDEO: {
    QUALITY: '720p',
  },
};

// Errores personalizados para el servicio de media
export class MediaServiceError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'MediaServiceError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

export class CloudinaryUploadError extends MediaServiceError {
  constructor(message: string, statusCode?: number, details?: any) {
    super(message, statusCode, details);
    this.name = 'CloudinaryUploadError';
  }
}

export class CloudinaryDeleteError extends MediaServiceError {
  constructor(message: string, statusCode?: number, details?: any) {
    super(message, statusCode, details);
    this.name = 'CloudinaryDeleteError';
  }
}

export class MediaTransformError extends MediaServiceError {
  constructor(message: string, details?: any) {
    super(message, undefined, details);
    this.name = 'MediaTransformError';
  }
}

export class MediaCompressionError extends MediaServiceError {
  constructor(message: string, details?: any) {
    super(message, undefined, details);
    this.name = 'MediaCompressionError';
  }
}

/**
 * Servicio para manejar la subida de archivos multimedia a Cloudinary
 */
export const mediaService = {
  /**
   * Detecta el tipo MIME de un archivo basado en su URI y tipo
   */
  async detectMimeType(uri: string, tipo: 'imagen' | 'video'): Promise<string> {
    try {
      // Obtener información del archivo
      const fileInfo = await getFileInfo(uri);
      
      // Si tenemos el tipo MIME, usarlo
      if (fileInfo.mimeType) {
        return fileInfo.mimeType;
      }
      
      // Inferir basado en la extensión
      const extension = uri.split('.').pop()?.toLowerCase() || '';
      
      if (tipo === 'imagen') {
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          case 'gif':
            return 'image/gif';
          case 'webp':
            return 'image/webp';
          case 'heic':
            return 'image/heic';
          default:
            return 'image/jpeg'; // Valor por defecto para imágenes
        }
      } else {
        switch (extension) {
          case 'mp4':
            return 'video/mp4';
          case 'mov':
            return 'video/quicktime';
          case 'avi':
            return 'video/x-msvideo';
          case 'webm':
            return 'video/webm';
          default:
            return 'video/mp4'; // Valor por defecto para videos
        }
      }
    } catch (error) {
      console.warn('Error al detectar tipo MIME:', error);
      // Usar valor por defecto en caso de error
      return tipo === 'imagen' ? 'image/jpeg' : 'video/mp4';
    }
  },

  /**
   * Comprime una imagen antes de subirla
   */
  async compressImage(uri: string): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          {
            resize: {
              width: COMPRESSION_CONFIG.IMAGE.MAX_WIDTH,
              height: COMPRESSION_CONFIG.IMAGE.MAX_HEIGHT,
            },
          },
        ],
        {
          compress: COMPRESSION_CONFIG.IMAGE.QUALITY,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );
      
      return result.uri;
    } catch (error) {
      console.error('Error al comprimir imagen:', error);
      throw new MediaCompressionError(
        'Error al comprimir imagen',
        { originalError: error, uri }
      );
    }
  },

  /**
   * Prepara un archivo multimedia para la subida (compresión, validación)
   */
  async prepareMediaForUpload(uri: string, tipo: 'imagen' | 'video'): Promise<string> {
    try {
      if (tipo === 'imagen') {
        // Comprimir imagen
        return await this.compressImage(uri);
      } else {
        // Para videos, por ahora solo devolvemos la URI original
        // La compresión de videos es más compleja y requeriría una biblioteca específica
        return uri;
      }
    } catch (error) {
      if (error instanceof MediaServiceError) {
        throw error;
      }
      
      throw new MediaTransformError(
        'Error al preparar archivo multimedia para subida',
        { originalError: error, uri, tipo }
      );
    }
  },

  /**
   * Sube un archivo a Cloudinary con reintentos
   */
  async uploadToCloudinary(uri: string, tipo: 'imagen' | 'video'): Promise<{ url: string; publicId: string; format: string; resourceType: string; bytes: number; width?: number; height?: number }> {
    // Validar parámetros
    if (!uri) {
      throw new CloudinaryUploadError('URI del archivo no proporcionada');
    }

    if (!['imagen', 'video'].includes(tipo)) {
      throw new CloudinaryUploadError(`Tipo de archivo inválido: ${tipo}`);
    }

    let retries = 0;
    let lastError: Error | null = null;

    while (retries < RETRY_CONFIG.MAX_RETRIES) {
      try {
        // Preparar el archivo (comprimir si es necesario)
        const preparedUri = await this.prepareMediaForUpload(uri, tipo);
        
        // Detectar el tipo MIME real
        const mimeType = await this.detectMimeType(preparedUri, tipo);

        // Crear un FormData para subir el archivo
        const formData = new FormData();
        const fileName = preparedUri.split('/').pop() || 'file';

        // Añadir el archivo al FormData
        formData.append('file', {
          uri: preparedUri,
          name: fileName,
          type: mimeType,
        } as any);
        
        formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

        // Subir el archivo a Cloudinary
        const response = await fetch(CLOUDINARY_CONFIG.API_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new CloudinaryUploadError(
            `Error al subir a Cloudinary: ${response.statusText}`,
            response.status,
            { responseText: errorText }
          );
        }

        const data = await response.json();

        // Validación más completa de la respuesta
        this.validateCloudinaryResponse(data);

        return {
          url: data.secure_url,
          publicId: data.public_id,
          format: data.format || '',
          resourceType: data.resource_type || tipo === 'imagen' ? 'image' : 'video',
          bytes: data.bytes || 0,
          width: data.width,
          height: data.height
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Error desconocido');
        retries++;
        
        if (retries < RETRY_CONFIG.MAX_RETRIES) {
          console.warn(`Reintento ${retries}/${RETRY_CONFIG.MAX_RETRIES} para subir archivo:`, uri);
          // Esperar antes de reintentar
          await new Promise(resolve => setTimeout(resolve, RETRY_CONFIG.RETRY_DELAY_MS));
        }
      }
    }

    // Si llegamos aquí, todos los intentos fallaron
    if (lastError instanceof MediaServiceError) {
      throw lastError;
    }
    
    throw new CloudinaryUploadError(
      `Fallaron todos los intentos (${RETRY_CONFIG.MAX_RETRIES}) de subida a Cloudinary`,
      undefined,
      { originalError: lastError, uri, tipo }
    );
  },

  /**
   * Valida la respuesta de Cloudinary
   */
  validateCloudinaryResponse(data: any): void {
    // Verificar campos obligatorios
    if (!data.secure_url) {
      throw new CloudinaryUploadError(
        'Respuesta de Cloudinary no contiene URL segura',
        undefined,
        { responseData: data }
      );
    }
    
    if (!data.public_id) {
      throw new CloudinaryUploadError(
        'Respuesta de Cloudinary no contiene ID público',
        undefined,
        { responseData: data }
      );
    }

    // Verificar si hay errores en la respuesta
    if (data.error) {
      throw new CloudinaryUploadError(
        `Error reportado por Cloudinary: ${data.error.message || 'Error desconocido'}`,
        undefined,
        { cloudinaryError: data.error }
      );
    }
  },

  /**
   * Sube múltiples archivos a Cloudinary
   */
  async uploadMultipleToCloudinary(
    mediaItems: MediaItem[],
    onProgress?: (progress: number) => void
  ): Promise<MediaItem[]> {
    if (!mediaItems || mediaItems.length === 0) return [];

    const uploadedMedia: MediaItem[] = [];
    let completedUploads = 0;
    const totalItems = mediaItems.length;
    const errors: { item: MediaItem; error: Error }[] = [];

    for (const item of mediaItems) {
      try {
        const result = await this.uploadToCloudinary(item.uri, item.tipo);
        
        uploadedMedia.push({
          ...item,
          cloudinaryUrl: result.url,
          publicId: result.publicId,
          format: result.format,
          resourceType: result.resourceType,
          bytes: result.bytes,
          width: result.width,
          height: result.height
        });
      } catch (error) {
        console.error(`Error al subir archivo ${item.uri}:`, error);
        errors.push({ 
          item, 
          error: error instanceof Error ? error : new Error('Error desconocido') 
        });
      } finally {
        completedUploads++;
        if (onProgress) {
          onProgress((completedUploads / totalItems) * 100);
        }
      }
    }

    // Si hubo errores pero se subieron algunos archivos, registramos los errores pero continuamos
    if (errors.length > 0) {
      console.warn(`${errors.length} de ${totalItems} archivos no se pudieron subir:`, errors);
    }

    // Si no se pudo subir ningún archivo, lanzamos un error
    if (uploadedMedia.length === 0 && mediaItems.length > 0) {
      throw new CloudinaryUploadError(
        'No se pudo subir ningún archivo multimedia',
        undefined,
        { errors }
      );
    }

    return uploadedMedia;
  },

  /**
   * Transforma los items de media para el formato requerido por el CMS
   */
  transformMediaForCMS(mediaItems: MediaItem[]): ExternalMediaItem[] {
    try {
      if (!mediaItems || !Array.isArray(mediaItems)) {
        throw new MediaTransformError('Lista de archivos multimedia inválida', { mediaItems });
      }

      // Transformar a formato para externalMedia en el CMS
      return mediaItems
        .filter(item => {
          if (!item.cloudinaryUrl) {
            console.warn('Elemento multimedia sin URL de Cloudinary:', item);
            return false;
          }
          return true;
        })
        .map(item => ({
          url: item.cloudinaryUrl!,
          tipo: item.tipo,
          publicId: item.publicId,
          descripcion: undefined
        }));
    } catch (error) {
      if (error instanceof MediaServiceError) {
        throw error;
      }
      
      throw new MediaTransformError(
        'Error al transformar archivos multimedia para el CMS',
        { originalError: error, mediaItems }
      );
    }
  },

  /**
   * Elimina un archivo de Cloudinary usando la API de destrucción
   * Nota: Requiere configuración adicional en Cloudinary para autenticación
   */
  async deleteFromCloudinary(publicId: string): Promise<boolean> {
    try {
      if (!publicId) {
        throw new CloudinaryDeleteError('ID público no proporcionado');
      }

      // Para una implementación completa, necesitaríamos:
      // 1. Generar un timestamp
      // 2. Generar una firma con una clave secreta
      // 3. Enviar estos datos a Cloudinary

      // Esta es una implementación simplificada que asume que el preset de upload
      // tiene permisos para eliminar archivos
      const timestamp = Math.floor(Date.now() / 1000).toString();
      
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('upload_preset', CLOUDINARY_CONFIG.UPLOAD_PRESET);

      // URL para eliminar recursos
      const deleteUrl = CLOUDINARY_CONFIG.API_URL.replace('/upload', '/destroy');

      const response = await fetch(deleteUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new CloudinaryDeleteError(
          `Error al eliminar de Cloudinary: ${response.statusText}`,
          response.status,
          { responseText: errorText }
        );
      }

      const data = await response.json();
      
      // Cloudinary devuelve "ok" cuando se elimina correctamente
      return data.result === 'ok';
    } catch (error) {
      if (error instanceof MediaServiceError) {
        throw error;
      }
      
      console.error('Error al eliminar archivo de Cloudinary:', error);
      throw new CloudinaryDeleteError(
        error instanceof Error ? error.message : 'Error desconocido al eliminar archivo',
        undefined,
        { originalError: error, publicId }
      );
    }
  },

  /**
   * Elimina múltiples archivos de Cloudinary
   */
  async deleteMultipleFromCloudinary(publicIds: string[]): Promise<{ success: string[]; failed: string[] }> {
    if (!publicIds || publicIds.length === 0) {
      return { success: [], failed: [] };
    }

    const results = {
      success: [] as string[],
      failed: [] as string[],
    };

    for (const publicId of publicIds) {
      try {
        const success = await this.deleteFromCloudinary(publicId);
        if (success) {
          results.success.push(publicId);
        } else {
          results.failed.push(publicId);
        }
      } catch (error) {
        console.error(`Error al eliminar archivo ${publicId}:`, error);
        results.failed.push(publicId);
      }
    }

    return results;
  },

  /**
   * Extrae los publicIds de Cloudinary de un post
   */
  extractPublicIdsFromPost(post: { media?: PostMediaItem[] }): string[] {
    try {
      if (!post || !post.media || !Array.isArray(post.media)) {
        return [];
      }

      return post.media
        .filter(item => item && item.descripcion)
        .map(item => item.descripcion as string);
    } catch (error) {
      console.error('Error al extraer IDs públicos del post:', error);
      return [];
    }
  }
}; 