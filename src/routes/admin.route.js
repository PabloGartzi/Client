const express = require("express");
const router = express.Router();

// importar controladores
const {
    anadirPelicula,
    editarPelicula,
    borrarPelicula} = require("../controllers/admin.controller");

// Ruta crear pelicula

router.post('/createMovie',anadirPelicula )

//Ruta editar película

router.put('/editMovie/:id',editarPelicula)

//Ruta eliminar pelicula

router.delete('/removeMovie/:id',borrarPelicula)


module.exports = router;