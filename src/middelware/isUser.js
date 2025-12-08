/**
 * Middleware para verificar si el usuario tiene el rol de usuario estándar.
 * Si el rol no es de usuario estándar, redirige al dashboard de administrador.
 * @module middelware/isUser
 * @param {object} req 
 * @param {object} res 
 * @param {function} next 
 * @returns 
 */
const isUser = (req, res, next) => {

    console.log(req.usuario.id_rol,'<==========en isuser>')
    if (req.usuario.id_rol !== 1) {
        return res.redirect("/admin/dashboard");
    }
    next();
};

module.exports = { isUser };
