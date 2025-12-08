/**
 * APP PRINCIPAL
 * Aquí se configura el cliente, los middlewares y las rutas principales
 * Autor: Sonia, Pablo, Sergio y Esther
 * Fecha: Diciembre 2025
 * @module client/app
 */
const express = require("express");
require('dotenv').config()
var cors = require("cors");

const app = express()
const port = process.env.PORT;

cors({
  origin:["http://www.render.com"]
})

var cookieParser = require('cookie-parser')
const session = require('express-session'); // 👈 Importar

//----------------------------------------------------------------------------------------
//TEMPLATES
//----------------------------------------------------------------------------------------

/**
 * Configuración del motor de plantillas EJS
 * @see {@link https://ejs.co/}
 */
app.set('view engine' , 'ejs')
app.set('views', __dirname+'/views')

//----------------------------------------------------------------------------------------
//MIDDLEWARES
//----------------------------------------------------------------------------------------

//configurar carpeta public
const path = require('path'); // Asegúrate de requerir el módulo 'path'

/**
 * Configuración de la carpeta pública para servir archivos estáticos
 * @see {@link https://expressjs.com/en/starter/static-files.html}
 */
app.use(express.static(__dirname+'/public'))

app.use(express.static(path.join(__dirname, 'src', 'public')));

/**
 * Middlewares para parsear JSON en las solicitudes
 */
app.use(express.json());
/**
 * Middlewares para parsear datos de formularios en las solicitudes
 */
app.use(express.urlencoded({ extended: true }));
/**
 * Configuración de cookies y sesiones
 */
app.use(cookieParser())
/** 
 * Configuración de la sesión de usuario
 * @see {@link https://www.npmjs.com/package/express-session}
 */
app.use(session({
    secret: 'mi-super-secreto-para-sesion', // <-- Cambia esto
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Mantener en false si no usas HTTPS (localhost)
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    } 
}));

//----------------------------------------------------------------------------------------
//RUTAS PRINCIPALES
//----------------------------------------------------------------------------------------

/**
 * Rutas para la administración del sitio
 * @type {import('express').Router}
 */
app.use('/admin', require('./routes/admin.route'));
/** 
 * Rutas para la autenticación de usuarios
 * @type {import('express').Router}
*/
app.use('/', require('./routes/auth.route'));
/**
 * Rutas para la gestión de los usuarios
 * @type {import('express').Router}
 */
app.use('/user', require('./routes/user.route'));


//----------------------------------------------------------------------------------------
//LISTENER
//----------------------------------------------------------------------------------------

/**
 * Inicia el servidor en el puerto especificado
 */
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});



