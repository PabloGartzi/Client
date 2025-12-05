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
    userDashboard} = require("../controllers/user.controller");

// vista dashboard usuario
router.get('/dashboard', [auth], userDashboard)

// vista buscador
router.get('/search', [auth], vistaSearch)

// vista resultado buscador
router.post('/search/:title', [auth], search)

// recuperar contraseña
router.get('/recoverpassword', recoverPassword)

// cambiar contraseña
 router.put('/restorepassword', restorePassword)

// vista favoritos
router.get('/favoritos', [auth], accederFavoritos)

//guardar en favoritos
router.post('/anadirFavoritos', [auth], addFavoritos)

//vista detallada
router.get('/detalleFavorito',detalleFavorito)

//eliminar favoritos
router.delete('/deleteFavorito', [auth], deleteFavorito)

module.exports = router 