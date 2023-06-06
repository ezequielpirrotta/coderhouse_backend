import nodemailer from 'nodemailer';
import config from '../config/config.js';
import __dirname from '../util.js';
import { log } from '../config/logger.js';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
});

transporter.verify(function(error, success) {
    if (error) {
        console.log(error);
    } else {
        console.log('Server is ready to take our messages');
    }
  });

const mailOptions = (receiver,title,message) => {
    return {
        from: "Coder Test " + config.gmailAccount,
        to: receiver,
        subject: title? title : "Correo de prueba Coderhouse",
        html: `<div><h1>${message? message : "Esto es un Test de envio de correos con Nodemailer!"}</h1></div>`,
        attachments: []
    }
}

const mailOptionsWithAttachments = () => {
    return {
        from: "Coder Test " + config.gmailAccount,
        to: config.gmailAccount,
        subject: "Correo de prueba Coderhouse Programacion Backend clase 30.",
        html: `<div>
                    <h1>Esto es un Test de envio de correos con Nodemailer!</h1>
                    <p>Ahora usando imagenes: </p>
                    <img src="cid:meme"/>
                </div>`,
        attachments: [
            {
                filename: 'Meme de Programacion',
                path: __dirname+'/public/images/meme.png',
                cid: 'meme'
            }
        ]
    }
}

export const sendEmail = (req, res) => {
    try {
        const {email,message,title} = req.body
        let finalEmail = email ? email : config.gmailAccount;
        let result = transporter.sendMail(mailOptions(finalEmail, message,title), (error, info) => {
            if (error) {
                req.logger.error(log(error.message,req));
                res.status(400).send({message: "Error", payload: error});
            }
            req.logger.info(log('Message sent: %s', info.messageId,req));
            res.send({message: "Success!", payload: info});
        });
    } catch (error) {
        req.logger.error(log(error.message,req));
        res.status(500).send({error:  error, message: "No se pudo enviar el email desde:" + config.gmailAccount});
    }
};

export const sendEmailWithAttachments = (req, res) => {
    try {
        let result = transporter.sendMail(mailOptionsWithAttachments, (error, info) => {
            if (error) {
                req.logger.error(log(error.message,req));
                res.status(400).send({message: "Error", payload: error});
            }
            req.logger.info(log('Message sent: %s', info.messageId,req));
            res.send({message: "Success!", payload: info});
        });
    } catch (error) {
        req.logger.error(log(error.message,req));
        res.status(500).send({error:  error, message: "No se pudo enviar el email desde:" + config.gmailAccount});
    }
    
}