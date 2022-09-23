import path from 'path'
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

function getRoot(req, res) { }

function getLogin(req, res) {
    if (req.isAuthenticated()) {
        let user = req.user;
        res.render("login-ok", {
            nombre: user.nombre,
            direccion: user.direccion,
            email: user.email,
            edad: user.edad,
            avatar: user.avatar
        });
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    }
}

function getSignup(req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', "register.html"));
}

function postLogin(req, res) {
    let user = req.user;
    res.redirect("/api/home")
}

function postSignup(req, res) {
    let user = req.user;
    res.redirect("/api/home")
    //res.sendFile(path.join(__dirname, '..', 'public', "home.html"));
}

function getFaillogin(req, res) {
    console.log("error en login");
    res.render("login-error", {});
}

function getFailregister(req, res) {
    console.log("error en register");
    res.render("register-error", {});
}

function getLogout(req, res) {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.sendFile(path.join(__dirname, '..', 'public', "logout.html"));
    });
}

function failRoute(req, res) {
    res.status(404).render("routing-error", {});
}

function home(req, res) {
    if (req.isAuthenticated()) {
        let user = req.user;
        res.render("home", {
            nombre: user.nombre,
            direccion: user.direccion,
            email: user.email,
            edad: user.edad,
            avatar: user.avatar
        });
    } else {
        res.sendFile(path.join(__dirname, '..', 'public', 'login.html'));
    }
}


export {
    getRoot,
    getLogin,
    postLogin,
    getFaillogin,
    getLogout,
    failRoute,
    getSignup,
    postSignup,
    getFailregister,
    home
};
