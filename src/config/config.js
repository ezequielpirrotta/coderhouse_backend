import dotenv from 'dotenv'
import program from '../process.js';

const environment = program.opts().mode;

dotenv.config({
    path: environment === 'develop' ? './src/config/.env.development' : environment === 'test'?'./src/config/.env.test':'./src/config/.env.production' 
});

export default {
    environment: process.env.ENVIRONMENT,
    serverPort: process.env.SERVER_PORT,
    serverUrl: process.env.SERVER_URL,
    frontUrl: process.env.FRONT_URL,
    mongoUrl: process.env.MONGO_URL,
    mongoUrlTest: process.env.MONGO_URL_TEST,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    privateKey: process.env.PRIVATE_KEY,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER
}