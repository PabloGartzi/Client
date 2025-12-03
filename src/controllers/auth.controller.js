

const vistaLogin = async(req,res)=>{

res.render('auth/vistaLogin.ejs')
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const body = { email, password };

        const respuesta = await fetch('http://localhost:4001/login', {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 
                'Content-Type': 'application/json',
                // Agrega headers adicionales si es necesario
                // 'Authorization': 'Bearer token' 
            }
        });

        console.log('Respuesta del servidor:', respuesta.status);

        return res.redirect('/user/dashboard');

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ 
            error: 'Error interno del servidor',
            mensaje: error.message 
        });
    }
}
;
/* const login = async(req,res)=>{
   

   const {email,password}=req.body
   const body={email,password}
   console.log(body)
   const respuesta = await fetch('http://localhost:3001/login',{
      method:'POST',
      body:JSON.stringify(body),
      headers:{'Content-Type':'application/json'}
   })
   console.log(res)
   console.log(respuesta,'<====================================================>')
   res.redirect('/user/dashboard')

} */


 const logout = async (req,res) => {

 }

 const signup = async (req, res) => {

   try {
      console.log('estamos dentro del registro')
   const{nombre, email, password }=req.body
    const body = {nombre, email, password}
    console.log(body)
    const respuesta = await fetch('http://localhost:4001/signup',{
      method:'POST',
      body:JSON.stringify(body),
      headers:{'Content-Type':'application/json'}
    })
    const data = await respuesta.json()
    console.log(data)

      
   } catch (error) {
      console.log(error,'error en registro de usuario')
      
   }
   res.redirect('/dashboard')
 }

 const vistaSignup =async (req, res) => {
   

    res.render('auth/vistaRegistro.ejs')
 }



 module.exports={
    vistaLogin,
    login,
    logout,
    vistaSignup,
    signup
 }