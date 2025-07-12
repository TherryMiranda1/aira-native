# Flujo de Subida de Archivos Multimedia en Aira Native

Este documento describe el flujo de subida de archivos multimedia (imágenes y videos) implementado en Aira Native, que utiliza Cloudinary como servicio de almacenamiento en la nube para optimizar el rendimiento y reducir la carga en el CMS.

## Arquitectura General

El flujo de subida de archivos multimedia se compone de tres partes principales:

1. **Hook `useMedia`**: Maneja el estado de los archivos multimedia y proporciona métodos para seleccionar, subir y eliminar archivos.
2. **Servicio `mediaService`**: Encapsula la lógica de comunicación con Cloudinary y transformación de datos.
3. **Componente `MediaUploader`**: Interfaz de usuario para la selección y visualización de archivos multimedia.

## Diagrama de Flujo

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐     ┌─────────────┐
│ MediaUploader│────▶│   useMedia  │────▶│   mediaService  │────▶│  Cloudinary │
└─────────────┘     └─────────────┘     └─────────────────┘     └─────────────┘
       │                   │                     │                     │
       ▼                   ▼                     ▼                     │
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐           │
│   Usuario   │◀───▶│  ImagePicker│     │  Transformación │◀──────────┘
└─────────────┘     └─────────────┘     └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │      CMS        │
                                        └─────────────────┘
```

## Componentes Principales

### 1. Hook `useMedia`

Este hook personalizado maneja el estado de los archivos multimedia y proporciona métodos para:

- Seleccionar imágenes de la galería (`pickImage`)
- Seleccionar videos de la galería (`pickVideo`)
- Capturar fotos o videos con la cámara (`pickFromCamera`)
- Eliminar archivos del estado (`removeMedia`)
- Subir todos los archivos a Cloudinary (`uploadAllMedia`)
- Transformar los datos para el formato requerido por el CMS (`getMediaForCMS`)
- Limpiar el estado (`clearMedia`)

### 2. Servicio `mediaService`

Este servicio encapsula la lógica de comunicación con Cloudinary:

- Subir un archivo individual (`uploadToCloudinary`)
- Subir múltiples archivos (`uploadMultipleToCloudinary`)
- Transformar los datos para el CMS (`transformMediaForCMS`)
- Eliminar archivos de Cloudinary (`deleteFromCloudinary`, `deleteMultipleFromCloudinary`)
- Extraer IDs públicos de un post (`extractPublicIdsFromPost`)

También incluye clases personalizadas para el manejo de errores:
- `MediaServiceError`: Clase base para errores del servicio
- `CloudinaryUploadError`: Errores específicos de subida a Cloudinary
- `CloudinaryDeleteError`: Errores específicos de eliminación de Cloudinary
- `MediaTransformError`: Errores de transformación de datos

### 3. Componente `MediaUploader`

Este componente proporciona la interfaz de usuario para:

- Mostrar una vista previa de los archivos seleccionados
- Permitir al usuario seleccionar imágenes o videos
- Mostrar el progreso de la subida
- Eliminar archivos seleccionados

## Flujo de Uso

1. El usuario interactúa con el componente `MediaUploader` para seleccionar archivos multimedia.
2. El hook `useMedia` gestiona el estado de los archivos seleccionados.
3. Cuando se envía el formulario (por ejemplo, al crear una publicación):
   a. Se suben los archivos a Cloudinary mediante `uploadAllMedia`.
   b. Se obtienen las URLs de Cloudinary.
   c. Se transforman los datos al formato requerido por el CMS con `getMediaForCMS`.
   d. Se envían los datos transformados al CMS junto con el resto del formulario.

## Flujo de Eliminación

1. Cuando se elimina un post, se extraen los IDs públicos de Cloudinary de los archivos multimedia.
2. Se llama a `deleteMultipleFromCloudinary` para eliminar los archivos de Cloudinary.
3. La eliminación de archivos en Cloudinary se realiza en segundo plano para no bloquear la interfaz.
4. Si hay errores en la eliminación de archivos, se registran pero no afectan a la eliminación del post.

## Manejo de Errores

El sistema implementa un manejo de errores robusto:

1. Validación previa de archivos (tamaño, tipo, etc.)
2. Errores personalizados para diferentes situaciones
3. Feedback visual al usuario sobre el estado de la subida
4. Registro detallado de errores en la consola

## Configuración

La configuración de Cloudinary se encuentra en `constants/Config.ts`:

```typescript
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: 'YOUR_CLOUD_NAME',
  UPLOAD_PRESET: 'YOUR_UPLOAD_PRESET',
  API_URL: 'https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/upload',
};
```

## Pendientes y Mejoras Futuras

1. Implementar compresión de archivos antes de la subida
2. Añadir soporte para recortar imágenes y videos
3. Añadir soporte para subir archivos en segundo plano
4. Mejorar el manejo de errores de red durante la subida
5. Implementar pruebas unitarias para el flujo de subida y eliminación

## Consideraciones de Seguridad

- El upload preset de Cloudinary debe estar configurado con las restricciones adecuadas
- Se recomienda implementar firmas para las subidas en un entorno de producción
- Los archivos deben ser validados tanto en el cliente como en el servidor

---

Documento creado: 12 de julio de 2023
Última actualización: 12 de julio de 2023 