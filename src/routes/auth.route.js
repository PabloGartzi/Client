/**
 * Rutas de autenticación para login, logout y registro de usuarios en el frontend.
 * define las rutas de los formularios y envían los datos a la API del backend.
 * Utiliza controladores definidos en auth.controller.js para manejar la lógica de cada ruta.
 * @module routes.auth
 */

const express = require("express");
const router = express.Router();

const { vistaLogin, login, logout, signup, vistaSignup } = require("../controllers/auth.controller");

//vista formulario login (pinta el formulario)
/**
 * Ruta GET /login
 * Muestra el formulario de login.
 * @name GET /login
 * @function

 */
router.get('/login', vistaLogin)

//envio formulario login (envia el formulario a la API)
/**
 * Ruta POST /login
 * Envía los datos del formulario de login a la API para autenticación.
 * @name POST /login
 * @function

 */
router.post('/login', login)

//logout
/**
 * Ruta POST /logout
 * Cierra la sesión del usuario.
 * @name POST /logout
 * @function
  
 */
router.post('/logout', logout)

//vista formulario registro 
/**
 * Ruta GET /signup
 * Muestra el formulario de registro de usuario.
 * @name GET /signup
 * @function

 */
router.get('/signup', vistaSignup)

//envio formulario registro
/**
 * Ruta POST /signup
 * Envía los datos del formulario de registro a la API para crear un nuevo usuario.
 * Por defecto crea usuarios con rol 'user'.
 * @function
 * @name POST /signup
 */
router.post('/signup', signup)

module.exports = router