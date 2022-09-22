import 'dotenv/config'
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SESSION_SECRET, MODO } = process.env;
import express from 'express'
import multer from "multer";
import rutas from './routes/rutas.js'
import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import cluster from 'cluster'
import os from "os"
const cpus = os.cpus();
const app = express()
const puerto = process.env.PORT || 8080
const modo = MODO

//EJS
const __dirname = dirname(fileURLToPath(import.meta.url));
app.set('views', path.join(__dirname, './public'))
app.set('view engine', 'ejs')

//BASE DE DATOS
import mongoose from "mongoose";
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`)
console.log('Conexion establecida')

//PASSPORT
import { passportSetup } from './middleware/passport.js';

import session from "express-session"
import passport from "passport"

passportSetup(passport);


app.use(
    session({
        secret: SESSION_SECRET,
        cookie: {
            httpOnly: false,
            secure: false,
            maxAge: 600000,
        },
        rolling: true,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if ((modo == "CLUSTER" && cluster.isPrimary)) {
    cpus.map(() => {
        cluster.fork();
    });

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);

        cluster.fork()
    })
} else {
    app.use('/api/', express.static(`${__dirname}/public`))

    app.use('/api/', rutas)

    app.all("*", function (req, res) {
        res.status(404).json({ error: -2, descripcion: `ruta '${req.path}' metodo '${req.method}' no implementada` })
    });

    app.listen(puerto, err => {
        if (err) {
            console.log(`Se produjo un error al iniciar el servidor ${err}`)
        } else {
            console.log(`El servidor esta escuchando el puerto ${puerto}`)
        }

    })
}