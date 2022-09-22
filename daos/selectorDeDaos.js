import ContenedorCarritoMongoDb from "./carritos/CarritoDaoMongoDb.js"
import ContenedorProductoMongoDb from "./productos/ProductosDaoMongoDb.js"

let ProductosDao = new ContenedorProductoMongoDb()
let CarritoDao = new ContenedorCarritoMongoDb()

export {
    ProductosDao,
    CarritoDao
}