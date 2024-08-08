import dotenv from 'dotenv';
import EnvConfig from './types/interface';

dotenv.config();

const { PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME, TOKEN_SECRET_KEY, CLIENT_ORIGIN_URL, EMAIL, PASSWORD } = process.env;

// check whether all env variables are loaded
if (!PORT || !DB_USERNAME || !DB_PASSWORD || !DB_HOST || !DB_NAME || !TOKEN_SECRET_KEY || !CLIENT_ORIGIN_URL || !EMAIL || !PASSWORD) {
    
    throw new Error(`Some evironment variables are missing`);
}

const config:EnvConfig={
    port:PORT,
    db_user:DB_USERNAME,
    db_password:DB_PASSWORD,
    db_host:DB_HOST,
    db_name:DB_NAME,
    secret_key:TOKEN_SECRET_KEY,
    client_origin: CLIENT_ORIGIN_URL,
    senderEmail: EMAIL,
    password:PASSWORD
}

export default config;