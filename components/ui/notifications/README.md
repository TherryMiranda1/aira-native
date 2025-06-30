# Sistema de Notificaciones Personalizado para Aira

Un sistema completo de alertas y toasts que reemplaza los `Alert` de React Native con componentes personalizados, modernos y profesionales.

## 🚀 Características

- ✨ **Animaciones suaves** de entrada y salida
- 🎨 **Diseño personalizado** con gradientes y iconos
- 📱 **Responsive** y adaptado al diseño de Aira
- 🎭 **Múltiples tipos** (éxito, error, advertencia, información, confirmación)
- 🍞 **Toasts deslizables** para notificaciones ligeras
- ⚡ **Auto-ocultado configurable**
- 🔄 **Soporte para múltiples notificaciones simultáneas**
- 🎯 **TypeScript completo** con tipos seguros

## 📦 Instalación

El sistema ya está integrado en la aplicación. Solo necesitas usar los hooks proporcionados:

```tsx
import { useAlertHelpers, useToastHelpers } from '@/components/ui/notifications';
```

## 🎯 Uso Básico

### Alertas (Modales)

```tsx
import { useAlertHelpers } from '@/components/ui/notifications';

function MyComponent() {
  const { showSuccess, showError, showConfirm, showWarning, showInfo } = useAlertHelpers();

  const handleSuccess = () => {
    showSuccess(
      "¡Éxito!",
      "La operación se completó correctamente",
      () => console.log("Callback ejecutado")
    );
  };

  const handleError = () => {
    showError("Error", "Algo salió mal. Inténtalo de nuevo.");
  };

  const handleConfirmation = () => {
    showConfirm(
      "Confirmar eliminación",
      "¿Estás segura de que quieres eliminar este elemento?",
      () => console.log("Confirmado"),
      () => console.log("Cancelado"),
      "Eliminar",
      "Cancelar"
    );
  };
}
```

### Toasts (Notificaciones ligeras)

```tsx
import { useToastHelpers } from '@/components/ui/notifications';

function MyComponent() {
  const { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } = useToastHelpers();

  const handleQuickSuccess = () => {
    showSuccessToast("Guardado", "Los cambios se guardaron correctamente");
  };

  const handleQuickError = () => {
    showErrorToast("Error de red", "No se pudo conectar al servidor");
  };
}
```

## 🔄 Migración desde Alert

### Antes (React Native Alert)
```tsx
import { Alert } from 'react-native';

// Error simple
Alert.alert("Error", "Mensaje de error");

// Confirmación
Alert.alert(
  "Confirmar",
  "¿Estás segura?",
  [
    { text: "Cancelar", style: "cancel" },
    { text: "Eliminar", style: "destructive", onPress: handleDelete }
  ]
);

// Éxito con callback
Alert.alert(
  "Éxito",
  "Operación completada",
  [{ text: "OK", onPress: () => router.back() }]
);
```

### Después (Sistema personalizado)
```tsx
import { useAlertHelpers } from '@/components/ui/notifications';

function MyComponent() {
  const { showError, showConfirm, showSuccess } = useAlertHelpers();

  // Error simple
  showError("Error", "Mensaje de error");

  // Confirmación
  showConfirm(
    "Confirmar",
    "¿Estás segura?",
    handleDelete,
    undefined,
    "Eliminar",
    "Cancelar"
  );

  // Éxito con callback
  showSuccess(
    "Éxito",
    "Operación completada",
    () => router.back()
  );
}
```

## 📚 API Reference

### useAlertHelpers

#### `showSuccess(title, message?, onPress?)`
- **title**: string - Título de la alerta
- **message**: string? - Mensaje opcional
- **onPress**: function? - Callback al presionar OK

#### `showError(title, message?, onPress?)`
- **title**: string - Título del error
- **message**: string? - Mensaje de error
- **onPress**: function? - Callback al presionar OK

#### `showConfirm(title, message, onConfirm, onCancel?, confirmText?, cancelText?)`
- **title**: string - Título de confirmación
- **message**: string - Mensaje de confirmación
- **onConfirm**: function - Callback al confirmar
- **onCancel**: function? - Callback al cancelar
- **confirmText**: string? - Texto del botón de confirmación (default: "Confirmar")
- **cancelText**: string? - Texto del botón de cancelación (default: "Cancelar")

#### `showWarning(title, message?, onPress?)`
- **title**: string - Título de advertencia
- **message**: string? - Mensaje de advertencia
- **onPress**: function? - Callback al presionar OK

#### `showInfo(title, message?, onPress?)`
- **title**: string - Título informativo
- **message**: string? - Mensaje informativo
- **onPress**: function? - Callback al presionar OK

### useToastHelpers

#### `showSuccessToast(title, message?)`
- **title**: string - Título del toast
- **message**: string? - Mensaje del toast
- **Duración**: 3 segundos

#### `showErrorToast(title, message?)`
- **title**: string - Título del toast
- **message**: string? - Mensaje del toast
- **Duración**: 5 segundos

#### `showWarningToast(title, message?)`
- **title**: string - Título del toast
- **message**: string? - Mensaje del toast
- **Duración**: 4 segundos

#### `showInfoToast(title, message?)`
- **title**: string - Título del toast
- **message**: string? - Mensaje del toast
- **Duración**: 4 segundos

## 🎨 Tipos de Notificaciones

### Alertas (Modales)

| Tipo | Icono | Color | Uso |
|------|-------|-------|-----|
| `success` | ✅ | Verde | Operaciones exitosas |
| `error` | ❌ | Rojo | Errores y fallos |
| `warning` | ⚠️ | Amarillo | Advertencias |
| `info` | ℹ️ | Azul | Información general |
| `confirm` | ❓ | Púrpura | Confirmaciones |

### Toasts

| Tipo | Icono | Color | Duración |
|------|-------|-------|----------|
| `success` | ✅ | Verde | 3s |
| `error` | ❌ | Rojo | 5s |
| `warning` | ⚠️ | Amarillo | 4s |
| `info` | ℹ️ | Azul | 4s |

## 🛠️ Personalización Avanzada

### Configuración personalizada de alertas

```tsx
import { useAlert } from '@/components/ui/notifications';

function MyComponent() {
  const { showAlert } = useAlert();

  const customAlert = () => {
    showAlert({
      type: 'warning',
      title: 'Título personalizado',
      message: 'Mensaje personalizado',
      icon: 'custom-icon', // Icono personalizado
      buttons: [
        { text: 'Acción 1', onPress: () => console.log('Acción 1') },
        { text: 'Acción 2', style: 'destructive', onPress: () => console.log('Acción 2') }
      ]
    });
  };
}
```

### Configuración personalizada de toasts

```tsx
import { useToast } from '@/components/ui/notifications';

function MyComponent() {
  const { showToast } = useToast();

  const customToast = () => {
    showToast({
      type: 'info',
      title: 'Notificación personalizada',
      message: 'Mensaje personalizado',
      duration: 6000, // 6 segundos
      icon: 'custom-icon'
    });
  };
}
```

## 🔧 Configuración del Provider

El `NotificationProvider` ya está configurado en `_layout.tsx`:

```tsx
import { NotificationProvider } from '@/components/ui/notifications';

export default function RootLayout() {
  return (
    <NotificationProvider>
      {/* Tu aplicación */}
    </NotificationProvider>
  );
}
```

## 📋 Lista de Migración

Para migrar completamente desde `Alert`, ejecuta:

```bash
node scripts/migrate-alerts.js
```

Este script te mostrará todos los archivos que necesitan migración y te dará sugerencias específicas.

## 🎭 Ejemplos de Uso Común

### Validación de formularios
```tsx
const { showError } = useAlertHelpers();

const validateForm = () => {
  if (!email) {
    showError("Error", "El email es obligatorio");
    return false;
  }
  return true;
};
```

### Confirmación de eliminación
```tsx
const { showConfirm } = useAlertHelpers();

const handleDelete = (item) => {
  showConfirm(
    "Eliminar elemento",
    `¿Estás segura de que quieres eliminar "${item.name}"?`,
    () => deleteItem(item.id),
    undefined,
    "Eliminar",
    "Cancelar"
  );
};
```

### Feedback de operaciones
```tsx
const { showSuccessToast, showErrorToast } = useToastHelpers();

const saveData = async () => {
  try {
    await api.save(data);
    showSuccessToast("Guardado", "Los datos se guardaron correctamente");
  } catch (error) {
    showErrorToast("Error", "No se pudieron guardar los datos");
  }
};
```

### Notificaciones de estado
```tsx
const { showInfoToast, showWarningToast } = useToastHelpers();

// Información
showInfoToast("Sincronizando", "Los datos se están actualizando...");

// Advertencia
showWarningToast("Conexión lenta", "La conexión a internet es lenta");
```

## 🌟 Ventajas sobre Alert nativo

1. **Diseño consistente** con la marca Aira
2. **Animaciones suaves** y profesionales
3. **Mejor UX** con toasts no intrusivos
4. **Más opciones** de personalización
5. **TypeScript completo** para mejor desarrollo
6. **Soporte para múltiples notificaciones**
7. **Interacciones gestuales** (deslizar para cerrar toasts)

## 🔮 Funcionalidades Futuras

- [ ] Notificaciones push integradas
- [ ] Sonidos personalizados
- [ ] Animaciones de entrada personalizables
- [ ] Posicionamiento configurable de toasts
- [ ] Persistencia de notificaciones importantes
- [ ] Integración con sistema de analytics

---

**¡El sistema está completamente funcional y listo para usar! 🚀** 