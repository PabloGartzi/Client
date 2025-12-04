const jwt = require("jsonwebtoken");
const SECRET = "mia_clave_secreta";

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
  