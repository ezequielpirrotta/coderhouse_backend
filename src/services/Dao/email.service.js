import nodemailer from 'nodemailer';
import config from '../../config/config.js';
import __dirname, { generateJWToken } from '../../util.js';

class MailService {
   
    static #transporter
    constructor() {
        if(!MailService.#transporter){
            MailService.#transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: config.gmailAccount,
                    pass: config.gmailAppPassword
                }
            });
        }
        MailService.#transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log('Server is ready to take our messages');
            }
        });
    }
    #mailOptions = (receiver,title,message) => {
        return {
            from: "Coder Test " + config.gmailAccount,
            to: receiver,
            subject: title? title : "Correo de prueba Coderhouse",
            html: `<div><h3>${message? message : "Esto es un Test de envio de correos con Nodemailer!"}</h3></div>`,
            attachments: []
        }
    }
    #mailOptionsForResetPassword = (receiverMail,link) => {
        const token = generateJWToken(receiverMail,"1h")
        return {
            from: "Coder Test " + config.gmailAccount,
            to: receiverMail,
            subject: "Recuperación de contraseña",
            html:`  <div class="card" style="width:400px"> 
                        <div class="card-body"> 
                            <h4 class="card-title">Mensaje de: ${config.gmailAccount} </h4> 
                            <p class="card-text">Este espacio es para recuperar tu contraseña</p> 
                            <a href="${link}/${token}">Click Aqui</a> 
                            <p class="card-text">  ${receiverMail}  </p>     
                        </div>
                    </div>`,
        }
        
    }
    #mailOptionsWithAttachments = (receiver,title,message,attachmentPath=__dirname+'/public/images/meme.png') => {
        return {
            from: "Coder Test " + config.gmailAccount,
            to: receiver?receiver:config.gmailAccount,
            subject: title?title:"Correo de prueba Coderhouse Programacion Backend clase 30.",
            html: `<div>
                        <h1>${message?message:"Esto es un Test de envio de correos con Nodemailer!"}</h1>
                        <p>Ahora usando imagenes: </p>
                        <img src="cid:meme"/>
                    </div>`,
            attachments: [
                {
                    filename: 'Meme de Programacion',
                    path: attachmentPath,
                    cid: 'meme'
                }
            ]
        }
    }
    sendEmail (email,message,title,callback) {
        let finalEmail = email ? email : config.gmailAccount;
        MailService.#transporter.sendMail(this.#mailOptions(finalEmail,title,message), (error, info) => {
            if (error) {
                callback({
                    message: "Error", 
                    payload: error,
                    code: 400
                })
            }
            else {
                callback(null, {message: "Success!", payload: info})
            }
        });
    }
    sendResetPasswordEmail(email,link,callback) {
        let finalEmail = email ? email : config.gmailAccount;
        MailService.#transporter.sendMail(this.#mailOptionsForResetPassword(finalEmail, link), (error, info) => {
            if (error) {
                callback({
                    message: "Error", 
                    payload: error,
                    code: 400
                });
            }
            else {
                callback(null, {message: "Success!", payload: info});
            }
        });
    }
    sendEmailWithAttachments (email,message,title,attachmentPath,callback) {
        
        let finalEmail = email ? email : config.gmailAccount;
        MailService.#transporter.sendMail(this.constructor.#mailOptionsWithAttachments(finalEmail,title,message,attachmentPath), (error, info) => {
            if (error) {
                callback({
                    message: "Error", 
                    payload: error,
                    code: 400
                })
            }
            else {
                callback(null, {message: "Success!", payload: info})
            }
        });
    }
}
export default MailService;
