import mongoose from "mongoose";
 
export default mongoose.model('Users',{
    email: String,
    password: String,
    nombre: String,
    direccion: String,
    edad: Number,
    telefono: String,
    avatar: String,
    carrito: String
});
