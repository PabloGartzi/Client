/**
 * Controlador para las rutas de administración de películas en el frontend.
 * Comunica con la API para gestionar películas mediante fetch y maneja vistas EJS.
 * Utiliza node-fetch para solicitudes HTTP y form-data para envíos con archivos.
 * Cada función maneja errores y redirecciones según sea necesario.
 * @module controllers/admin.controller
 */

const fetch = require('node-fetch'); 
const FormData = require('form-data');
const fs = require('fs');

const API_BASE_URL = "http://localhost:4001/admin"; 

/**
 * Obtiene el token JWT almacenado en las cookies del usuario.
 * @param {Object} req - Objeto de solicitud Express.
 * @returns {string|undefined} - El token JWT o undefined si no existe.
 */
const getTokenFromCookies = (req) => req.cookies?.token;


/**
 * Funcion controladora que renderiza el dashboar de admin con todas las peliculas.
 * Realiza una solicitud GET a la API para obtener las peliculas.
 * Maneja errores y redirecciones según la respuesta de la API. 
 * @async
 * @function adminDashboard
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
const adminDashboard = async (req, res) => {
    try {
        const token = getTokenFromCookies(req);
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const respuesta = await fetch(`${API_BASE_URL}/dashboard`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
             req.session.error = data.msg || "Error al cargar el dashboard. ¿Sesión expirada?";
             return res.redirect('/login');
        }

        const mensaje = req.session.mensaje;
        const error = req.session.error;
        delete req.session.mensaje;
        delete req.session.error;

        res.render('admin/adminDashboard', { 
            peliculas: data.data || [], 
            mensaje,
            error
        });

    } catch (error) {
        console.error("Error en adminDashboard:", error);
        req.session.error = "Error interno del servidor al acceder al dashboard.";
        res.redirect("/login");
    }
};

/**
 * Renderiza la vista para crear una nueva película.
 * @function vistaCrearPeli
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 */
const vistaCrearPeli = (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render('admin/adminCrear.ejs', { error }); 
}


/**
 * Renderiza la vista para editar una película existente.
 * Obtiene los datos de la película desde la API usando su ID.
 * Maneja errores y redirecciones según la respuesta de la API.
 * @async
 * @function vistaEditarPeli
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {object} req.params - Parámetros de la ruta.
 * @param {string} req.params.id - ID de la película a editar.
 */
const vistaEditarPeli = async (req, res) => {
    const id = req.params.id;
    const token = getTokenFromCookies(req);

    if (!token) return res.redirect('/login');

    try { //Llamar al backend, a la API
        const respuesta = await fetch(`${API_BASE_URL}/dashboard/${id}`, { 
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log ('hemos traido la info del server')
        const data = await respuesta.json();
        console.log("<===================DATA======================>", data)
        if (!respuesta.ok) {
            console.log('estamos aquiiiiiiiiiiiiiiiiii')
            req.session.error = data.msg || "Película no encontrada o error de permisos.";
            return res.redirect('/admin/dashboard');
        }

        const error = req.session.error;
        delete req.session.error;
        //console.log('estamos por hacer el render vista editar peli', data)
        res.render("admin/adminEditar.ejs", { 
            pelicula: data.data, 
            error: error 
        });

    } catch (error) {
        console.error("Error en vistaEditarPeli:", error);
        req.session.error = "Error interno al obtener datos de la película.";
        res.redirect("/admin/dashboard");
    }
};

/**
 * Controlador para añadir una nueva película.
 * Recibe datos del formulario y un archivo de imagen.
 * Envía una solicitud POST a la API con los datos  utilizando multipart/from data y maneja la respuesta.
 * @async
 * @function anadirPelicula
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Object} req.body - Datos enviados desde el formulario
 * @param {string} req.body.titulo - Título de la película
 * @param {string|number} req.body.anio - Año de lanzamiento
 * @param {string} req.body.director - Director de la película
 * @param {string} req.body.genero - Género de la película
 * @param {string|number} req.body.duracion_en_min - Duración en minutos
 * @param {string} req.body.sinopsis - Sinopsis de la película
 * @param {Object} req.file - Archivo temporal subido por Multer
 * @param {string} req.file.path - Ruta del archivo temporal
 * @param {string} req.file.originalname
 * @param {string} req.file.mimetype
 */
const anadirPelicula = async (req, res) => {
    const token = getTokenFromCookies(req);
    const file = req.file; // Archivo temporal de Multer
    const filePath = file?.path; // Ruta del archivo temporal
    
    
    try {
        const { titulo, anio, director, genero, duracion_en_min, sinopsis } = req.body;
        
        if (!token) {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.redirect('/login');
        }
        
        if (!file) {
             req.session.error = "Debe subir una imagen para la película.";
             return res.redirect('/admin/createMovie'); 
        }

        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('anio', anio);
        formData.append('director', director);
        formData.append('genero', genero);
        formData.append('duracion_en_min', duracion_en_min);
        formData.append('sinopsis', sinopsis);
        
        formData.append('imagen', fs.createReadStream(filePath), {
             filename: file.originalname, // Nombre para el backend
             contentType: file.mimetype,
        });
        
        const respuesta = await fetch(`${API_BASE_URL}/createMovie`, {
            method: 'POST',
            body: formData, 
            headers: {
                "Authorization": `Bearer ${token}`,
                ...formData.getHeaders() // Necesario para el Content-Type multipart
            }
        });
        
        //  Limpiar el archivo temporal de inmediato
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); 

        if (!respuesta.ok) {
             const errorData = await respuesta.json();
             const errorMsg = errorData.errors ? 
                 Object.values(errorData.errors).map(e => e.msg).join('; ') : 
                 errorData.msg || 'Error al crear la película en la API.';
             req.session.error = errorMsg;
             return res.redirect('/admin/createMovie'); 
        }

        req.session.mensaje = "Película creada correctamente";
        return res.redirect('/admin/dashboard');

    } catch (error) {
        console.error("Error en anadirPelicula:", error);
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); 
        req.session.error = "Error interno del servidor al procesar la subida.";
        return res.redirect('/admin/createMovie');
    }
}

/**
 * Controlador para editar una película existente.
 * Recibe datos del formulario y opcionalmente un archivo de imagen.
 * Envía una solicitud POST a la API con los datos utilizando multipart/form-data y maneja la respuesta.
 * @async
 * @function editarPelicula
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Object} req.params - Parámetros de la ruta.
 * @param {string} req.params.id - ID de la película a actualizar
 * @param {Object} req.body - Datos enviados desde el formulario
 * @param {string} req.body.titulo - Título de la película
 * @param {string|number} req.body.anio - Año de lanzamiento
 * @param {string} req.body.director - Director de la película
 * @param {string} req.body.genero - Género de la película
 * @param {string|number} req.body.duracion_en_min - Duración en minutos
 * @param {string} req.body.sinopsis - Sinopsis de la película
 * @param {Object} [req.file] - Archivo nuevo subido (opcional)
 * @param {string} req.file.path
 */
const editarPelicula = async (req, res) => {
    const token = getTokenFromCookies(req);
    const id = req.params.id
    const file = req.file;  
    const filePath = file?.path;
    console.log('hemos entrado y capturado la info : id',id)

    try {
        if (!token) {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return res.redirect('/login');
        }

        const { titulo, anio, director, genero, duracion_en_min, sinopsis } = req.body;
        
        const formData = new FormData();
        formData.append('titulo', titulo);
        formData.append('anio', anio);
        formData.append('director', director);
        formData.append('genero', genero);
        formData.append('duracion_en_min', duracion_en_min);
        formData.append('sinopsis', sinopsis);
        // Agregar el archivo solo si se subió uno nuevo
        if (filePath) {
            formData.append('imagen', fs.createReadStream(filePath), {
                 filename: file.originalname,
                 contentType: file.mimetype,
            });
        }   
        console.log(id)
        const respuesta = await fetch(`${API_BASE_URL}/editMovie/${id}`, {
            method: 'POST', 
            body: formData, 
            headers: {
                "Authorization": `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });
        console.log("<===============================RESPUESTA=================================>",respuesta, "<===============================RESPUESTA=================================>")
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath); // Limpiar

        if (!respuesta.ok) {
             const errorData = await respuesta.json();
             const errorMsg = errorData.errors ? 
                 Object.values(errorData.errors).map(e => e.msg).join('; ') : 
                 errorData.msg || 'Error de actualización en la API.';
             req.session.error = errorMsg;
             return res.redirect(`/admin/editMovie/${id}`); 
        }
        
        req.session.mensaje = "Película modificada correctamente";
        return res.redirect('/admin/dashboard');

    } catch (error) {
        console.error("Error en editarPelicula:", error);
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        req.session.error = 'Error interno del servidor al actualizar.';
        return res.redirect(`/admin/editMovie/${id}`); 
    }
}

/**
 * Controlador para eliminar una película existente.
 * Envía una solicitud DELETE a la API con el ID de la película.
 * Maneja la respuesta y redirige al dashboard con mensajes de éxito o error.
 * @async
 * @function borrarPelicula
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @param {Object} req.params - Parámetros de la ruta.
 * @param {string} req.params.id - ID de la película a eliminar
 */
const borrarPelicula = async (req, res) => {
    try {
        const id = req.params.id;
        const token = getTokenFromCookies(req);

        if (!token) return res.redirect('/login');

        const respuesta = await fetch(`${API_BASE_URL}/removeMovie/${id}`, {
            method: "DELETE", 
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!respuesta.ok) {
             const errorData = await respuesta.json();
             req.session.error = errorData.msg || "No se pudo eliminar la película.";
        } else {
             req.session.mensaje = "Película eliminada correctamente";
        }

        res.redirect("/admin/dashboard");

    } catch (error) {
        console.log("Error en borrarPelicula:", error);
        req.session.error = "Error interno del servidor al intentar eliminar.";
        res.redirect("/admin/dashboard");
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