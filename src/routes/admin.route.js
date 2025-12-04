const express = require("express");
const router = express.Router();
const {isAdmin}= require('../middelware/isAdmin')


// importar controladores
const {
    vistaCrearPeli,
    anadirPelicula,
    vistaEditarPeli,
    editarPelicula,
    borrarPelicula,
    adminDashboard
} = require("../controllers/admin.controller");

router.get('/dashboard',adminDashboard)
// Pintar el fromulario crear pelicula

router.get('/createMovie', vistaCrearPeli)

// Envíar formulario crear película

router.post('/createMovie',anadirPelicula )


// Pintar el fromulario editar pelicula

router.get('/createMovie', vistaEditarPeli)

//Enviar formulario editar película

router.put('/editMovie/:id',editarPelicula)

//Ruta eliminar pelicula

router.delete('/removeMovie/:id',borrarPelicula)


module.exports = router;