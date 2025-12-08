/**
 * Rutas del usuario para el frontend.
 * Incluye rutas para el dashboard del usuario, búsqueda de películas,
 * gestión de favoritos y recuperación de contraseña.
 * Utiliza controladores definidos en user.controller.js para manejar la lógica de cada ruta.
 * Utiliza middleware de autenticación y autorización para proteger las rutas.
 * @module routes/user.route.js
 */


const express = require("express");
const router = express.Router();
const {isUser} = require("../middelware/isUser");
const {auth} = require("../middelware/auth");


const {    
    vistaSearch,
    search,
    addFavoritos,
    deleteFavorito,
    recoverPassword,
    restorePassword,
    accederFavoritos,
    detalleFavorito,
    logout,
    userDashboard} = require("../controllers/user.controller");

// vista dashboard usuario
/**
 * Ruta GET /dashboard
 * Muestra el dashboard del usuario.
 * @name GET /dashboard
 * @function
 */
router.get('/dashboard', [auth], userDashboard)

// vista buscador
/**
 * Ruta GET /search
 * Muestra el formulario de búsqueda de películas.
 * @name GET /search
 * @function
 */
router.get('/search', [auth], vistaSearch)

// vista resultado buscador
/**
 * Ruta POST /search/pelicula
 * Envía los datos del formulario de búsqueda a la API y muestra los resultados.
 * @name POST /search/pelicula
 * @function
 */
router.post('/search/pelicula', [auth], search)

// recuperar contraseña
/**
 * Ruta GET /recoverpassword
 * Muestra el formulario para recuperar la contraseña.
 * @name GET /recoverpassword
 * @function
 */
router.get('/recoverpassword', recoverPassword)

// cambiar contraseña
/**
 * Ruta PUT /restorepassword
 * Envía los datos del formulario para restaurar la contraseña.
 * @name PUT /restorepassword
 * @function
 */
 router.put('/restorepassword', restorePassword)

// vista favoritos
/**
 * Ruta GET /favoritos
 * Muestra la lista de películas favoritas del usuario.
 * @name GET /favoritos
 * @function
 */
router.get('/favoritos', [auth], accederFavoritos)

//guardar en favoritos
/**
 * Ruta POST /anadirFavoritos
 * Añade una película a la lista de favoritos del usuario.
 * @name POST /anadirFavoritos
 * @function
 */
router.post('/anadirFavoritos', [auth], addFavoritos)

//vista detallada
/**
 * Ruta GET /detalleFavorito/:id
 * Muestra los detalles de una película favorita específica.
 * @name GET /detalleFavorito/:id
 * @function
 */
router.get('/detalleFavorito/:id',detalleFavorito)

//eliminar favoritos
/**
 * Ruta POST /deleteFavorito
 * Elimina una película de la lista de favoritos del usuario.
 * @name POST /deleteFavorito
 * @function
 */
router.post('/deleteFavorito', [auth], deleteFavorito)

//logout
/**
 * Ruta GET /logout
 * Cierra la sesión del usuario.
 * @name GET /logout
 * @function
 */
router.get('/logout', [auth], logout);


module.exports = router 