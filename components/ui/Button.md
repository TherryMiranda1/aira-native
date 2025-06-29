# Componente Button

Un componente de botón reutilizable y altamente personalizable para la aplicación Aira Native.

## Variantes

### Default
- **Background**: `foreground` (color de texto principal)
- **Text**: `card` (color de fondo de tarjeta, generalmente blanco)
- **Uso**: Botones principales rápidos, acciones destacadas

```tsx
<Button variant="default" text="Botón Default" />
```

### Primary
- **Background**: `primary` (color primario de Aira)
- **Text**: `card` (color de fondo de tarjeta, generalmente blanco)
- **Uso**: Acciones principales, CTAs importantes

```tsx
<Button variant="primary" text="Botón Primary" />
```

### Ghost
- **Background**: Transparente
- **Text**: `foreground` (color de texto principal)
- **Uso**: Botones sutiles, acciones terciarias

```tsx
<Button variant="ghost" text="Botón Ghost" />
```

### Border
- **Background**: Transparente
- **Border**: `foreground` (borde con color de texto principal)
- **Text**: `foreground` (color de texto principal)
- **Uso**: Botones de contorno, acciones secundarias con más énfasis que ghost

```tsx
<Button variant="border" text="Botón Border" />
```

## Tamaños

### Small (sm)
- **Padding**: 8px vertical, 12px horizontal
- **Min Height**: 36px
- **Font Size**: 14px

### Medium (md) - Por defecto
- **Padding**: 12px vertical, 16px horizontal
- **Min Height**: 44px
- **Font Size**: 16px

### Large (lg)
- **Padding**: 16px vertical, 20px horizontal
- **Min Height**: 52px
- **Font Size**: 18px

## Propiedades

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'ghost' \| 'border'` | `'default'` | Variante visual del botón |
| `text` | `string` | - | Texto que se muestra en el botón |
| `leftIcon` | `React.ReactNode` | `undefined` | Ícono opcional a la izquierda del texto |
| `rightIcon` | `React.ReactNode` | `undefined` | Ícono opcional a la derecha del texto |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Tamaño del botón |
| `fullWidth` | `boolean` | `false` | Si el botón debe ocupar todo el ancho disponible |
| `disabled` | `boolean` | `false` | Si el botón está deshabilitado |

## Ejemplos de Uso

### Botón Simple
```tsx
<Button 
  variant="primary" 
  text="Guardar" 
  onPress={() => console.log('Presionado')} 
/>
```

### Botón con Ícono Izquierdo
```tsx
<Button 
  variant="primary" 
  text="Agregar"
  leftIcon={<Ionicons name="add" size={20} color={AiraColors.card} />}
/>
```

### Botón con Ícono Derecho
```tsx
<Button 
  variant="border" 
  text="Siguiente"
  rightIcon={<Ionicons name="arrow-forward" size={20} color={AiraColors.foreground} />}
/>
```

### Botón con Ambos Íconos
```tsx
<Button 
  variant="default" 
  text="Descargar"
  leftIcon={<Ionicons name="download" size={20} color={AiraColors.card} />}
  rightIcon={<Ionicons name="cloud" size={20} color={AiraColors.card} />}
/>
```

### Botón de Ancho Completo
```tsx
<Button variant="primary" text="Continuar" fullWidth />
```

### Botón Deshabilitado
```tsx
<Button variant="primary" text="Cargando..." disabled />
```

### Diferentes Tamaños
```tsx
<Button variant="primary" text="Pequeño" size="sm" />
<Button variant="primary" text="Mediano" size="md" />
<Button variant="primary" text="Grande" size="lg" />
```

## Integración con el Sistema de Temas

El componente utiliza automáticamente los colores de Aira para:
- Aplicar el radio de borde correcto según las variantes de tema
- Mantener consistencia visual con el resto de la aplicación
- Usar los colores apropiados para texto e íconos según la variante

## Estados

### Normal
Todos los botones tienen una opacidad activa de 0.8 cuando se presionan.

### Deshabilitado
- Opacidad reducida a 0.6
- Color de texto cambia a `mutedForeground`
- Para variantes con fondo, el fondo cambia a `muted`
- El botón no responde a toques

## Accesibilidad

El componente hereda todas las propiedades de `TouchableOpacity`, incluyendo:
- `accessibilityLabel`
- `accessibilityHint`
- `accessibilityRole` (automáticamente establecido como "button")

```tsx
<Button 
  variant="primary"
  text="Guardar"
  accessibilityLabel="Guardar configuración"
  accessibilityHint="Guarda los cambios realizados en la configuración"
/>
```

## Ventajas de la Nueva API

### Simplicidad
- Solo necesitas pasar el texto como string
- Los íconos son opcionales y fáciles de añadir
- Estilos de texto consistentes automáticamente

### Consistencia
- Todos los botones usan el mismo tipo de texto (`defaultSemiBold`)
- Colores automáticos según la variante
- Tamaños de fuente apropiados para cada tamaño de botón

### Flexibilidad
- Íconos izquierdo y derecho independientes
- Soporte completo para todas las props de `TouchableOpacity`
- Fácil personalización con la prop `style` 