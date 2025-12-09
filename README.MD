# Movie App – Cliente (Front-End)

Aplicación web que permite a los usuarios iniciar sesión, buscar películas, añadir favoritas y ver detalles. Este repositorio contiene la parte cliente, construida con Express y EJS, conectada a un backend externo con autenticación JWT y roles.

---
##  Requisitos previos

- Node.js  
- Backend de Movie App corriendo en el puerto definido (`serverPort=4001`)  
- npm o yarn  

> **Nota:** Este frontend depende del backend. Para obtener datos y funcionalidades completas, asegúrate de clonar y ejecutar primero el backend:  
> [Repositorio Backend Movie App](https://github.com/PabloGartzi/Server)

---
##  Tecnologías usadas

### Núcleo
- Node.js  
- Express.js  
- EJS 
- JavaScript  


### Herramientas de desarrollo
- Git y GitHub  
- Nodemon  
- Postman para pruebas de endpoints  

##  Estructura del proyecto

src/  
├── app.js  
├── routes/  
├── controllers/  
├── middlewares/  
├── views/  
└── public/  

---

##  Funcionalidades del FRONT

- Login y validación mediante JWT  
- Buscador de películas  
- Gestión de favoritos (añadir y eliminar)  
- Vista de detalles de película  
- Renderizado dinámico con EJS  
- Control de acceso según rol (admin/user)  

---
## Consumo de endpoints del backend

El frontend utiliza la URL base definida en `.env` y consume los siguientes endpoints:

###  Autenticación
- `POST /auth/login`  
- `POST /auth/register`  
- `POST /auth/logout`  

###  Usuario
- `GET /user/search`  
- `POST /user/favoritos`  
- `PUT /user/anadirFavoritos`  
- `DELETE /user/deleteFavorito`  

###  Administrador
- `GET /admin/dashboard`  
- `POST /admin/createMovie`  
- `PUT /admin/editMovie/:id`  
- `DELETE /admin/removeMovie/:id`  

> **Importante:** El frontend depende de que el backend esté activo para que estas funcionalidades funcionen correctamente.

### Documentación con JsDocs

Abrir en docs/index.html

##  Instalación

1.  **Clonar el repositorio:**
    ```bash
    git clone <url-del-proyecto>
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Crear variables de entorno** (Crea un archivo `.env` en la raíz del proyecto):
    ```
    PORT=3100
    serverPort=4001
    NODE_ENV=production
    URL_BASE=http://localhost:4001
    ```

4.  **Iniciar servidor** (Modo desarrollo con Nodemon):
    ```bash
    npm run dev
    ```


##  Usuarios de prueba
| nombre | email           | contrasenia | id_rol |
|--------|-----------------|-------------|--------|
| user   | user@gmail.com  | 12345       | 1      |
| admin  | admin@gmail.com | 12345       | 2      |
