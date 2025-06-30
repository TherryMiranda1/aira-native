const fs = require('fs');
const path = require('path');

function modifyForTestVersion(testSuffix = 'test') {
  console.log(`🔧 Modificando aplicación para versión de prueba: ${testSuffix}`);
  
  // Leer package.json para obtener la versión actual
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const currentVersion = packageJson.version;
  const testVersion = `${currentVersion}-${testSuffix}`;
  
  console.log(`📦 Versión original: ${currentVersion}`);
  console.log(`🧪 Versión de prueba: ${testVersion}`);
  
  // Modificar app.json
  const appJsonPath = 'app.json';
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  
  // Crear respaldo
  fs.writeFileSync(`${appJsonPath}.backup`, JSON.stringify(appJson, null, 2));
  
  // Aplicar modificaciones
  appJson.expo.name = `Aira (${testSuffix.toUpperCase()})`;
  appJson.expo.slug = `aira-native-${testSuffix}`;
  appJson.expo.version = testVersion;
  appJson.expo.android.package = `com.therrydzk.airanative.${testSuffix}`;
  
  fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
  console.log(`✅ app.json modificado`);
  
  // Modificar build.gradle
  const buildGradlePath = 'android/app/build.gradle';
  let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');
  
  // Crear respaldo
  fs.writeFileSync(`${buildGradlePath}.backup`, buildGradleContent);
  
  // Aplicar modificaciones
  buildGradleContent = buildGradleContent.replace(
    /applicationId 'com\.therrydzk\.airanative'/,
    `applicationId 'com.therrydzk.airanative.${testSuffix}'`
  );
  
  buildGradleContent = buildGradleContent.replace(
    /namespace 'com\.therrydzk\.airanative'/,
    `namespace 'com.therrydzk.airanative.${testSuffix}'`
  );
  
  buildGradleContent = buildGradleContent.replace(
    /versionName "1\.0\.0"/,
    `versionName "${testVersion}"`
  );
  
  fs.writeFileSync(buildGradlePath, buildGradleContent);
  console.log(`✅ build.gradle modificado`);
  
  console.log(`\n🎯 Modificaciones aplicadas:`);
  console.log(`   • Nombre de app: Aira (${testSuffix.toUpperCase()})`);
  console.log(`   • Package ID: com.therrydzk.airanative.${testSuffix}`);
  console.log(`   • Versión: ${testVersion}`);
  console.log(`   • Slug: aira-native-${testSuffix}`);
}

function restoreOriginalVersion() {
  console.log(`🔄 Restaurando versión original...`);
  
  const appJsonBackup = 'app.json.backup';
  const buildGradleBackup = 'android/app/build.gradle.backup';
  
  if (fs.existsSync(appJsonBackup)) {
    fs.copyFileSync(appJsonBackup, 'app.json');
    fs.unlinkSync(appJsonBackup);
    console.log(`✅ app.json restaurado`);
  }
  
  if (fs.existsSync(buildGradleBackup)) {
    fs.copyFileSync(buildGradleBackup, 'android/app/build.gradle');
    fs.unlinkSync(buildGradleBackup);
    console.log(`✅ build.gradle restaurado`);
  }
  
  console.log(`🎯 Versión original restaurada`);
}

// Ejecutar script
const args = process.argv.slice(2);
const command = args[0];
const testSuffix = args[1] || 'test';

if (command === 'modify') {
  modifyForTestVersion(testSuffix);
} else if (command === 'restore') {
  restoreOriginalVersion();
} else {
  console.log(`
📱 Script de Modificación para Versiones de Prueba

Uso:
  node scripts/modify-for-test.js modify [suffix]  - Modificar para versión de prueba
  node scripts/modify-for-test.js restore          - Restaurar versión original

Ejemplos:
  node scripts/modify-for-test.js modify beta      - Crear versión beta
  node scripts/modify-for-test.js modify alpha     - Crear versión alpha
  node scripts/modify-for-test.js modify test      - Crear versión test (default)
  node scripts/modify-for-test.js restore          - Volver a la versión original

⚠️  IMPORTANTE: Este script modifica archivos críticos. 
   Asegúrate de tener commits guardados antes de usar.
  `);
} 