

const vistaSearch=async (req,res) => {
    
}
const search = async(req, res)=>{

}
const vistaFavoritos= async (req,res) => {
    
}

const addFavoritos=async (req,res) => {
    
}

const deleteFavorito=async (req, res) => {
    
}
const detalleFavorito = async (req, res) => {
    
}
const recoverPassword=async (req, res) => {
    
}

const restorePassword = async (req,res ) => {
    
}
 const dashboard =async (req,res) => {
    res.render('/user/dashboard.user.ejs')
}


module.exports={
    vistaSearch,
    search,
    vistaFavoritos,
    addFavoritos,
    deleteFavorito,
    recoverPassword,
    restorePassword,
    dashboard,
    detalleFavorito
    
}


