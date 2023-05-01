import dotenv from 'dotenv'

const environment = 'shghfgd'

dotenv.config({
    path: environment === 'develop' ? './src/config/.env.development' : './src/config/.env.production' 
});

export default {
    endpoint: process.env.ENDPOINT,
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    adminUsername: process.env.ADMIN_USERNAME,
    adminPassword: process.env.ADMIN_PASSWORD
}