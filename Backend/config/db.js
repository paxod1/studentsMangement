const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: '118.139.179.50',
    user: 'TWSAdmin5',
    password: 'Ahjamtws5#604',
    database: 'TWSAdmin',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

db.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the database');
        connection.release(); 
    }
});

module.exports = db.promise(); 
