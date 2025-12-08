/**
 * Controlador de usuario para frontend.
 * Incluye funciones para manejar la vista del buscador, búsqueda de películas,
 * gestión de favoritos, recuperación y restauración de contraseña, y dashboard de usuario.
 * 
 * @module controllers/user.controller
 */

/**
 * Muestra la vista del formulario de búsqueda de películas.
 * @memberof module:controllers/user.controller 
 * @function vistaSearch
 * @param {object} req 
 * @param {object} res 
 */
const vistaSearch = async (req, res) => {
    res.render('user/userBuscador')
}


/**
 * Recibe los datos del formulario de búsqueda de películas,
 * envía la solicitud a la API y muestra los resultados en la vista correspondiente.
 * @memberof module:controllers/user.controller 
 * @function search
 * @param {object} req 
 * @param {object} res 
 * @param {string} req.body.titulo - Título de la película a buscar.
 * @param {string} req.cookies.token - Token de autenticación del usuario.
 * @param {object} respuesta - Respuesta de la API con los resultados de la búsqueda.
 * @param {object} data - Datos JSON obtenidos de la respuesta de la API.
 * @param {string} res.render - Renderiza la vista con los resultados o un mensaje de error.
 * @param {string} token - Token de autenticación del usuario.
 * @throws {Error} Lanza un error si ocurre un problema durante la búsqueda.
 * @returns {void}
 */
const search = async (req, res) => {
    try {
        const { titulo } = req.body;
        const token = req.cookies?.token;
        if (!token) {
            return res.redirect('/login');
        }
        const respuesta = await fetch(
            `http://localhost:4001/user/search?titulo=${encodeURIComponent(titulo)}`,
            {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        console.log(respuesta)
        if (!respuesta.ok) {
            return res.render("user/userBuscador.ejs", {
                error: "No se pudo completar la búsqueda"
            });
        }

        const data = await respuesta.json();
        console.log("RESULTADO BUSQUEDA:", data);

        res.render("user/userResultadoBuscador.ejs", {
            respuesta: data,
            error: null
        });

    } catch (error) {
        console.error('Error en searchFront:', error);
        return res.status(500).send("Error interno del servidor");
    }
};


/**
 * Añade una película a la lista de favoritos del usuario.
 * @memberof module:controllers/user.controller
 * @function addFavoritos
 * @param {object} req 
 * @param {object} res 
 * @param {string} req.body.id_peliculas - ID de la película a añadir a favoritos.
 * @param {string} req.cookies.token - Token de autenticación del usuario.
 * @param {object} respuesta - Respuesta de la API tras intentar añadir a favoritos.
 * @param {object} data - Datos JSON obtenidos de la respuesta de la API.
 * @param {string} res.redirect - Redirige a la vista de favoritos tras añadir la película. 
 * @param {string} req.session.mensaje - Mensaje de éxito almacenado en la sesión.
 * @param {string} token - Token de autenticación del usuario.
 * @param {number} id_peliculas - ID de la película a añadir a favoritos.
 * @throws {Error} Lanza un error si ocurre un problema durante el proceso.
 * @returns {void}
 */
const addFavoritos = async (req, res) => {
    try {
        const { id_peliculas } = req.body;
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ ok: false, msg: "Usuario no autenticado" });
        }
        const respuesta = await fetch("http://localhost:4001/user/anadirFavoritos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  
            },
            body: JSON.stringify({ id_peliculas })
        });
        console.log(respuesta)        
        const data = await respuesta.json();
        if (respuesta.status == 400) {
            return deleteFavorito(req, res)
        }
        req.session = req.session || {};
        req.session.mensaje = "Película agregada a favoritos correctamente";

        return res.redirect("/user/favoritos")

    } catch (error) {
        console.error('Error en addFavoritos:', error);
        return res.status(500)
    }
};

/**
 * Muestra la lista de películas favoritas del usuario.
 * @memberof module:controllers/user.controller
 * @function accederFavoritos   
 * @param {object} req 
 * @param {object} res 
 * @param {string} req.cookies.token - Token de autenticación del usuario.
 * @param {object} respuesta - Respuesta de la API con la lista de favoritos.
 * @param {object} data - Datos JSON obtenidos de la respuesta de la API.
 * @param {string} res.render - Renderiza la vista con la lista de favoritos o el dashboard si hay un error.
 * @param {string} token - Token de autenticación del usuario.
 * @throws {Error} Lanza un error si ocurre un problema durante el proceso.
 * @returns {void}
 */
const accederFavoritos = async (req, res) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const respuesta = await fetch("http://localhost:4001/user/favoritos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            return res.render('user/dashboard');
        }

        return res.render('user/userPelisFavoritas', {
            respuesta: data, // aquí se usa 'respuesta' en EJS
            error: null
        });

    } catch (error) {
        console.error('Error en obtenerFavoritos:', error);
        return res.render('user/favoritos');
    }
};

/**
 * Elimina una película de la lista de favoritos del usuario.
 * @memberof module:controllers/user.controller
 * @function deleteFavorito
 * @param {object} req  
 * @param {object} res
 * @param {string} req.body.id_peliculas - ID de la película a eliminar de favoritos.
 * @param {string} req.cookies.token - Token de autenticación del usuario.
 * @param {object} respuesta - Respuesta de la API tras intentar eliminar de favoritos.
 * @param {string} res.redirect - Redirige a la vista de favoritos tras eliminar la película. 
 * @param {string} token - Token de autenticación del usuario.
 * @param {number} id_peliculas - ID de la película a eliminar de favoritos.
 * @throws {Error} Lanza un error si ocurre un problema durante el proceso.
 * @returns {void}
 */
const deleteFavorito = async (req, res) => {
    try {
        const { id_peliculas } = req.body;
        const token = req.cookies?.token;
        console.log(token)
        if (!token) {
            return res.redirect('/login');
        }

        const respuesta = await fetch("http://localhost:4001/user/deleteFavorito", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_peliculas })
        });

        if (!respuesta.ok) {
            return res.redirect('/user/dashboard');
        }
        
        return res.redirect('/user/favoritos');

    } catch (error) {
        console.error('Error en eliminarFavorito:', error);
        return res.status(500).json({ ok: false, msg: "Error interno del servidor" });
    }
};


/**
 * Muestra los detalles de una película favorita específica.
 * @memberof module:controllers/user.controller
 * @function detalleFavorito
 * @param {object} req 
 * @param {object} res  
 * @param {string} req.params.id - ID de la película favorita.
 * @param {string} req.cookies.token - Token de autenticación del usuario.
 * @param {object} respuesta - Respuesta de la API con los detalles de la película.
 * @param {object} data - Datos JSON obtenidos de la respuesta de la API.
 * @param {string} res.render - Renderiza la vista con los detalles de la película o un mensaje de error.
 * @param {string} token - Token de autenticación del usuario.
 * @throws {Error} Lanza un error si ocurre un problema durante el proceso.
 * @returns {void}
 */
const detalleFavorito = async (req, res) => {
    const id = req.params.id;
            console.log(id)
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/login');
    }
    try {
        const respuesta = await fetch(`http://localhost:4001/user/dashboard/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        console.log(respuesta)
        if (!respuesta.ok) {
            return res.redirect('/user/dashboard');
        }
        const data = await respuesta.json();
        res.render("user/userDetalleFavoritos", {
            pelicula: data.data,
            msg: null
        });
    } catch (error) {
        console.log(error);
        res.render("user/userDetalleFavoritos", {
            pelicula: null,
            msg: "Error en el servidor"
        });
    }
};

const recoverPassword = async (req, res) => {

}

const restorePassword = async (req, res) => {

}

/**
 * Muestra el dashboard del usuario.
 * @memberof module:controllers/user.controller
 * @function userDashboard
 * @param {object} req 
 * @param {object} res 
 * @param {string} res.render - Renderiza la vista del dashboard del usuario.
 * @returns {void}
 */
const userDashboard = async (req, res) => {
    res.render('user/userDashboard')
}

/**
 * Cierra la sesión del usuario.
 * @memberof module:controllers/user.controller
 * @function logout
 * @param {object} req
 * @param {object} res 
 * @param {string} res.clearCookie - Elimina la cookie de token de autenticación.
 * @param {string} res.redirect - Redirige a la vista de login tras cerrar sesión.
 * @returns {void}
 */
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
    });
    return res.redirect('/login');
};


module.exports = {
    vistaSearch,
    search,
    accederFavoritos,
    detalleFavorito,
    addFavoritos,
    deleteFavorito,
    recoverPassword,
    restorePassword,
    userDashboard,
    logout
}