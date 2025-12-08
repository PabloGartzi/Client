// src/middlewares/upload_temp.js
const multer = require("multer");
const fs = require("fs");

// Crear la carpeta temporal si no existe
const tempDir = 'src/public/temp_uploads/';
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

// Configuración de Multer para guardar archivos temporalmente
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Los archivos se guardan en una carpeta temporal
        cb(null, tempDir); 
    },
    filename: (req, file, cb) => {
        // Nombre de archivo único
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploadTemp = multer({ storage: storage });

module.exports = {
    uploadTemp,
};