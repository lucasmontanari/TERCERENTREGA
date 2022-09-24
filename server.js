import 'dotenv/config'
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SESSION_SECRET, MODO } = process.env;
import express from 'express'
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
import MongoStore from "connect-mongo";
mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`)
logger.info('Conexion establecida')

//PASSPORT
import { passportSetup } from './middleware/passport.js';

import session from "express-session"
import passport from "passport"

passportSetup(passport);
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };

app.use(
    session({
        store: MongoStore.create({
            mongoUrl:
              `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`,
            mongoOptions
          }),
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

//LOGGER
import logger from './logger/logger.js';

//CLUSTER

if ((modo == "CLUSTER" && cluster.isPrimary)) {
    cpus.map(() => {
        cluster.fork();
    });

    cluster.on("exit", (worker) => {
        logger.info(`Worker ${worker.process.pid} died`)
        cluster.fork()
    })
} else {
    app.use('/api/', express.static(`${__dirname}/public`))

    app.use('/api/', rutas)

    app.listen(puerto, err => {
        if (err) {
            logger.error(`Se produjo un error al iniciar el servidor ${err}`)
        } else {
            logger.info(`El servidor esta escuchando el puerto ${puerto}`)
        }

    })
}