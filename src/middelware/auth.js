const jwt = require("jsonwebtoken");
const SECRET = "Palabra-secreta";

/**
 * Middleware para autenticar usuarios mediante JWT.
 * Verifica el token en las cookies y redirige a la página de login si no es válido.
 * Si el token es válido, añade la información del usuario decodificada al objeto req.user.
 * @function auth
 * @param {Object} req - Objeto de solicitud de Express. Debe contener las cookies.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware.
 * @param {string} req.cookies.token - Token JWT almacenado en las cookies.
 * @param {Object} decoded - Información del usuario decodificada del token JWT.
 */
const auth = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        console.log(decoded) 
        next();
    } catch (err) {
        console.log('algo salio mal con el token')
        return res.redirect("/login");
    }
};

module.exports = {auth}
  