const express = require("express");
const router = express.Router();
const {    
    vistaSearch,
    search,
    vistaFavoritos,
    addFavoritos,
    deleteFavorito,
    recoverPassword,
    restorePassword,
    dashboard,
    detalleFavorito} = require("../controllers/user.controller");

// vista dashboard usuario
router.get('/dashboard',dashboard)

// vista buscador
router.get('/search',vistaSearch)

// vista resultado buscador
router.post('/search/:title',search)

// recuperar contraseña
router.get('/recoverpassword', recoverPassword)

// cambiar contraseña
 router.put('/restorepassword',restorePassword)

// vista favoritos
router.get('/favoritos',vistaFavoritos)

//guardar en favoritos
router.post('/anadirFavoritos',addFavoritos)

//vista detallada
router.get('/detalleFavorito',detalleFavorito)

//eliminar favoritos
router.delete('/deleteFavorito',deleteFavorito)

module.exports = router 