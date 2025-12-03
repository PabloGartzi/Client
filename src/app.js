const express = require("express");
require('dotenv').config()
var cors = require("cors");

const app = express()
const port = process.env.PORT;

cors({
  origin:["http://www.render.com"]
})

// instalar cookie-parser y requerir    



//TEMPLATES
  //Establecer ejs como template engine
app.set('view engine' , 'ejs')
app.set('views', __dirname+'/views')

//MIDDLEWARE
  //configurar carpeta public
app.use(express.static(__dirname+'/public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//RUTAS
app.use('/admin', require('./routes/admin.route'));
app.use('/', require('./routes/auth.route'));
app.use('/user', require('./routes/user.route'));


//LISTENER
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

