
const vistaCrearPeli = async (req, res) => {
    res.render('/admin/adminCrear.ejs')

}


const anadirPelicula = async (req, res) => {

    try {
        
    } catch (error) {
        
    }
}


const vistaEditarPeli = async (req, res) => {
    res.render('/admin/adminEditar.ejs')
}


const editarPelicula = async (req, res) => {
    
    try {
        
    } catch (error) {
        
    }
}

const borrarPelicula = async (req, res) => {
    
    try {
        
    } catch (error) {
        
    }
}
const adminDashboard = (req, res) => {
    const token = req.cookies.token;
    console.log(token)
    res.render("admin/adminDashboard", { user: req.user });
};



module.exports = {
    vistaCrearPeli,
    anadirPelicula,
    vistaEditarPeli,
    editarPelicula,
    borrarPelicula,
    adminDashboard
}