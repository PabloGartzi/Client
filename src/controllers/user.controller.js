
/*const vistaSearch = async (req, res) => {
    res.render('/user/userBuscador.ejs')
}
*/

const search = async (req, res) => {


   // res.render('/user/userResultadoBuscador.ejs')
}

const addFavoritos = async (req, res) => {
    

}

const accederFavoritos = async (req, res) => {
                           
    try{
        // const res = await fetch('http://localhost:4001/api-docs/favoritos')
        const res = await fetch('http://localhost:4001/api-docs/user/favoritos')
          
        const favoritos = res.json()
        return res.status(200).json({
            ok:true,
            msg: 'obteniendo favoritos',
            data: favoritos
        })                    
    }
    catch (error){
        console.log(error)
        return res.status(404).json({
            ok: false, 
            msg: 'Error al obtener favoritos'
        })
    }

    res.render('/user/userPelisFavoritas.ejs', data)
} 


const deleteFavorito = async (req, res) => {

}

const detalleFavorito = async (req, res) => {
res.render('/user/userDetalleFavoritos.ejs')
}

const recoverPassword = async (req, res) => {

}

const restorePassword = async (req, res) => {

}

const userDashboard = async (req, res) => {
   
    res.render('user/userDashboard')
}


module.exports = {
    //vistaSearch,
    search,
    accederFavoritos,
    detalleFavorito,
    addFavoritos,
    deleteFavorito,
    recoverPassword,
    restorePassword,
    userDashboard,
}


