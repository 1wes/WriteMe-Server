import mysql from 'mysql';

import envConfig from './env-config'

const { db_name, db_password, db_host, db_user } = envConfig;

var dbConnection = mysql.createConnection({ 
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name
});

dbConnection.connect(err=> {

    if (err) {
        throw err
    }

    console.log("[✅]:Successful database connection");

});

export default dbConnection;