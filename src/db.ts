const mysql = require('mysql');
const { db_name, db_password, db_host, db_user } = require('./env-config');

const dbConnection = mysql.createConnection({ 
    host: db_host,
    user: db_user,
    password: db_password,
    database: db_name
});

dbConnection.connect(err => {

    if (err) {
        throw err
    }

    console.log("successful database connection");

});

module.exports = dbConnection;