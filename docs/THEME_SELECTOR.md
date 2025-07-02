# Sistema de Selector de Temas

Este documento explica cómo usar el nuevo sistema de selector de temas que permite a los usuarios cambiar entre tema claro, oscuro y seguir el tema del sistema.

## Componentes Principales

### 1. ThemePreferenceContext

El contexto principal que maneja las preferencias de tema del usuario.

```typescript
import { useThemePreference } from '@/context/ThemePreferenceContext';

const { themeMode, actualTheme, setThemeMode, isLoading } = useThemePreference();
```

**Propiedades:**
- `themeMode`: El modo seleccionado por el usuario ('light', 'dark', 'system')
- `actualTheme`: El tema real aplicado ('light' o 'dark')
- `setThemeMode`: Función para cambiar el modo de tema
- `isLoading`: Indica si las preferencias están cargando

### 2. ThemeSelector

Componente visual que permite al usuario seleccionar el tema.

```typescript
import { ThemeSelector } from '@/components/ui/ThemeSelector';

<ThemeSelector onThemeChange={(theme) => console.log(theme)} />
```

**Props:**
- `onThemeChange?`: Callback opcional que se ejecuta cuando el tema cambia

### 3. useThemeColor (Actualizado)

Hook actualizado para usar las preferencias de tema en lugar del tema del sistema directamente.

```typescript
import { useThemeColor } from '@/hooks/useThemeColor';

const backgroundColor = useThemeColor(
  { light: '#ffffff', dark: '#000000' },
  'background'
);
```

## Integración en Topbar

Para agregar el selector de temas a una topbar, usa la prop `showThemeSelector`:

```typescript
<Topbar 
  title="Mi Pantalla" 
  showThemeSelector={true}
  actions={<OtherActions />}
/>
```

## Configuración en App Layout

El sistema está configurado en el layout principal de la aplicación:

```typescript
// app/_layout.tsx
<ThemePreferenceProvider>
  <AppContent />
</ThemePreferenceProvider>
```

## Opciones de Tema

El selector ofrece tres opciones:

1. **Claro**: Tema claro siempre
2. **Oscuro**: Tema oscuro siempre  
3. **Sistema**: Sigue la configuración del sistema del dispositivo

## Persistencia

Las preferencias del usuario se guardan automáticamente en AsyncStorage y se restauran al iniciar la aplicación.

## Migración desde el Sistema Anterior

Si tu código usa directamente `useColorScheme()`, cámbialo por `useThemePreference()`:

```typescript
// Antes
const colorScheme = useColorScheme() ?? 'light';

// Después
const { actualTheme } = useThemePreference();
```

## Ejemplos de Uso

### En un Componente
```typescript
import { useThemePreference } from '@/context/ThemePreferenceContext';

function MyComponent() {
  const { actualTheme, setThemeMode } = useThemePreference();
  
  return (
    <View style={{ 
      backgroundColor: actualTheme === 'dark' ? '#000' : '#fff' 
    }}>
      <Text>Tema actual: {actualTheme}</Text>
    </View>
  );
}
```

### En una Pantalla con Topbar
```typescript
export default function MyScreen() {
  return (
    <PageView>
      <Topbar 
        title="Mi Pantalla" 
        showThemeSelector={true}
      />
      {/* Contenido de la pantalla */}
    </PageView>
  );
}
```

## Notas Técnicas

- El sistema detecta automáticamente cambios en el tema del sistema cuando está en modo 'system'
- Las preferencias se cargan de forma asíncrona al iniciar la aplicación
- El contexto debe estar envolviendo toda la aplicación para funcionar correctamente
- Compatible con el sistema de temas existente de ThemeContext para variantes visuales 