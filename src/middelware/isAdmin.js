/**
 * Middleware para verificar si el usuario tiene el rol de administrador.
 * Si el rol no es de administrador, redirige al dashboard de usuario.
 * @module middelware/isAdmin
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */
const isAdmin = (req, res, next) => {
    if (req.usuario.id_rol !== 2) {
        return res.redirect("/user/dashboard");
    }
    next();
};

module.exports = { isAdmin };








