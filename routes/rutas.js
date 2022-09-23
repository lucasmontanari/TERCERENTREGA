import { Router } from 'express'
import passport from 'passport';
import { getProductos, postProductos, editProductos, deleteProductos } from '../controllers/productoController.js'
import { getCarrito, postCarrito, deleteCarrito, getCarritoProductos, postProductoInCarrito, deleteProductoInCarrito, initCarrito } from '../controllers/carritoController.js'
import { getRoot, getLogin, postLogin, getFaillogin, getLogout, failRoute, getSignup, postSignup, getFailregister, home } from '../controllers/usuariosController.js'
import { uploadFile } from '../middleware/uploadFiles.js'
const router = Router()


//PRODUCTOS
router.get('/productos/:id?', getProductos)
router.post('/productos', postProductos)
router.put('/productos/:id', editProductos)
router.delete('/productos/:id', deleteProductos)


//CARRITO
router.get('/carrito/', checkAuth, initCarrito)
router.get('/carrito/:id', getCarrito)
router.post('/carrito', postCarrito)
router.delete('/carrito/:id', deleteCarrito)
router.get('/carrito/:id/productos', getCarritoProductos)
router.post('/carrito/:id/productos', postProductoInCarrito)
router.delete('/carrito/:id/productos/:id_prod', deleteProductoInCarrito)


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

export default router