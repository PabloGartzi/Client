
const vistaLogin = async (req, res) => {

    res.render('auth/vistaLogin.ejs')
}

const login = async (req, res) => {
    try {
        const { email, contrasenia } = req.body;
        const respuesta = await fetch('http://localhost:4100/login', {
            method: 'POST',
            body: JSON.stringify({ email: email, contrasenia: contrasenia }),
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer token' 
            }
        });
        const data = await respuesta.json()
        if (!respuesta.ok){
            return res.send("Los datos son incorrectos")
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

const signup = async (req, res) => {

    try {
        console.log('estamos dentro del registro')
        const { nombre, email, contrasenia, confirmar } = req.body;
        if (contrasenia !== confirmar) {

             res.redirect('/signup').json({
                msg:"error con las constraseñas"
            })

        }
        const respuesta = await fetch('http://localhost:4100/signup', {
            method: 'POST',
            body: JSON.stringify({ nombre: nombre, email: email, contrasenia: contrasenia }),
            headers: { 'Content-Type': 'application/json' }
        })

        const data = await respuesta.json()
        console.log(data)

        
    } catch (error) {
        console.log(error, 'error en registro de usuario')

    }
    res.redirect('/login')

}

const vistaSignup = async (req, res) => {

    res.render('auth/vistaLogin.ejs')
}




module.exports = {
    vistaLogin,
    login,
    logout,
    vistaSignup,
    signup
}