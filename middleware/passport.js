import 'dotenv/config'
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SESSION_SECRET, MODO } = process.env;
import bcrypt from "bcrypt"
import passport from "passport"
import passportLocal from "passport-local"
const LocalStrategy = passportLocal.Strategy;
import Usuario from "./models.js"
import { sendMail } from "./sendMessage.js"

function hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

function isValidPassword(reqPassword, hashedPassword) {
    return bcrypt.compareSync(reqPassword, hashedPassword);
}

const registerStrategy = new LocalStrategy(
    { usernameField: 'email', passReqToCallback: true },
    async (req, email, password, done) => {
        try {
            const existingUser = await Usuario.findOne({ email });

            if (existingUser) {
                return done("User already exists", false);
            }
            const newUser = {
                email: req.body.email,
                password: hashPassword(password),
                nombre: req.body.nombre,
                direccion: req.body.direccion,
                edad: req.body.edad,
                telefono: req.body.telefono,
                avatar: `http://localhost:8080/api/uploads/${req.file.originalname}`,
                carrito: null
            };

            sendMail("nuevo registro", newUser)

            const createdUser = await Usuario.create(newUser);

            return done(null, createdUser);
        } catch (err) {
            console.log(err);
            done(err);
        }
    }
);


const loginStrategy = new LocalStrategy(
    { usernameField: 'email' }, 
    async (email, password, done) => {
        try {
            const user = await Usuario.findOne({ email });
            if (!user || !isValidPassword(password, user.password)) {
                return done("Invalid credentials", null);
            }

            return done(null, user);
        } catch (err) {
            console.log(err);
            done(err);
        }
    });
export const passportSetup = passport => {
    passport.use("register", registerStrategy);
    passport.use("login", loginStrategy);

    passport.serializeUser((usuario, done) => {
        done(null, usuario._id);
    });

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, done);
    });
}