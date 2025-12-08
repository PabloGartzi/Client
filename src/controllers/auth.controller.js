/**
 * Controladores de autenticación para login, logout y registro de usuarios en el frontend.
 * Manejan la lógica de las rutas definidas en auth.route.js.
 * @module controllers/auth.controller.js  
 */


/**
 * Muestra la vista del formulario de login.
 * @function vistaLogin
 * @memberof module:controllers/auth.controller
 * @param {object} req 
 * @param {object} res
 */
const vistaLogin = async (req, res) => {

    res.render('auth/vistaLogin.ejs')
}

/**
 * Recoge los datos del formulario de login y los envía a la API para autenticación.
 * Si la autenticación es exitosa, guarda el token en una cookie y redirige al dashboard correspondiente según el rol del usuario.
 * @memberof module:controllers/auth.controller
 * @function login
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {string} req.body.email - Email del usuario.
 * @param {string} req.body.contrasenia - Contraseña del usuario. 
 * @param {string} res.cookie.token - Token JWT almacenado en una cookie HTTP-only.
 * @param {string} res.redirect - Redirige al dashboard de admin o usuario según el rol.
 * @param {number} rol - Rol del usuario (2 para admin, otro para user).
 * @param {string} token - Token JWT recibido de la API tras autenticación exitosa.
 * @param {object} data - Datos de respuesta de la API tras el login.
 * @returns {void}
 * @throws {Error} Lanza un error si ocurre un problema durante el proceso de login.
 */
const login = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const respuesta = await fetch('http://localhost:4001/login', {
            method: 'POST',
            body: JSON.stringify({ email: email, contrasenia:contrasenia}),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer token' 
            }
        });
        console.log
        const data = await respuesta.json()
        if (!respuesta.ok){
            return res.redirect('/login')
        }
        const token = data.token
        console.log(token,'<=======================>',data)
        const rol= data.usuario.id_rol
    
        res.cookie('token', token, {
            httpOnly: true, maxAge: 24 * 60 * 60 * 1000
        });
        console.log(data)
        if (rol==2){
            return res.redirect('/admin/dashboard')
        }
            return res.redirect('/user/dashboard');

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            error: 'Error interno del servidor',
            mensaje: error.message
        });
    }
}





const logout = async (req, res) => {

}

/**
 * Recoge los datos del formulario de registro y los envía a la API para crear un nuevo usuario.
 * Por defecto, los usuarios registrados tienen el rol 'user'.
 * @memberof module:controllers/auth.controller 
 * @function signup
 * @param {object} req - Objeto de solicitud HTTP.
 * @param {object} res - Objeto de respuesta HTTP.
 * @param {string} req.body.nombre - Nombre del usuario.
 * @param {string} req.body.email - Email del usuario.
 * @param {string} req.body.contrasenia - Contraseña del usuario.
 * @param {string} req.body.confirmar - Confirmación de la contraseña del usuario.
 * @returns {void}
 * @throws {Error} Lanza un error si ocurre un problema durante el proceso de registro. 
 */
const signup = async (req, res) => {

    try {
        console.log('estamos dentro del registro')
        const { nombre, email, contrasenia, confirmar } = req.body;
        if (contrasenia !== confirmar) {
            return res.status(400).json({
                msg: "error con las contraseñas"
            });
        }
        const respuesta = await fetch('http://localhost:4001/signup', {
            method: 'POST',
            body: JSON.stringify({ nombre: nombre, email: email, contrasenia: contrasenia }),
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await respuesta.json()
        console.log(data)

        
    } catch (error) {
        console.log(error, 'error en registro de usuario')
        res.redirect('/signup')

    }
        res.redirect('/user/dashboard')


}

/**
 * Muestra la vista del formulario de registro de usuario.
 * @function vistaSignup
 * @memberof module:controllers/auth.controller
 * @param {object} req   
 * @param {object} res
 */
const vistaSignup = async (req, res) => {

    res.render('auth/vistaRegistro.ejs')
}




module.exports = {
    vistaLogin,
    login,
    logout,
    vistaSignup,
    signup
}