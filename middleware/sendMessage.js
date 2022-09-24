//NODEMAILER
import logger from '../logger/logger.js'
import { createTransport } from "nodemailer";
import 'dotenv/config'
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME, SESSION_SECRET, MODO, MAIL, PASSW, TWILIOSID, TWILIOTOKEN, TWILIOPHONE, TWILIOWPP } = process.env;

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
        logger.info(`Mail enviado a ${MAIL}`)
    } catch (err) {
        logger.error(err);
    }
}

//TWILIO
import twilio from "twilio";

const accountSid = TWILIOSID;
const authToken = TWILIOTOKEN;


const client = twilio(accountSid, authToken);

const sendSMS = async (message, destino) => {
    const options = {
        body: message,
        from: TWILIOPHONE,
        to: destino,
    };

    try {
        const message = await client.messages.create(options);
        logger.info(`Mensaje enviado a ${destino}`)
    } catch (err) {
        logger.error(err);
    }
}

const sendWPP = async (message, destino) => {
    const options = {
        body: message,
        from: `whatsapp:${TWILIOWPP}`,
        to: `whatsapp:${destino}`,
      };
      
      try {
        const message = await client.messages.create(options);
        logger.info(`Whatsapp enviado a ${destino}`)
      } catch (error) {
        logger.error(error);
      }
}

export {
    sendMail,
    sendSMS,
    sendWPP
}