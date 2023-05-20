import config from "../config/config.js";
import twilio from 'twilio';

const twilioClient = twilio(config.twilioAccountSID, config.twilioAuthToken);
const twilioSMSOptions = {
    body: "Esto es un mensaje SMS de prueba usando Twilio desde Coderhouse.",
    from: config.twilioSmsNumber,
    to: "+XXXXXXXXX"
}

export const sendSMS = async (req, res) => {
    try {
        req.logger.debug(log("Enviando SMS using Twilio account.",req));
        req.logger.debug(log(JSON.stringify(twilioClient),req));
        const result = await twilioClient.messages.create(twilioSMSOptions);
        res.send({message: "Success!", payload: result});
    } catch (error) {
        req.logger.error(log("Hubo un problema enviando el SMS usando Twilio.",req));
        res.status(500).send({error: error});
    }
}