const { createPool } = require('mysql2')

const pool = createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin@87562227',
    database: 'cadastro',
    connectionLimit: 10
});


module.exports = pool;