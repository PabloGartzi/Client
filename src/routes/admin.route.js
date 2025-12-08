// admin.js (Rutas del servidor Frontend/EJS)

const express = require("express");
const router = express.Router();
const { auth } = require('../middelware/auth')
const { uploadTemp } = require('../middelware/upload_temp') // 👈 ¡Nuevo import!

// importar controladores
const {
    vistaCrearPeli,
    anadirPelicula,
    vistaEditarPeli,
    editarPelicula,
    borrarPelicula,
    adminDashboard
} = require("../controllers/admin.controller");

router.get('/dashboard', [auth], adminDashboard)

// Pintar el fromulario crear pelicula
router.get('/createMovie', [auth], vistaCrearPeli)

// Envíar formulario crear película.
// 1. auth: verifica la sesión. 2. uploadTemp: recibe el archivo. 3. anadirPelicula: lo envía a la API.
router.post('/createMovie', [auth, uploadTemp.single("imagen")], anadirPelicula )


// Pintar el fromulario editar pelicula
router.get('/editMovie/:id', [auth], vistaEditarPeli)

// Enviar formulario editar película.
// Usamos POST para el formulario HTML. El controlador llama a la API con PUT.
router.post('/editMovie/:id', [auth, uploadTemp.single("imagen")], editarPelicula)

// Ruta eliminar pelicula.
// Usamos POST para el formulario HTML. El controlador llama a la API con DELETE.
router.post('/removeMovie/:id', [auth], borrarPelicula) // Cambiado a POST

// Nota: Tu ruta original DELETE /removeMovie/:id no funcionará con un formulario EJS sin JS.

module.exports = router;