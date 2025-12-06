
const vistaSearch = async (req, res) => {
    res.render('user/userBuscador')
}



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

const userDashboard = async (req, res) => {
    res.render('user/userDashboard')
}

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


