/**
 * Middleware para manejar la subida temporal de archivos usando Multer.
 * 
 * Los archivos se almacenan temporalmente en una carpeta específica antes de ser procesados o movidos a su ubicación final.
 * 
 * Ruta: Client/src/middelware/upload_temp.js
 * 
 * Dependencias:
 * - multer: Para manejar la subida de archivos.
 * - fs: Para manejar el sistema de archivos.
 * 
 * Configuración:
 * - Los archivos se guardan en 'src/public/temp_uploads/'.
 * - Los nombres de archivo son únicos, basados en la marca de tiempo y el nombre original del archivo.
 * Exporta el middleware 'uploadTemp' para ser utilizado en las rutas que requieren subida de archivos.
 * 
 * @module uploadTemp
 */

// src/middlewares/upload_temp.js
const multer = require("multer");
const fs = require("fs");

// Crear la carpeta temporal si no existe
const tempDir = 'src/public/temp_uploads/';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configuración de Multer para guardar archivos temporalmente
/**
 * Configuración de almacenamiento para Multer.
 * Los archivos se guardan en una carpeta temporal con nombres únicos.
 * @type {multer.StorageEngine}
 */
const storage = multer.diskStorage({
    /**
     * Destino de almacenamiento de los archivos subidos.
     * @param {Object} req - La solicitud HTTP.
     * @param {Object} file - El archivo subido.
     * @param {Function} cb - Callback para indicar el destino.
     */
    destination: (req, file, cb) => {
        // Los archivos se guardan en una carpeta temporal
        cb(null, tempDir); 
    },
    /**
     * Nombre del archivo subido.
     * @param {Object} req - La solicitud HTTP.
     * @param {Object} file - El archivo subido.
     * @param {Function} cb - Callback para indicar el nombre del archivo.
     */
    filename: (req, file, cb) => {
        // Nombre de archivo único
        cb(null, Date.now() + '-' + file.originalname);
    }
});

/**
 * Middleware de Multer para manejar la subida temporal de archivos.
 * @type {multer.Instance}
 */
const uploadTemp = multer({ storage: storage });

module.exports = {
    uploadTemp,
};