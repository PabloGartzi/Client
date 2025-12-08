/**
 * Rutas para la administración de películas.
 * Aquí se manejan las rutas para crear, editar y eliminar películas,
 * así como la vista del dashboard de administración.
 * @module routes/admin.route
 */
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

/**
 * Dashboard de administración.
 * Ruta protegida que te muestra todas las películas existentes.
 * @route GET /admin/dashboard
 * @access Private
 * @middleware auth Verifica la sesión del usuario.
 * @controller adminDashboard
 * @return {HTML} Vista del dashboard de administración. 
 */
router.get('/dashboard', [auth], adminDashboard)

/** 
 * Ruta para mostrar el formulario de creación de una nueva película.
 * @route GET /admin/createMovie
 * @access Private
 * @middleware auth Verifica la sesión del usuario.
 * @controller vistaCrearPeli
 * @return {HTML} Vista del formulario para crear una nueva película.
 */
router.get('/createMovie', [auth], vistaCrearPeli)

// Envíar formulario crear película.
// 1. auth: verifica la sesión. 2. uploadTemp: recibe el archivo. 3. anadirPelicula: lo envía a la API.
/**
 * Ruta crear una nueva película.
 * @route POST /admin/createMovie
 * @access Private
 * @middleware auth Verifica la sesión del usuario.
 * @middleware uploadTemp Sube la imagen temporalmente.
 * @controller anadirPelicula
 * @param {File} imagen Imagen de la película.
 * @return {HTML} Redirige al dashboard de administración tras crear la película.
 */
router.post('/createMovie', [auth, uploadTemp.single("imagen")], anadirPelicula )


// Pintar el fromulario editar pelicula
/**
 * Ruta que te muestra el formulario para editar una película según su id.
 * @route GET /admin/editMovie/:id
 * @access Private
 * @middleware auth Verifica la sesión del usuario.
 * @controller vistaEditarPeli
 * @param {string} id ID de la película a editar.
 * @return {HTML} Vista del formulario para editar la película con el id dado.
 */
router.get('/editMovie/:id', [auth], vistaEditarPeli)

// Enviar formulario editar película.
// Usamos POST para el formulario HTML. El controlador llama a la API con PUT.
/**
 * Ruta para editar una película según su id.
 * @route POST /admin/editMovie/:id
 * @access Private 
 * @middleware auth Verifica la sesión del usuario.
 * @middleware uploadTemp Sube la imagen temporalmente.
 * @controller editarPelicula
 */
router.post('/editMovie/:id', [auth, uploadTemp.single("imagen")], editarPelicula)

// Ruta eliminar pelicula.
// Usamos POST para el formulario HTML. El controlador llama a la API con DELETE.
/**
 * Ruta para eliminar una película según su id.
 * @route POST /admin/removeMovie/:id
 * @access Private
 * @middleware auth Verifica la sesión del usuario.
 * @controller borrarPelicula
 * @param {string} id ID de la película a eliminar.
 */
router.post('/removeMovie/:id', [auth], borrarPelicula) // Cambiado a POST

// Nota: Tu ruta original DELETE /removeMovie/:id no funcionará con un formulario EJS sin JS.

module.exports = router;