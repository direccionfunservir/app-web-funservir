require('dotenv').config()
const express = require("express")
const cors = require("cors")
const db = require("./database/db")
const cookieParser = require("cookie-parser");
// const cookie = require("cookie");
const mongoose = require('mongoose');
const helmet = require('helmet');

const controllers = require("./controllers/controllersMainPage") // No es necesario poner index.js, por defecto lo toma
const controllersAdmin = require("./controllers/controllersAdmin")
const verifyToken = require("./middlewares/verifyToken");
const verifyTokenAdmin = require("./middlewares/verifyTokenAdmin"); // Para el admin. Comprobamos que el token tenga tipo de usuario administrador

const app = express();

app.use(
    helmet({
        strictTransportSecurity: process.env.BACKEND_NODE_ENV !== "development",
        xFrameOptions: { action: "deny" },
        contentSecurityPolicy: false,
        crossOriginOpenerPolicy: false,
        crossOriginResourcePolicy: false,
        xPermittedCrossDomainPolicies: false,
        originAgentCluster: false,
    })
); // Importa encabezados de seguridad automáticamente: 

app.disable('x-powered-by'); // Para que no muestre en el encabezado que la APP está desarrollada con Express JS

app.use(cookieParser()); // Para ajustar la cookie de sesión

/* Los cors permiten configurar políticas de seguridad sobre que peticiones responder
en este caso responde las peticiones desde cualquier origen (inseguro) */
const corsOrigins = process.env.BACKEND_ALLOWED_ORIGINS.split(',');

app.use(cors({
    // origin: req.method !== 'OPTIONS' && req.header('origin') && corsOrigins.includes(req.header('origin').toLowerCase()) ? req.header('origin') : corsOrigins[0],
    origin: corsOrigins,
    credentials: true, // Para permitir el envÃ­o de cookies
}))

/* Agregar encabezados de seguridad en la aplicación */
// app.use((req, res, next) => {
//     res.append('Access-Control-Allow-Origin', ['*']);
//     res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.append('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

// app.use(express.json()) // Nos permitirá ver el body que contiene las peticiones POST y PUT

// Para permitir el envió de archivos grandes en el JSON (necesario para las imágenes)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb' }));

/* Para mostrar un mensaje de error personalizado al usuario cuando envía un JSON malformado, en vez del mensaje de error real (puede generar fuga de información), en caso que suceda un error en el backend */
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError) {
        res.status(422).json({ message: 'El JSON enviado no es válido' });
    } else {
        next();
    }
});

// Para comprobar que el backend tiene conexión con la BD antes de seguir
app.use((req, res, next) => {
    if (mongoose.connection.readyState === 1) next();
    else return res.status(503).json({ message: 'Error en el servidor. Inténtalo más tarde' });
});


// Middleware para ajustar CORS
// app.all('*', function (req, res, next) {
//     try {
//         res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
//         res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//         console.log("req.method: ", req.method)
//         console.log(corsOrigins)
//         console.log(req.method)
//         if (req.method === 'OPTIONS') {
//             // Nada aquí
//         } else { // Para métodos POST Y GET
//             const origin = corsOrigins.includes(req.header('origin').toLowerCase()) ? req.headers.origin : corsOrigins[0];
//             res.header("Access-Control-Allow-Origin", origin);
//             console.log("entra")
//         }
//         next();
//     } catch (error) {
//         console.error('Error setting CORS headers:', error);
//         res.status(500).json({ message: "Hubo un problema al procesar CORS" });
//     }
// });

/* Rutas de nuestra APP */
app.get('/', (req, res) => { res.json({ message: "¡Backend Funcionando!" }); });
app.post("/registerUser", controllers.registerUser)
app.post("/registerOwner", controllers.registerOwner)
app.post("/loginUser", controllers.login)
app.post("/uniqueEmailValidator", controllers.uniqueEmailValidator)
app.post("/uniqueSiteNameValidator", controllers.uniqueSitenameValidator)
app.get("/logout", controllers.logout)

// Usuario logueado
app.get("/status", verifyToken, controllers.tokenStatus)
app.get("/user", verifyToken, controllers.getUserById) // Sintaxis -> app.get( path, callback )
app.post("/addSite", verifyToken, controllers.addSite)
app.post("/updateUserInfo", verifyToken, controllers.updateUserInfo)
app.post("/changePictures", verifyToken, controllers.changePictures)
app.post("/changePassword", verifyToken, controllers.changePassword)

// Busqueda de sitios
app.get("/sites", controllers.getAllSites)
app.get("/sites/search=:patternToSearch", controllers.searchSites)

// Rutas del portal administrador a partir de este punto:

app.post("/adminLogin", controllersAdmin.adminLogin)
// Autenticación con Google
app.post("/adminLoginWithGoogle", controllersAdmin.adminLoginWithGoogle)

// Parametría elementos inclusivos:
app.get("/elements", controllersAdmin.getInclusiveElements) // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addElement", verifyTokenAdmin, controllersAdmin.addInclusiveElement)
app.post("/deleteElement", verifyTokenAdmin, controllersAdmin.deleteElement)
app.post("/editElement", verifyTokenAdmin, controllersAdmin.editElement)

// Parametría usuarios:
app.get("/all_users", verifyTokenAdmin, controllersAdmin.allUsers)
app.post("/addUser", verifyTokenAdmin, controllersAdmin.addUsers)
app.post("/editUser", verifyTokenAdmin, controllersAdmin.editUser)
app.post("/deleteUser", verifyTokenAdmin, controllersAdmin.deleteUser)

// Parametría categorías:
app.get("/getCategories", controllersAdmin.getCategories) // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addCategory", verifyTokenAdmin, controllersAdmin.addCategory)
app.post("/editCategory", verifyTokenAdmin, controllersAdmin.editCategory)
app.post("/deleteCategory", verifyTokenAdmin, controllersAdmin.deleteCategory)

// Parametría sitios inclusivos
app.get("/getInclusiveSites", verifyTokenAdmin, controllersAdmin.getInclusiveSites)
app.post("/addInclusiveSites", verifyTokenAdmin, controllersAdmin.addInclusiveSites)
app.post("/editInclusiveSites", verifyTokenAdmin, controllersAdmin.editInclusiveSites)
app.post("/deleteInclusiveSites", verifyTokenAdmin, controllersAdmin.deleteInclusiveSites)

// Parametría Localidades:
app.get("/getLocations", controllersAdmin.getLocations)  // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addLocations", verifyTokenAdmin, controllersAdmin.addLocations)
app.post("/editLocations", verifyTokenAdmin, controllersAdmin.editLocations)
app.post("/deleteLocations", verifyTokenAdmin, controllersAdmin.deleteLocations)

// Parametría barrios:
app.get("/getNeighborhoods", controllersAdmin.getNeighborhoods)  // No necesita token porque lo necesitamos para el registro de dueño de sitio
app.post("/addNeighborhoods", verifyTokenAdmin, controllersAdmin.addNeighborhoods)
app.post("/editNeighborhoods", verifyTokenAdmin, controllersAdmin.editNeighborhoods)
app.post("/deleteNeighborhoods", verifyTokenAdmin, controllersAdmin.deleteNeighborhoods)

//Notificaciones
app.get("/notification", verifyTokenAdmin, controllersAdmin.siteNotification)

// custom 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Upss, ruta no encontrada' });
})

/* Fin rutas de nuestra APP */

// Leer puerto por donde funcionará nuestro servidor
const host = process.env.BACKEND_HOST;
const port = process.env.BACKEND_PORT

// Para manejo de errores cuando no es posible conectarse con mongodb
db().then(() => {
    console.log("Ajustando conexión con el servidor...")
    app.listen(port, host, () => {
        console.log(`Servidor funcionando en http://${host}:${port}`);
    });
})
    .catch((error) => {
        console.error('Error al iniciar el servidor');
    });

module.exports = app