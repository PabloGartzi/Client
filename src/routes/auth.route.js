const express = require("express");
const router = express.Router();

const { vistaLogin, login, logout, signup, vistaSignup } = require("../controllers/auth.controller");

//vista formulario login (pinta el formulario)
router.get('/login', vistaLogin)

//envio formulario login (envia el formulario a la API)
router.post('/login', login)

//logout
router.post('/logout', logout)

//vista formulario registro 
router.get('/signup', vistaSignup)

//envio formulario registro
router.post('/signup', signup)

module.exports = router