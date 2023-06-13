import dotenv from 'dotenv'

const environment = 'develop'

dotenv.config({
    path: environment === 'develop' ? './src/config/.env.development' : './src/config/.env.production' 
});

export default {
    environment: process.env.ENVIRONMENT,
    serverPort: process.env.SERVER_PORT,
    serverUrl: process.env.SERVER_URL,
    frontUrl: process.env.FRONT_URL,
    mongoUrl: process.env.MONGO_URL,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER
}