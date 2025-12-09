
const isAdmin = (req, res, next) => {
    if (req.usuario.id_rol !== 2) {
        return res.redirect("/user/dashboard");
    }
    next();
};

module.exports = { isAdmin };








