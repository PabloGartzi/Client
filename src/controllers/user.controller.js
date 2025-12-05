
/*const vistaSearch = async (req, res) => {
    res.render('/user/userBuscador.ejs')
}
*/

const { send } = require("process");

const search = async (req, res) => {
    try {
        const { titulo } = req.query;
        const token = req.cookies?.token;

        if (!token) {
            return res.redirect('/login');
        }

        if (!titulo || titulo.trim() === '') {
            return res.send("Debes escribir un título para buscar.");
        }

        const respuesta = await fetch(`http://localhost:4100/user/search?titulo=${encodeURIComponent(titulo)}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await respuesta.json();
        console.log("RESULTADO BUSQUEDA:", data);

        return res.render("user/userResultadoBuscador.ejs", {
            peliculas: data.resultados 
        });

    } catch (error) {
        console.error('Error en searchFront:', error);
        return res.status(500).send("Error interno del servidor");
    }
};



const addFavoritos = async (req, res) => {
    try {
        const { id_peliculas } = req.body;
        const token = req.cookies?.token;
        
        if (!token) {
            return res.redirect('/login');//debemos mandarnos al dashboard, simplemente limpiar o que salga un msg
        }
        
        const respuesta = await fetch("http://localhost:4100/user/anadirFavoritos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`  
            },
            body: JSON.stringify({ id_peliculas })
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            
            req.session.mensaje = data.msg || "Error al agregar a favoritos";
            return res.redirect("/peliculas");
        }

    
        req.session.mensaje = "Película agregada a favoritos correctamente";
        return res.redirect("/user/favoritos"); 

    } catch (error) {
        console.error('Error en addFavoritos:', error);
        req.session.mensaje = "Error interno del cliente";
        return res.redirect("/peliculas");
    }
};



const accederFavoritos = async (req, res) => {
    try {
        const token = req.cookies?.token;
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const respuesta = await fetch("http://localhost:4100/user/favoritos", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            return res.render('user/favoritos');
        }

        return res.render('user/favoritos');

    } catch (error) {
        console.error('Error en obtenerFavoritos:', error);
        return res.render('user/favoritos');
    }
};

const deleteFavorito = async (req, res) => {
    try {
        const { id_peliculas } = req.body; // CORRECCIÓN: DELETE /deleteFavorito espera en body
        const token = req.cookies?.token;
        
        if (!token) {
            return res.redirect('/login');
        }
        
        const respuesta = await fetch("http://localhost:4100/user/deleteFavorito", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ id_peliculas })   
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            req.session.mensaje = data.msg || 'Error al eliminar de favoritos';
        } else {
            req.session.mensaje = 'Película eliminada de favoritos correctamente';
        }

        return res.redirect("/user/favoritos");

    } catch (error) {
        console.error('Error en eliminarFavorito:', error);
        req.session.mensaje = 'Error al eliminar de favoritos';
        return res.redirect("/user/favoritos");
    }
};



const detalleFavorito = async (req, res) => {
res.render('/user/userDetalleFavoritos.ejs')
}

const recoverPassword = async (req, res) => {

}

const restorePassword = async (req, res) => {

}

const userDashboard = async (req, res) => {
   
    res.render('user/userDashboard')
}


module.exports = {
    //vistaSearch,
    search,
    accederFavoritos,
    detalleFavorito,
    addFavoritos,
    deleteFavorito,
    recoverPassword,
    restorePassword,
    userDashboard,
}


