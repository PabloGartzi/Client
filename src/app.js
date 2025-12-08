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


//TEMPLATES
  //Establecer ejs como template engine
app.set('view engine' , 'ejs')
app.set('views', __dirname+'/views')

//MIDDLEWARE
  //configurar carpeta public
const path = require('path'); // Asegúrate de requerir el módulo 'path'
app.use(express.static(__dirname+'/public'))

app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(session({
    secret: 'mi-super-secreto-para-sesion', // <-- Cambia esto
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, // Mantener en false si no usas HTTPS (localhost)
        maxAge: 1000 * 60 * 60 * 24 // 24 horas
    } 
}));


//RUTAS
app.use('/admin', require('./routes/admin.route'));
app.use('/', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));



//LISTENER
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

