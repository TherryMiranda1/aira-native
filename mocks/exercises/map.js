const fs = require("fs");
const path = require("path"); // Módulo para trabajar con rutas de archivos

// --- 1. Lógica de Manipulación de Archivos (Lectura) ---
/**
 * Lee un archivo JSON y lo parsea a un objeto/array JavaScript.
 * @param {string} rutaArchivo La ruta al archivo JSON.
 * @returns {object | Array | null} El contenido parseado del JSON, o null si hay error.
 */
function leerArchivoJson(rutaArchivo) {
  try {
    if (!fs.existsSync(rutaArchivo)) {
      console.error(
        `Error (leerArchivoJson): El archivo '${rutaArchivo}' no fue encontrado.`
      );
      return null;
    }
    const contenidoArchivo = fs.readFileSync(rutaArchivo, "utf-8");
    return JSON.parse(contenidoArchivo);
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.error(
        `Error (leerArchivoJson): El archivo '${rutaArchivo}' no contiene un JSON válido. Detalles: ${error.message}`
      );
    } else {
      console.error(
        `Error (leerArchivoJson): Ocurrió un error inesperado al leer el archivo: ${error.message}`
      );
    }
    return null;
  }
}

// --- 2. Lógica de Mapeo Específica ---
/**
 * Mapea un array de ejercicios eliminando la propiedad 'peso_kg' de 'valores_ejemplo'.
 * @param {Array<object>} arrayEjercicios El array de objetos de ejercicio.
 * @returns {Array<object> | null} Un nuevo array con los ejercicios mapeados, o null si la entrada no es un array.
 */
function mapearEjerciciosEliminandoPesoKg(arrayEjercicios) {
  if (!Array.isArray(arrayEjercicios)) {
    console.error(
      "Error (mapearEjerciciosEliminandoPesoKg): La entrada no es un array."
    );
    return null;
  }

  const ejerciciosMapeados = JSON.parse(JSON.stringify(arrayEjercicios)); // Copia profunda

  ejerciciosMapeados.forEach((ejercicio) => {
    if (ejercicio && typeof ejercicio === "object") {
      if (
        ejercicio.valores_ejemplo &&
        typeof ejercicio.valores_ejemplo.peso_kg !== "undefined"
      ) {
        delete ejercicio.valores_ejemplo.peso_kg;
      }
      if (ejercicio.metricas_configurables) {
        delete ejercicio.metricas_configurables;
      }
    }
  });

  return ejerciciosMapeados;
}

// --- 3. Lógica de Manipulación de Archivos (Escritura) ---
/**
 * Guarda datos (objeto/array JavaScript) en un nuevo archivo JSON.
 * El nombre del nuevo archivo se deriva del original añadiendo un sufijo.
 * @param {object | Array} datos Los datos a guardar.
 * @param {string} rutaArchivoOriginal La ruta del archivo original (para derivar el nuevo nombre).
 * @param {string} [sufijo='-mapped'] El sufijo a añadir al nombre del archivo.
 * @returns {string | null} La ruta del archivo guardado, o null si hay error.
 */
function guardarDatosComoJson(datos, rutaArchivoOriginal, sufijo = "") {
  try {
    const dirName = path.dirname(rutaArchivoOriginal);
    const fileExtension = path.extname(rutaArchivoOriginal);
    const baseNameOriginal = path.basename(rutaArchivoOriginal, fileExtension);
    const nuevoNombreArchivo = `${baseNameOriginal}${sufijo}${fileExtension}`;
    const rutaArchivoDestino = path.join(dirName, nuevoNombreArchivo);

    fs.writeFileSync(
      rutaArchivoDestino,
      JSON.stringify(datos, null, 2),
      "utf-8"
    );
    console.log(`Datos guardados exitosamente en: '${rutaArchivoDestino}'`);
    return rutaArchivoDestino;
  } catch (error) {
    console.error(
      `Error (guardarDatosComoJson): Ocurrió un error al guardar el archivo: ${error.message}`
    );
    return null;
  }
}

// --- (Opcional) Lógica de Creación de Archivo de Ejemplo (Independiente) ---
// Se puede llamar manualmente si se necesita crear un archivo de prueba.
/**
 * Crea un archivo JSON de ejemplo para pruebas.
 * @param {string} rutaArchivo La ruta donde se creará el archivo.
 * @param {object | Array} datosEjemplo Los datos a escribir en el archivo.
 * @returns {boolean} true si se creó exitosamente, false en caso contrario.
 */

// --- Flujo Principal de Ejecución ---
function procesarArchivoDeEjercicios(rutaEntrada) {
  console.log(`\n--- Iniciando procesamiento para: ${rutaEntrada} ---`);

  const datosOriginales = leerArchivoJson(rutaEntrada);
  if (!datosOriginales) {
    console.error(
      "Procesamiento detenido: no se pudieron leer los datos originales."
    );
    return;
  }
  console.log("Paso 1: Archivo leído exitosamente.");

  const datosMapeados = mapearEjerciciosEliminandoPesoKg(datosOriginales);
  if (!datosMapeados) {
    console.error("Procesamiento detenido: error durante el mapeo de datos.");
    return;
  }
  console.log("Paso 2: Mapeo aplicado exitosamente.");

  const rutaArchivoMapeado = guardarDatosComoJson(datosMapeados, rutaEntrada);
  if (rutaArchivoMapeado) {
    console.log("Paso 3: Datos mapeados guardados exitosamente.");
  } else {
    console.error(
      "Procesamiento fallido: no se pudieron guardar los datos mapeados."
    );
  }
  console.log(`--- Procesamiento finalizado para: ${rutaEntrada} ---`);
}

// --- Obtener ruta del archivo desde los argumentos de la línea de comandos ---
const nombreArchivoEntrada = process.argv[2]; // El primer argumento real después de 'node' y 'script.js'

if (!nombreArchivoEntrada) {
  console.error(
    "Error: Por favor, proporciona la ruta al archivo JSON como argumento."
  );
  console.log("Uso: node nombre_del_script.js <ruta_al_archivo.json>");
  // Ejemplo para crear un archivo de prueba si se desea:
  // const datosEjemplo = [{ "id_ejercicio": "test_01", "valores_ejemplo": { "peso_kg": 10, "reps": 5 } }];
  // crearArchivoJsonEjemplo("ejemplo_entrada.json", datosEjemplo);
  // console.log("\nSe ha creado un archivo 'ejemplo_entrada.json' que puedes usar para probar.");
  process.exit(1); // Salir con código de error
}

// --- Ejecución ---
procesarArchivoDeEjercicios(nombreArchivoEntrada);
