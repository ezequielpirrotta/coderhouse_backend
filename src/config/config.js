import dotenv from 'dotenv'

const environment = 'develop'

dotenv.config({
    path: environment === 'develop' ? './src/config/.env.development' : './src/config/.env.production' 
});

export default {
    endpoint: process.env.ENDPOINT,
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD,
    gmailAccount: process.env.GMAIL_ACCOUNT,
    gmailAppPassword: process.env.GMAIL_APP_PASSWD,
    twilioAccountSID: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioSmsNumber: process.env.TWILIO_SMS_NUMBER
}