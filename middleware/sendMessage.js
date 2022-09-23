import { createTransport } from "nodemailer";
import 'dotenv/config'
import { json } from "express";
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SESSION_SECRET, MODO, MAIL, PASSW } = process.env;

const transporter = createTransport({
    service: "gmail",
    port: 587,
    auth: {
        user: MAIL,
        pass: PASSW,
    },
});
const sendMail = async (asunto, message) => {
    const mensaje = JSON.stringify(message)
    const mailOptions = {
        from: "Servidor Node.js",
        to: MAIL,
        subject: asunto,
        html: mensaje,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
    } catch (err) {
        console.log(err);
    }
}

export {
    sendMail
}