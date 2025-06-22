# Componentes del Dashboard

Esta carpeta contiene los componentes modulares para el dashboard principal de la aplicación nativa de Aira.

## Componentes

### DailyPhrase
Componente que muestra una frase inspiradora diaria obtenida del CMS.

**Props:**
- `showRefreshButton?: boolean` - Muestra botón para cambiar la frase (default: true)

**Características:**
- Obtiene frases del CMS usando `usePhrases`
- Permite refrescar la frase manualmente
- Maneja estados de carga y error
- Diseño consistente con el gradiente de la app

### MoodTracker
Componente para registrar el estado emocional del usuario.

**Props:**
- `title?: string` - Título del componente (default: "¿Cómo te sientes ahora mismo?")
- `onMoodSaved?: (mood: MoodType) => void` - Callback cuando se guarda un estado emocional

**Características:**
- 6 opciones de estado de ánimo predefinidas
- Guarda el estado en el CMS usando `useEvents`
- Retroalimentación visual al seleccionar
- Manejo de estados de carga

### DailySuggestion
Componente que muestra un mini reto diario aleatorio.

**Props:**
- `title?: string` - Título del componente (default: "Tu mini reto del día")
- `subtitle?: string` - Subtítulo (default: "Un pequeño paso hacia tu bienestar")
- `onChallengeClick?: (challenge: any) => void` - Callback personalizado al hacer clic

**Características:**
- Obtiene retos del CMS usando `useChallenges`
- Navegación automática a la página del reto
- Botón de refrescar para cambiar el reto
- Muestra dificultad y categoría

### AchievementsSummary
Componente que muestra un resumen de los logros del usuario.

**Props:**
- `className?: string` - Clases CSS adicionales

**Características:**
- Calcula estadísticas basadas en eventos del usuario
- Muestra días consecutivos, actividades completadas, etc.
- Mensajes motivacionales dinámicos
- Solo se muestra si hay suficientes datos

## Integración

Los componentes reemplazan las secciones hardcodeadas del archivo `app/(tabs)/index.tsx`:

```tsx
import { 
  DailyPhrase, 
  MoodTracker, 
  DailySuggestion, 
  AchievementsSummary 
} from "@/components/dashboard";

// En el render:
<DailyPhrase />
<MoodTracker onMoodSaved={handleMoodSaved} />
<DailySuggestion
  title="Tu mini reto del día"
  subtitle="Un pequeño paso hacia tu bienestar"
/>
<AchievementsSummary />
```

## Servicios Utilizados

- `usePhrases` - Para obtener frases inspiradoras
- `useEvents` - Para gestionar eventos (mood, retos, etc.)
- `useChallenges` - Para obtener mini retos
- `useUserProfile` - Para información del perfil del usuario

## Beneficios

1. **Modularidad**: Cada sección es un componente independiente
2. **Reutilización**: Los componentes pueden usarse en otras pantallas
3. **Mantenibilidad**: Código más organizado y fácil de mantener
4. **Datos dinámicos**: Reemplaza datos hardcodeados con información del CMS
5. **Consistencia**: Mantiene el diseño y UX de la aplicación 