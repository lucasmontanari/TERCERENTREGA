import { ProductosDao, CarritoDao } from "../daos/selectorDeDaos.js"
import { Admin } from "../config.js"
const productos = ProductosDao

const getProductos = (req, resp) =>{
    const id = req.params.id 
    if(id){
        const getById = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
            try{
                resp.status(200).json(await productos.getById(id))
            }catch(err){
                resp.status(500).json(`Error de servidor ${err}`)
            }
        }
        getById();
    }else{
        const getAll = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
            try{
                resp.status(200).json(await productos.getAll())
            }catch(err){
                resp.status(500).json(`Error de servidor ${err}`)
            }
        }
        getAll();
    }
}

const postProductos = (req, resp) =>{
    const producto = req.body
    if(Admin){
        const subirProd = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
            try{
                resp.status(201).json(await productos.save(producto))
            }catch(err){
                resp.status(500).json(`Error de servidor ${err}`)
            }
        }
        subirProd();
    }else{
        resp.status(401).json({error: -1, descripcion: `ruta '${req.path}' metodo '${req.method}' no autorizada`})
    }
}

const editProductos = (req, resp) =>{
    const producto = req.body
    if(Admin){
        const id = String(req.params.id)
        const getAll = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
            try{
               resp.status(201).json(await productos.changeById(producto,id))
            }catch(err){
                resp.status(500).json(`Error de servidor ${err}`)
            }
        }
        getAll();
    }
    else{
        resp.status(401).json({error: -1, descripcion: `ruta '${req.path}' metodo '${req.method}' no autorizada`})
    }
}

const deleteProductos = (req, resp) =>{
    const id = String(req.params.id)
    if(Admin){
        const borrarID = async () =>{ //Se hace con funcion Async y Await porque de otra forma me tiraba un objeto vacio
            try{
               resp.status(201).json(await productos.deleteById(id))
            }catch(err){
                resp.status(500).json(`Error de servidor ${err}`)
            }
        }
        borrarID();
    }else{
        resp.status(401).json({error: -1, descripcion: `ruta '${req.path}' metodo '${req.method}' no autorizada`})
    }
}


export {
    getProductos,
    postProductos,
    editProductos,
    deleteProductos,
    productos
}