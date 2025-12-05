const express = require("express");
const router = express.Router();

const { auth } = require('../middelware/auth')
const { isAdmin } = require('../middelware/isAdmin')


// importar controladores
const {
    vistaCrearPeli,
    anadirPelicula,
    vistaEditarPeli,
    editarPelicula,
    borrarPelicula,
    adminDashboard
} = require("../controllers/admin.controller");

router.get('/dashboard', auth, isAdmin, adminDashboard)
// Pintar el fromulario crear pelicula

router.get('/createMovie', auth, isAdmin, vistaCrearPeli)

// Envíar formulario crear película

router.post('/createMovie', auth, isAdmin, anadirPelicula )


// Pintar el fromulario editar pelicula

router.get('/editMovie/:id', auth, isAdmin, vistaEditarPeli)

//Enviar formulario editar película

router.put('/editMovie/:id', auth, isAdmin, editarPelicula)

//Ruta eliminar pelicula

router.delete('/removeMovie/:id', auth, isAdmin, borrarPelicula)


module.exports = router;