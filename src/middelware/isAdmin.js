


































/* COMENTO LA FUNCION DE SERGIO PORQUE DA ERROR
NO CONCUERDA CON LO QUE SE HA PUESTO EN LA FUNCION auth, archivo isUser
  --EN AMBOS DEBE PONER: req.user (no req.usuario)
  -- Hay que comprobar que req.user existe (si no existe = es undefined y da error al querer acceder a id_rol)

const isAdmin = (req, res, next) => {
    if (req.usuario.id_rol !== 2) {
        return res.redirect("/user/dashboard");
    }
    next();
};

FUNCION CORREGIDA SONIA:
*/

const isAdmin = (req, res, next) => {
    if (!req.user) return res.redirect('/login');

    if (req.user.id_rol !== 2) {
        return res.redirect('/dashboard'); // dashboard del usuario normal
    }

    next();
};

module.exports = { isAdmin };


