const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'nodejs',
    password: 'nodejs',
    database: 'nodejs'
});

module.exports = pool.promise();