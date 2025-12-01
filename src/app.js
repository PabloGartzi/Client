const express = require("express");
require('dotenv').config()
var cors = require("cors");

const app = express()
const port = process.env.PORT;

cors({
  origin:["http://www.render.com"]
})


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




//LISTENER
app.listen(port, () => {
  console.log(`Server on port ${port}`);
});

