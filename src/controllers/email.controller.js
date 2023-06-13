import MailService from "../services/Dao/email.service.js";
import { log } from '../config/logger.js';

const mailService = new MailService()

export const sendEmail = (req, res) => {    
    const {email,message,title} = req.body
    mailService.sendEmail(email,message,title, (error, result) => {
        if(error){
            console.log(error)
            req.logger.error(log(error,req));
            res.status(error.code?error.code:500).send(error);
        }
        else {
            req.logger.info(log(("Message sent: %s", result.payload.messageId),req));
            res.status(200).send(result);
        }
    })
};
export const sendResetPasswordEmail = (req, res) => {
   
    const {email,link} = req.body
    mailService.sendResetPasswordEmail(email, link, (error, result) => {
        if(error){
            req.logger.error(log(error,req));
            res.status(error.code?error.code:500).send(error);
        }
        else {
            req.logger.info(log(("Message sent: %s", result.payload.messageId),req));
            res.status(200).send(result);
        }
    })
};
export const sendEmailWithAttachments = (req, res) => {
   
    mailService.sendEmailWithAttachments(email, link, (error, result) => {
        if(error){
            req.logger.error(log(error,req));
            res.status(error.code?error.code:500).send(error);
        }
        else {
            req.logger.info(log(("Message sent: %s", result.payload.messageId),req));
            res.status(200).send(result);
        }
    })
} 