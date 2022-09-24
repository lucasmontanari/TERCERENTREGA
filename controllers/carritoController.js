import { ProductosDao, CarritoDao } from "../daos/selectorDeDaos.js"
const carrito = CarritoDao
import { getProductos, postProductos, editProductos, deleteProductos, productos } from '../controllers/productoController.js'
import { sendMail, sendSMS, sendWPP } from "../middleware/sendMessage.js"
import Usuario from "../middleware/models.js"
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SESSION_SECRET, MODO, MAIL, PASSW, TWILIOSID, TWILIOTOKEN, TWILIOPHONE, TWILIOWPP, MYPHONE } = process.env;
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

const getCarrito = async(req, resp) => {
    const id = req.params.id
    if (id) {
        const getCarrito = async () => {
            try {
                const carritoEnviar = await carrito.getById(id)
                carritoEnviar[0].usuario = req.user.nombre
                carritoEnviar[0].usuarioEmail = req.user.email
                resp.status(201).render("carrito.ejs", {carritoEnviar})
            } catch (err) {
                resp.status(500).json(`Error de servidor ${err}`)
            }
        }
        getCarrito();
    } else {
        let userEmail = req.user.email
        const existingUser = await Usuario.findOne({ userEmail });
        if (existingUser.carrito == "nulo") {
            resp.sendFile(path.join(__dirname, '..', 'public', 'crearCarrito.html'));
        } else {
            resp.redirect(`/api/carrito/${req.user.carrito}`)
        }
    }
}

const postCarrito = async (req, resp) => {
    let userEmail = req.user.email
    const existingUser = await Usuario.findOne({ userEmail });
    const crearCarrito = async () => {
        try {
            await carrito.save({ productos: [], timestamp: Date.now() })
            let allCarritos = await carrito.getAll()
            let carritoActual = allCarritos[allCarritos.length - 1]
            let usuarioUpdate = await Usuario.updateOne({ email: userEmail }, { carrito: carritoActual._id })
            resp.status(201).json(carritoActual)
        } catch (err) {
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    crearCarrito();
}

const deleteCarrito = (req, resp) => {
    const id = String(req.params.id)
    const borrarID = async () => { //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
        try {
            resp.status(201).json(await carrito.deleteById(id))
        } catch (err) {
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    borrarID();
}

const getCarritoProductos = (req, resp) => {
    const id = String(req.params.id)

    const getProductosById = async () => { //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
        try {
            resp.status(200).json(await carrito.getProductosById(id))
        } catch (err) {
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    getProductosById();
}

const postProductoInCarrito = (req, resp) => {
    const id = String(req.params.id)
    const agregarProducto = async () => {
        try {
            resp.status(201).json(await carrito.saveProductoInCarrito(id, productos))
        } catch (err) {
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    agregarProducto();
}

const deleteProductoInCarrito = (req, resp) => {
    const idCarrito = String(req.params.id)
    const idProducto = String(req.params.id_prod)
    const borrarID = async () => { //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
        try {
            resp.status(201).json(await carrito.deleteProductoInCarrito(idCarrito, idProducto))
        } catch (err) {
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    borrarID();
}

const initPedido = async (req, res) => {
    const userEmail = req.user.email
    const existingUser = await Usuario.findOne({ userEmail });
    const productos = await carrito.getById(existingUser.carrito)
    try {
        const asunto = `Nuevo pedido de ${req.user.nombre}, ${userEmail}`
        sendMail(asunto, productos)
        sendWPP(`Nuevo pedido de ${req.user.nombre}, ${userEmail}`, MYPHONE)
        sendSMS("Pedido Relizado Correctamente", existingUser.telefono)
        res.status(201).json('Pedido realizado')
    } catch (err) {
        res.status(500).json(`Error de servidor ${err}`)
    }

}

export {
    getCarrito,
    postCarrito,
    deleteCarrito,
    getCarritoProductos,
    postProductoInCarrito,
    deleteProductoInCarrito,
    initPedido
}