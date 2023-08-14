require('dotenv').config();

const {PORT, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME}=process.env;

module.exports={
    port:PORT,
    db_user:DB_USERNAME,
    db_password:DB_PASSWORD,
    db_host:DB_HOST,
    db_name:DB_NAME
}