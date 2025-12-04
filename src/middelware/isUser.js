const isUser = (req, res, next) => {

    console.log(req.usuario.id_rol,'<==========en isuser>')
    if (req.usuario.id_rol !== 1) {
        return res.redirect("/admin/dashboard");
    }
    next();
};

module.exports = { isUser };
