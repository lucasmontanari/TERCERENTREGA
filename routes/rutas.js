import { Router } from 'express'
import passport from 'passport';
import logger from '../logger/logger.js';
import { getProductos, postProductos, editProductos, deleteProductos } from '../controllers/productoController.js'
import { getCarrito, postCarrito, deleteCarrito, getCarritoProductos, postProductoInCarrito, deleteProductoInCarrito, initPedido } from '../controllers/carritoController.js'
import { getRoot, getLogin, postLogin, getFaillogin, getLogout, failRoute, getSignup, postSignup, getFailregister, home } from '../controllers/usuariosController.js'
import { uploadFile } from '../middleware/uploadFiles.js'
const router = Router()

router.get('/', (req, res) => {
    res.redirect("/api/home")
})

//PRODUCTOS
router.get('/productos/:id?', checkAuth, getProductos)
router.post('/productos', checkAuth, postProductos)
router.put('/productos/:id', checkAuth, editProductos)
router.delete('/productos/:id', checkAuth, deleteProductos)


//CARRITO
router.get('/carrito/:id?', checkAuth, getCarrito)
router.post('/carrito', checkAuth, postCarrito)
router.delete('/carrito/:id', checkAuth, deleteCarrito)
router.get('/carrito/:id/productos', checkAuth, getCarritoProductos)
router.post('/carrito/:id/productos', checkAuth, postProductoInCarrito)
router.delete('/carrito/:id/productos/:id_prod', checkAuth, deleteProductoInCarrito)
router.post('/iniciarPedido', checkAuth, initPedido)


//USUARIOS
function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/api/login");
    }
}
router.get("/register", getSignup);
router.post(
    "/register", uploadFile.single('avatar'),
    passport.authenticate("register", { failureRedirect: "/failregister" }),
    postSignup
);
router.get("/failregister", getFailregister);
router.get("/login", getLogin);
router.post(
    "/login",
    passport.authenticate("login", { failureRedirect: "/faillogin" }),
    postLogin
);
router.get("/faillogin", getFaillogin);
router.get("/logout", checkAuth, getLogout);
router.get("/home", checkAuth, home)


//FAIL ROUTE

router.get("*", function (req, res) {
    res.status(404).render("routing-error", { error: -2, descripcion: `ruta '${req.path}' metodo '${req.method}' no implementada` })
    logger.warn("Acceso a Ruta no Definida")
});

export default router