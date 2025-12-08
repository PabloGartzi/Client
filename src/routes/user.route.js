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
router.get('/dashboard', [auth], userDashboard)

// vista buscador
router.get('/search', [auth], vistaSearch)

// vista resultado buscador
router.post('/search/pelicula', [auth], search)

// recuperar contraseña
router.get('/recoverpassword', recoverPassword)

// cambiar contraseña
 router.put('/restorepassword', restorePassword)

// vista favoritos
router.get('/favoritos', [auth], accederFavoritos)

//guardar en favoritos
router.post('/anadirFavoritos', [auth], addFavoritos)

//vista detallada
router.get('/detalleFavorito/:id',detalleFavorito)

//eliminar favoritos
router.post('/deleteFavorito', [auth], deleteFavorito)

//logout
router.get('/logout', [auth], logout);


module.exports = router 