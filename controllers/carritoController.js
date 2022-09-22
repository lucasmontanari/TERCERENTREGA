import { ProductosDao, CarritoDao } from "../daos/selectorDeDaos.js"
//import ContenedorCarrito from '../contenedores/claseCarrito.js'
const carrito = CarritoDao
import { getProductos, postProductos, editProductos, deleteProductos, productos } from '../controllers/productoController.js'

const getCarrito = (req, resp) =>{
    const id = String(req.params.id)
    const getCarrito = async () =>{
        try{
            resp.status(201).json(await carrito.getById(id))
        }catch(err){
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    getCarrito();
}

const postCarrito = (req, resp) =>{
    const crearCarrito = async () =>{
        try{
            resp.status(201).json(await carrito.save({productos: [], timestamp: Date.now()}))
        }catch(err){
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    crearCarrito();
}

const deleteCarrito = (req, resp) =>{
    const id = String(req.params.id)
    const borrarID = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
        try{
            resp.status(201).json(await carrito.deleteById(id))
        }catch(err){
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    borrarID();
}

const getCarritoProductos = (req, resp) =>{
    const id = String(req.params.id)

    const getProductosById = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
        try{
            resp.status(200).json(await carrito.getProductosById(id))
        }catch(err){
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    getProductosById();
}

const postProductoInCarrito = (req, resp) =>{
    const id = String(req.params.id)
    const agregarProducto = async () =>{
        try{
            resp.status(201).json(await carrito.saveProductoInCarrito(id,productos))
        }catch(err){
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    agregarProducto();
}

const deleteProductoInCarrito = (req, resp) =>{
    const idCarrito = String(req.params.id)
    const idProducto = String(req.params.id_prod)
    const borrarID = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
        try{
            resp.status(201).json(await carrito.deleteProductoInCarrito(idCarrito, idProducto))
        }catch(err){
            resp.status(500).json(`Error de servidor ${err}`)
        }
    }
    borrarID();
}

export {
    getCarrito,
    postCarrito,
    deleteCarrito,
    getCarritoProductos,
    postProductoInCarrito,
    deleteProductoInCarrito
}