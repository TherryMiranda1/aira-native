# Sistema de Versionado para Pruebas

## 🎯 Propósito

Este sistema permite crear versiones de prueba de la aplicación Aira que son completamente independientes de la versión de producción, permitiendo instalar ambas versiones en el mismo dispositivo sin conflictos.

## 🔍 Identificadores de Aplicación Android

Una aplicación Android se identifica únicamente por varios elementos clave:

### 1. **Application ID** (más importante)
```gradle
applicationId 'com.therrydzk.airanative'
```
- Identificador único en Google Play Store
- NO puede duplicarse entre aplicaciones
- Debe ser único globalmente

### 2. **Namespace**
```gradle
namespace 'com.therrydzk.airanative'
```
- Espacio de nombres para recursos
- Generalmente coincide con applicationId

### 3. **Version Code & Version Name**
```gradle
versionCode 1
versionName "1.0.0"
```
- `versionCode`: Número entero para actualizaciones
- `versionName`: Versión visible para usuarios

## 🧪 Sistema de Versiones de Prueba

### Modificaciones Aplicadas

Para versiones de prueba (ej: suffix "test"):

| Elemento | Producción | Prueba |
|----------|------------|--------|
| **Application ID** | `com.therrydzk.airanative` | `com.therrydzk.airanative.test` |
| **Namespace** | `com.therrydzk.airanative` | `com.therrydzk.airanative.test` |
| **App Name** | `Aira` | `Aira (TEST)` |
| **Version** | `1.1.6` | `1.1.6-test` |
| **Package** | `com.therrydzk.airanative` | `com.therrydzk.airanative.test` |

## 🚀 Uso del Sistema

### Opción 1: GitHub Actions (Recomendado)

1. Ve a `Actions` en el repositorio
2. Selecciona `Build Test Version`
3. Configura los parámetros:
   - **Profile**: preview (recomendado)
   - **Environment**: qa/stg/main
   - **Test Suffix**: test/beta/alpha

### Opción 2: Scripts Locales

```bash
# Modificar para versión de prueba
npm run modify-test          # Suffix: test
npm run modify-beta          # Suffix: beta
npm run modify-alpha         # Suffix: alpha

# Restaurar versión original
npm run restore-original

# Uso manual del script
node scripts/modify-for-test.js modify [suffix]
node scripts/modify-for-test.js restore
```

### Opción 3: Comandos Manuales

```bash
# Modificar archivos manualmente
node scripts/modify-for-test.js modify beta

# Hacer build
eas build --platform android --profile preview

# Restaurar
node scripts/modify-for-test.js restore
```

## 📁 Archivos Modificados

El sistema modifica temporalmente:

1. **`app.json`**:
   - `expo.name`: Nombre visible de la app
   - `expo.slug`: Identificador de Expo
   - `expo.version`: Versión con suffix
   - `expo.android.package`: Package ID único

2. **`android/app/build.gradle`**:
   - `applicationId`: ID único de aplicación
   - `namespace`: Espacio de nombres
   - `versionName`: Versión visible

## ⚠️ Consideraciones Importantes

### Seguridad
- Los archivos originales se respaldan automáticamente
- Se restauran después del build (en GitHub Actions)
- Nunca commitear archivos modificados para prueba

### Instalación
- ✅ Versión de prueba y producción pueden coexistir
- ✅ Diferentes íconos y nombres en el dispositivo
- ✅ Configuraciones independientes
- ⚠️ Diferentes stores de datos locales

### Limitaciones
- Clerk Auth requiere configuración separada para cada package ID
- Push notifications necesitan configuración por separado
- Deep links pueden requerir ajustes

## 🔧 Troubleshooting

### Error: "App not found"
- Verificar que el EXPO_TOKEN esté configurado
- Confirmar que el proyecto existe en Expo

### Error: "Duplicate application ID"
- Asegurarse de que el suffix es único
- Verificar que no hay conflictos en Play Console

### Build fallido
- Verificar que los archivos fueron modificados correctamente
- Revisar logs de GitHub Actions
- Comprobar que las dependencias están instaladas

## 📊 Flujo de Trabajo Recomendado

1. **Desarrollo**:
   ```bash
   # Desarrollo normal
   npm run android
   ```

2. **Testing Interno**:
   ```bash
   # Build local de prueba
   npm run modify-test
   eas build --platform android --profile preview
   npm run restore-original
   ```

3. **QA/Beta Testing**:
   - Usar GitHub Actions con suffix "beta"
   - Distribuir APK a testers

4. **Pre-Producción**:
   - Usar GitHub Actions con suffix "staging"
   - Testing final antes de release

5. **Producción**:
   - Usar workflow original `Build-multibranch.yml`
   - Profile "production"

## 🎯 Beneficios

- ✅ **Coexistencia**: Producción y prueba en mismo dispositivo
- ✅ **Identificación Clara**: Nombres y íconos diferenciados  
- ✅ **Automatización**: Scripts y workflows automatizados
- ✅ **Seguridad**: Respaldos automáticos de archivos
- ✅ **Flexibilidad**: Múltiples tipos de prueba (test/beta/alpha)
- ✅ **Rastreabilidad**: Versiones claramente identificadas