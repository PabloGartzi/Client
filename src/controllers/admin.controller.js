// src/controllers/admin.controller.js

const fetch = require('node-fetch'); 
const FormData = require('form-data');
const fs = require('fs');

const API_BASE_URL = "http://localhost:4001/admin"; 


const getTokenFromCookies = (req) => req.cookies?.token;


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


const vistaCrearPeli = (req, res) => {
    const error = req.session.error;
    delete req.session.error;
    res.render('admin/adminCrear.ejs', { error }); 
}


const vistaEditarPeli = async (req, res) => {
    const id = req.params.id;
    const token = getTokenFromCookies(req);

    if (!token) return res.redirect('/login');

    try {
        const respuesta = await fetch(`${API_BASE_URL}/dashboard/${id}`, { 
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });
        console.log ('hemos traido la info del server')
        const data = await respuesta.json();

        if (!respuesta.ok) {
            req.session.error = data.msg || "Película no encontrada o error de permisos.";
            return res.redirect('/admin/dashboard');
        }

        const error = req.session.error;
        delete req.session.error;
        console.log('estamos por hacer el render')
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


const editarPelicula = async (req, res) => {
    const token = getTokenFromCookies(req);
    const id = req.params.id;
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
        
        const respuesta = await fetch(`${API_BASE_URL}/editMovie/${id}`, {
            method: 'POST', 
            body: formData, 
            headers: {
                "Authorization": `Bearer ${token}`,
                ...formData.getHeaders()
            }
        });

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