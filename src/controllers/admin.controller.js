const adminDashboard = async (req, res) => {
    // la prueba con h1 no funciona 
    try {
        const token = req.cookies.token;
        console.log(token)

        if (!token) {
            return res.redirect('/login');
        }
        const respuesta = await fetch("http://localhost:4001/admin/dashboard", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const peliculas = await respuesta.json();

        res.render('admin/adminDashboard', { peliculas });

    } catch (error) {
        console.log(error)
        res.redirect("/login");
    }
};


const vistaCrearPeli = async (req, res) => {
    res.render('admin/adminCrear.ejs')
    // Funciona bien 

}

const anadirPelicula = async (req, res) => {

    try {
        const { titulo, imagen, anio, director, genero, duracion_en_min, sinopsis } = req.body
        console.log(`${titulo} desde añadir pelicula`)

        const token = req.cookies?.token;

        if (!token) {
            return res.redirect('/dashboard');//debemos mandarnos al dashboard, simplemente limpiar o que salga un msg
        }

        const body = { titulo, imagen, anio, director, genero, duracion_en_min, sinopsis }

        const respuesta = await fetch("http://localhost:4001/admin/createMovie", {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })

        //const data = await respuesta.json();

        if (!respuesta.ok) {
            return res.send("Por favor, introduce todos los datos correctamente")
        }

        req.session.mensaje = "Película creada correctamente";
        return res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'contacte con el administrador'
        })

    }

}
//---------------FUNCION MODIFICADA PARA QUE FUNCIONE SUBIR IMAGENES CON MULTER !!----------------------

// const anadirPelicula = async (req, res) => {
//     try {
//         const { titulo, anio, director, genero, duracion_en_min, sinopsis } = req.body;
//         const token = req.cookies?.token;

//         if (!token) {
//             return res.redirect('/admin/dashboard'); // No autenticado
//         }

//         // Crear FormData para enviar al backend
//         const formData = new FormData();
//         formData.append("titulo", titulo);
//         formData.append("anio", anio);
//         formData.append("director", director);
//         formData.append("genero", genero);
//         formData.append("duracion_en_min", duracion_en_min);
//         formData.append("sinopsis", sinopsis);

//         // Si hay imagen subida
//         if (req.file) {
//             formData.append("imagen", req.file.buffer, req.file.originalname);
//         }

//         // Petición al backend
//         const respuesta = await fetch("http://localhost:4001/admin/createMovie", {
//             method: "POST",
//             body: formData,
//             headers: {
//                 "Authorization": `Bearer ${token}`
//             }
//         });

//         const data = await respuesta.json();

//         if (!respuesta.ok) {
//             return res.render("admin/adminCrear", { 
//                 msg: data.msg || "Error al crear la película",
//                 msgColor: "red"
//             });
//         }

//         return res.render("admin/adminDashboard", { 
//             msg: "Película creada correctamente",
//             msgColor: "green"
//         });

//     } catch (error) {
//         console.error(error);
//         return res.render("admin/adminCrear", { 
//             msg: "Error en el servidor",
//             msgColor: "red"
//         });
//     }
// };


// GET /admin/editMovie/:id
const vistaEditarPeli = async (req, res) => {
    // Funciona bien al poner un h1, pero no se ve la vista porque la variable pelicula no esta definida todavia
    //res.render('admin/adminEditar.ejs')

    try {
        const id = req.params.id;
        const token = req.cookies.token;

        const respuesta = await fetch(`http://localhost:4001/admin/editMovie/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const pelicula = await respuesta.json();

        res.render("admin/adminEditar.ejs", { pelicula });

    } catch (error) {
        console.log(error);
        res.redirect("/admin/dashboard");
    }
};


const editarPelicula = async (req, res) => {
    // Al probar con h1 No funciona porque no tenemos id todavia

    try {

        const id = req.params.id;
        const token = req.cookies.token;
        //console.log(token)

        const { titulo, imagen, anio, director, genero, duracion_en_min, sinopsis } = req.body
        console.log(`${titulo} desde editar pelicula`)

        //if (!token) {
        // return res.redirect('/dashboard');//debemos mandarnos al dashboard, simplemente limpiar o que salga un msg
        //}

        const body = { titulo, imagen, anio, director, genero, duracion_en_min, sinopsis }

        const respuesta = await fetch(`http://localhost:4001/admin/editMovie/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`
            }
        })

        //const data = await respuesta.json();

        if (!respuesta.ok) {
            return res.send("Error al editar la película")
        }

        req.session.mensaje = "Película modificada correctamente";
        return res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Error interno del servidor'
        })

    }


}

const borrarPelicula = async (req, res) => {
   
    try {
        const id = req.params.id;
        const token = req.cookies.token;

        const respuesta = await fetch(`http://localhost:4001/admin/removeMovie/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!respuesta.ok) {
            return res.send("No se pudo eliminar la película.");
        }

        req.session.mensaje = "Película eliminada correctamente";
        res.redirect("/admin/dashboard");

    } catch (error) {
        console.log(error);
        res.status(500).send("Error en el servidor");
    }

}

module.exports = {
    adminDashboard,
    vistaCrearPeli,
    anadirPelicula,
    vistaEditarPeli,
    editarPelicula,
    borrarPelicula,
}