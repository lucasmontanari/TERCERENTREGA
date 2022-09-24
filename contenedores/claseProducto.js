import fs from 'fs'

export default class ContenedorProducto{ //module.exports permite importar la clase en otro archivo usando require
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
        fs.promises.appendFile(`./${nombreArchivo}`, '')
    }

    async save(objeto){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        if(!data){
            objeto.timestamp= Date.now()
            objeto.id=1
            const arr = [objeto]
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arr))
            return objeto
        }else{
            data=JSON.parse(data);
            let ultimoItem=data[data.length-1] //Se hace de esta forma para siempre encontrar el Id del ultimo elemento del array
            objeto.timestamp= Date.now()
            objeto.id=ultimoItem.id+1
            data.push(objeto)
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data))
            return objeto
        }
    }
    
    async getById(numeroID){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        function findID(objeto) { //Funcion para encontrar el objeto con el Id buscado
            return objeto.id == numeroID;
        }
        if(!data.find(findID)){ //Se usa find para encontrar el objeto buscado
            return `No se encontro el producto con ID:${numeroID}`
        }else{
            return data.find(findID);
        }
    }

    async getAll(){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        try{
            data=JSON.parse(data) //JSON.parse transforma el texto resivido en un array de objetos nuevamente
            if(data){return data} //Si no hay data no retorna nada y muestra el mensaje catcheado por que ocurre un error
        }
        catch(error){
            logger.warn("El archivo no contiene ningun producto")
        }
    }

    async changeById(objeto,numeroID){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        function findID(objeto) { //Funcion para encontrar el objeto con el Id buscado
            return objeto.id === numeroID;
        }
        if(!data.find(findID)){ //Se usa find para encontrar el objeto buscado
            return {error:'producto no encontrado'}
        }else{//Se cambia todos los parametros del producto encontrado por el nuevo, no importa si son iguales o no
            data.find(findID).timestamp= Date.now()
            data.find(findID).nombre=objeto.nombre;
            data.find(findID).descripcion=objeto.descripcion;
            data.find(findID).codigo=objeto.codigo;
            data.find(findID).foto=objeto.foto;
            data.find(findID).precio=objeto.precio;
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(data))
            return data.find(findID);
        }
    }

    async deleteById(idABorrar){
        let data = await fs.promises.readFile(`./${this.nombreArchivo}`, 'utf-8')
        data=JSON.parse(data)
        let arregloFiltrado = data.filter((objeto) => objeto.id !== idABorrar); //Filta el array de objetos excluyendo el objeto que tenga el Id a Borrar
        if(JSON.stringify(arregloFiltrado) == JSON.stringify(data)){
            return `Producto ID:${idABorrar} no encontrado`
        }else{
            await fs.promises.writeFile(`./${this.nombreArchivo}`, JSON.stringify(arregloFiltrado)) //Reescribo el archivo con el array filtrado
            return `Producto ID:${idABorrar} borrado correctamente`
        }
    }

    async deleteAll(){
        await fs.promises.writeFile(`./${this.nombreArchivo}`, '') //Reescribo el array con nada
    }
}
