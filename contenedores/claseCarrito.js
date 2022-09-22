import fs from 'fs'

export default class ContenedorCarrito{ //module.exports permite importar la clase en otro archivo usando require
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
        fs.promises.appendFile(`./${nombreArchivo}`, '')
    }

    async save(){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        let objeto = {}
        if(!data){
            objeto.id=1
            objeto.timestamp= Date.now()
            objeto.productos=[]
            data = [objeto]
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data))
            return `El ID del Carrito creado es ${objeto.id}`
        }else{
            data=JSON.parse(data);
            let ultimoItem=data[data.length-1] //Se hace de esta forma para siempre encontrar el Id del ultimo elemento del array
            objeto.id=ultimoItem.id+1
            objeto.timestamp= Date.now()
            objeto.productos=[]
            data.push(objeto)
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data))
            return `El ID del Carrito creado es ${objeto.id}`
        }
    }
    
    async getCarritoById(numeroID){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        function findID(objeto) { //Funcion para encontrar el objeto con el Id buscado
            return objeto.id === numeroID;
        }
        if(!data.find(findID)){ //Se usa find para encontrar el objeto buscado
            return `No existe el carrito con ID:${numeroID}`
        }else{
            return data.find(findID);
        }
    }

    async getProductosById(numeroID){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        function findID(objeto) { //Funcion para encontrar el objeto con el Id buscado
            return objeto.id === numeroID;
        }
        if(!data.find(findID)){
            return `El carrito ID:${numeroID} no existe`
        }else if(JSON.stringify(data.find(findID).productos) === "[]"){ //Se usa find para encontrar el objeto buscado
            return 'El carrito esta vacio'
        }else{
            return data.find(findID).productos;
        }
    }

    async saveProductoInCarrito(idProducto){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        let productos = await fs.promises.readFile(`./productos.txt`, 'utf-8')
        function findID(objeto) { //Funcion para encontrar el objeto con el Id buscado
            return objeto.id === idProducto;
        }
        let objeto = {}
        if(!data){
            objeto.id=1
            objeto.timestamp= Date.now()
            let productoAgregado=productos.find(findID)
            ultimoItem.productos=[productoAgregado]
            objeto.productos=[]
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arr))
            return objeto
        }else{
            data=JSON.parse(data);
            productos=JSON.parse(productos)
            let ultimoItem=data[data.length-1] //Se hace de esta forma para siempre encontrar el Id del ultimo elemento del array
            let productoAgregado=productos.find(findID)
            if(productoAgregado){
                ultimoItem.productos.push(productoAgregado)
                data[data.length-1]=ultimoItem
                await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data))
                return ultimoItem
            }else{
                return `El producto con ID:${idProducto} no existe`
            }
        }
    }

    async deleteProductoInCarrito(idCarrito,idProducto){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        function findID(objeto) { //Funcion para encontrar el objeto con el Id buscado
            return objeto.id === idCarrito;
        }
        if(data.find(findID)){
            let productos = data.find(findID).productos;
            let arregloFiltrado = productos.filter((objeto) => objeto.id !== idProducto); //Filta el array de objetos excluyendo el objeto que tenga el Id a Borrar
            if(JSON.stringify(productos)==JSON.stringify(arregloFiltrado)){
                return `Producto ID:${idProducto} No Encontrado en Carrito`
            }else{
                data.find(findID).productos=arregloFiltrado
                await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data)) //Reescribo el archivo con el array filtrado
                return data.find(findID)
            }
        }else{
            return `Carrito ID:${idCarrito} No Existe`
        }
    }

    async deleteCarrito(idABorrar){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        let arregloFiltrado = data.filter((objeto) => objeto.id !== idABorrar); //Filtra el array de objetos excluyendo el objeto que tenga el Id a Borrar
        if(JSON.stringify(arregloFiltrado) === "[]"){
            await fs.promises.writeFile(`./${this.nombreArchivo}`, '')
        }else if(JSON.stringify(arregloFiltrado)==JSON.stringify(data)){
            return `No existe el Carrito ID:${idABorrar}`
        }else{
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arregloFiltrado))//Reescribo el archivo con el array filtrado
        } 
        return `Carrito ID:${idABorrar} Eliminado Correctamente`
    }
}
